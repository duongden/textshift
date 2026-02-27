// ─── STATE ───
let currentMode = 'sentence';

// ─── VIETNAMESE NORMALIZATION ───
function removeVietnamese(str) {
  const map = {
    'à':'a','á':'a','ả':'a','ã':'a','ạ':'a',
    'ă':'a','ắ':'a','ặ':'a','ằ':'a','ẳ':'a','ẵ':'a',
    'â':'a','ấ':'a','ậ':'a','ầ':'a','ẩ':'a','ẫ':'a',
    'è':'e','é':'e','ẻ':'e','ẽ':'e','ẹ':'e',
    'ê':'e','ế':'e','ệ':'e','ề':'e','ể':'e','ễ':'e',
    'ì':'i','í':'i','ỉ':'i','ĩ':'i','ị':'i',
    'ò':'o','ó':'o','ỏ':'o','õ':'o','ọ':'o',
    'ô':'o','ố':'o','ộ':'o','ồ':'o','ổ':'o','ỗ':'o',
    'ơ':'o','ớ':'o','ợ':'o','ờ':'o','ở':'o','ỡ':'o',
    'ù':'u','ú':'u','ủ':'u','ũ':'u','ụ':'u',
    'ư':'u','ứ':'u','ự':'u','ừ':'u','ử':'u','ữ':'u',
    'ỳ':'y','ý':'y','ỷ':'y','ỹ':'y','ỵ':'y',
    'đ':'d',
    'À':'A','Á':'A','Ả':'A','Ã':'A','Ạ':'A',
    'Ă':'A','Ắ':'A','Ặ':'A','Ằ':'A','Ẳ':'A','Ẵ':'A',
    'Â':'A','Ấ':'A','Ậ':'A','Ầ':'A','Ẩ':'A','Ẫ':'A',
    'È':'E','É':'E','Ẻ':'E','Ẽ':'E','Ẹ':'E',
    'Ê':'E','Ế':'E','Ệ':'E','Ề':'E','Ể':'E','Ễ':'E',
    'Ì':'I','Í':'I','Ỉ':'I','Ĩ':'I','Ị':'I',
    'Ò':'O','Ó':'O','Ỏ':'O','Õ':'O','Ọ':'O',
    'Ô':'O','Ố':'O','Ộ':'O','Ồ':'O','Ổ':'O','Ỗ':'O',
    'Ơ':'O','Ớ':'O','Ợ':'O','Ờ':'O','Ở':'O','Ỡ':'O',
    'Ù':'U','Ú':'U','Ủ':'U','Ũ':'U','Ụ':'U',
    'Ư':'U','Ứ':'U','Ự':'U','Ừ':'U','Ử':'U','Ữ':'U',
    'Ỳ':'Y','Ý':'Y','Ỷ':'Y','Ỹ':'Y','Ỵ':'Y',
    'Đ':'D',
  };
  return str.split('').map(c => map[c] || c).join('');
}

// ─── CASE CONVERTERS ───
const converters = {
  sentence(text) {
    return text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase());
  },
  lower(text) {
    return text.toLowerCase();
  },
  upper(text) {
    return text.toUpperCase();
  },
  capital(text) {
    return text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  },
  alternating(text) {
    return text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
  },
  title(text) {
    const small = new Set(['a','an','the','and','but','or','for','nor','on','at','to','by','in','of','up','as','is','it']);
    return text.toLowerCase().split(' ').map((word, i) => {
      if (i === 0 || !small.has(word)) return word.charAt(0).toUpperCase() + word.slice(1);
      return word;
    }).join(' ');
  },
  inverse(text) {
    return text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
  },
  camel(text) {
    const t = removeVietnamese(text.trim()).toLowerCase();
    return t.replace(/[^a-z0-9]+([a-z0-9])/gi, (_, c) => c.toUpperCase())
            .replace(/^[A-Z]/, c => c.toLowerCase())
            .replace(/[^a-zA-Z0-9]/g, '');
  },
  snake(text) {
    const t = removeVietnamese(text.trim()).toLowerCase();
    return t.replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  },
  kebab(text) {
    const t = removeVietnamese(text.trim()).toLowerCase();
    return t.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  },
  pascal(text) {
    const t = removeVietnamese(text.trim()).toLowerCase();
    return t.replace(/(?:^|[^a-z0-9]+)([a-z0-9])/gi, (_, c) => c.toUpperCase())
            .replace(/[^a-zA-Z0-9]/g, '');
  },
  constant(text) {
    const t = removeVietnamese(text.trim()).toUpperCase();
    return t.replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
  },

  // ─── EXTRA TOOLS ───
  reverse(text) {
    return text.split('').reverse().join('');
  },
  removeSpaces(text) {
    return text.replace(/[ \t]+/g, ' ').replace(/^ | $/gm, '');
  },
  removeLines(text) {
    return text.replace(/^\s*[\r\n]/gm, '').trim();
  },
  slugify(text) {
    return removeVietnamese(text.toLowerCase())
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  },
  stripHtml(text) {
    return text.replace(/<[^>]+>/g, '');
  },
  duplicate(text) {
    const lines = text.split('\n');
    const seen = new Set();
    return lines.filter(l => {
      const k = l.trim();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).join('\n');
  },
  wordFreq(text) {
    if (!text.trim()) return '';
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const freq = {};
    words.forEach(w => freq[w] = (freq[w] || 0) + 1);
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([w, c]) => `${w}: ${c}`)
      .join('\n');
  },
  sort(text) {
    return text.split('\n').sort((a, b) => a.localeCompare(b)).join('\n');
  },
  base64e(text) {
    try { return btoa(unescape(encodeURIComponent(text))); }
    catch(e) { return 'Lỗi mã hóa'; }
  },
  base64d(text) {
    try { return decodeURIComponent(escape(atob(text.trim()))); }
    catch(e) { return 'Lỗi giải mã - kiểm tra input'; }
  },
  urle(text) {
    return encodeURIComponent(text);
  },
  urld(text) {
    try { return decodeURIComponent(text); }
    catch(e) { return 'Lỗi giải mã URL'; }
  }
};

// Các mode chạy live (real-time)
const LIVE_MODES = new Set([
  'sentence','lower','upper','capital','alternating',
  'title','inverse','camel','snake','kebab','pascal','constant'
]);

// ─── CORE FUNCTIONS ───
function setMode(btn, mode) {
  currentMode = mode;
  document.querySelectorAll('.case-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  processText();
}

function processText() {
  const ta = document.getElementById('inputText');
  const raw = ta.value;
  updateStats(raw);

  if (!LIVE_MODES.has(currentMode)) return;

  if (raw && converters[currentMode]) {
    const converted = converters[currentMode](raw);
    if (converted !== raw) {
      const pos = ta.selectionStart;
      ta.value = converted;
      try { ta.setSelectionRange(pos, pos); } catch(e) {}
      updateStats(converted);
    }
  }
}

function updateStats(text) {
  document.getElementById('charCount').textContent = text.length;
  document.getElementById('wordCount').textContent = text.trim() ? (text.trim().match(/\S+/g) || []).length : 0;
  document.getElementById('sentCount').textContent = text.trim() ? (text.match(/[.!?]+/g) || []).length || 1 : 0;
  document.getElementById('lineCount').textContent = text ? text.split('\n').length : 0;
}

function loadTool(mode) {
  const el = event.currentTarget;

  if (!document.getElementById('inputText').value.trim()) {
    showToast('Vui lòng nhập văn bản trước!');
    return;
  }

  document.querySelectorAll('.tool-item').forEach(t => t.classList.remove('active'));
  el.classList.add('active');

  const ta = document.getElementById('inputText');
  if (converters[mode]) {
    ta.value = converters[mode](ta.value);
    updateStats(ta.value);
    showToast('✓ Đã chuyển đổi!');
  }

  setTimeout(() => el.classList.remove('active'), 800);
}

// ─── ACTION BUTTONS ───
function copyText() {
  const text = document.getElementById('inputText').value;
  if (!text) { showToast('Không có gì để sao chép'); return; }
  navigator.clipboard.writeText(text).then(() => {
    const fb = document.getElementById('copyFeedback');
    fb.style.display = 'inline-block';
    showToast('✓ Đã sao chép vào clipboard!');
    setTimeout(() => { fb.style.display = 'none'; }, 2000);
  });
}

function downloadText() {
  const text = document.getElementById('inputText').value;
  if (!text) { showToast('Không có gì để tải'); return; }
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'textshift-output.txt';
  a.click();
  showToast('⬇ Đang tải file...');
}

async function pasteText() {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById('inputText').value = text;
    processText();
    showToast('📌 Đã dán văn bản');
  } catch(e) {
    showToast('Không thể truy cập clipboard');
  }
}

function clearText() {
  const ta = document.getElementById('inputText');
  if (!ta.value) return;
  ta.value = '';
  updateStats('');
  currentMode = 'sentence';
  document.querySelectorAll('.case-btn').forEach(b => b.classList.remove('active'));
  showToast('🗑 Đã xóa');
}

// ─── TOAST ───
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ─── THEME ───
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.dataset.theme === 'dark';
  html.dataset.theme = isDark ? 'light' : 'dark';
  document.getElementById('themeBtn').textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', html.dataset.theme);
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  // Restore theme
  const saved = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = saved;
  document.getElementById('themeBtn').textContent = saved === 'dark' ? '☀️' : '🌙';

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const el = document.querySelector(a.getAttribute('href'));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Keyboard shortcut: Ctrl/Cmd + Enter = copy
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') copyText();
  });
});
