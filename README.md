# TextShift

Công cụ chuyển đổi văn bản chạy hoàn toàn trên trình duyệt. Không cần server, không cần đăng ký, không thu thập dữ liệu.

🌐 **Demo**: [textshift.pages.dev](https://textshift.pages.dev)

---

## Tính năng

**Chuyển đổi case**
- Sentence case, lower case, UPPER CASE
- Capitalized Case, Title Case, iNVERSE CaSe
- aLtErNaTiNg cAsE
- camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE

**Công cụ văn bản**
- Đảo ngược văn bản
- Xóa khoảng trắng thừa / dòng trống / dòng trùng lặp
- Tạo slug URL (hỗ trợ tiếng Việt)
- Xóa HTML tags
- Sắp xếp dòng A→Z
- Đếm tần suất từ
- Base64 Encode / Decode
- URL Encode / Decode

**Khác**
- Dark mode, tự lưu preference
- Đếm ký tự / từ / câu / dòng real-time
- Hỗ trợ tiếng Việt đầy đủ

---

## Cấu trúc

```
textshift/
├── index.html   # HTML
├── style.css    # CSS & CSS variables (light/dark theme)
└── main.js      # Logic JavaScript
```

---

## Deploy

Dự án là static site thuần — không cần build step.

**Cloudflare Pages**
1. Push code lên GitHub
2. Vào [pages.cloudflare.com](https://pages.cloudflare.com) → Create project → Connect to Git
3. Chọn repo, để trống Build command và Build output directory
4. Save and Deploy

Mỗi lần push code mới, Cloudflare tự động deploy lại.
