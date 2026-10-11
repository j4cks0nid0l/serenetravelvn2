# Serene Travel – Website

Website giới thiệu và tư vấn dịch vụ du lịch Serene Travel (Nha Trang).
Chạy trên **Netlify**, có trang quản trị **Decap CMS** tại `/admin` để tự thêm bài viết, dịch vụ và chỉnh sửa thông tin.

---

## 1. Cấu trúc thư mục

| Thư mục / file | Dùng để làm gì |
|---|---|
| `src/_data/site.json` | Số điện thoại, Zalo, địa chỉ, giờ làm việc, Facebook, TikTok, GPKD |
| `src/_data/menu.json` | 4 danh mục của menu dropdown (Dịch vụ, Vận chuyển, Khách sạn - Resort, Căn hộ - Villa) |
| `src/services/` | Mỗi file là một dịch vụ / khách sạn / xe / căn hộ hiển thị trong menu |
| `src/blog/` | Mỗi file là một bài viết trong **Cẩm nang du lịch** |
| `src/pages/` | Trang tĩnh (Chính sách bảo mật, Điều khoản sử dụng) |
| `src/index.njk` | Trang chủ (hero, giới thiệu, dịch vụ, lý do chọn, form liên hệ) |
| `src/_includes/` | Khung giao diện chung (menu, footer, nút Zalo/gọi điện) |
| `src/css/style.css`, `src/js/main.js` | Giao diện và hiệu ứng |
| `src/images/` | Ảnh của website |
| `netlify/functions/contact.js` | Nhận form tư vấn và gửi về Telegram |
| `netlify.toml` | Cấu hình build cho Netlify |

Đường dẫn trang được tạo tự động:
- Dịch vụ: `/{danh-mục}/{tên-file}/`, ví dụ `/dich-vu/combo-vinpearl/`
- Danh mục: `/{danh-mục}/`, ví dụ `/khach-san-resort/`
- Bài viết: `/cam-nang/{tên-file}/`

---

## 2. Đưa website lên Netlify

1. Tạo tài khoản GitHub (nếu chưa có), tạo một **repository mới** (ví dụ `serene-travel`) và tải toàn bộ nội dung thư mục này lên.
2. Đăng nhập [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project** → chọn GitHub → chọn repository vừa tạo.
3. Netlify sẽ tự đọc `netlify.toml` (lệnh build `npm run build`, thư mục xuất bản `_site`). Bấm **Deploy**.
4. Sau khi deploy xong, website sẽ có địa chỉ dạng `ten-web.netlify.app`.

### Bật trang quản trị (Netlify Identity + Git Gateway)

1. Trong site Netlify: **Site configuration → Identity → Enable Identity**.
2. Mục **Registration**: chọn **Invite only** (chỉ người được mời mới đăng ký được).
3. Mục **Services → Git Gateway → Enable Git Gateway**.
4. Tab **Identity** → **Invite users** → nhập email của bạn → mở email xác nhận và đặt mật khẩu.
5. Truy cập `https://<địa-chỉ-web>/admin`, đăng nhập bằng email vừa đăng ký.

---

## 3. Cấu hình gửi form về Telegram

1. Trong Telegram, tìm **@BotFather**, gửi `/newbot` và làm theo hướng dẫn. Bạn sẽ nhận được **token** của bot.
2. Tạo một nhóm Telegram (hoặc dùng chat riêng), thêm bot vào nhóm. Gửi một tin nhắn bất kỳ trong nhóm.
3. Lấy **chat ID**: mở trình duyệt, vào địa chỉ
   `https://api.telegram.org/bot<TOKEN-CỦA-BẠN>/getUpdates`
   và tìm trường `"chat":{"id": ...}`. Số đó là chat ID (nhóm thường có dấu `-` ở đầu).
4. Trong Netlify: **Site configuration → Environment variables → Add a variable**, thêm 2 biến:
   - `TELEGRAM_BOT_TOKEN` = token của bot
   - `TELEGRAM_CHAT_ID` = chat ID
5. Vào **Deploys → Trigger deploy** để áp dụng biến mới.

> Lưu ý: token là thông tin bí mật. Chỉ đặt trong Netlify, **không** đưa vào file trong repository hay gửi công khai.

---

## 4. Cách thêm và sửa nội dung (không cần biết code)

Vào `https://<địa-chỉ-web>/admin`:

- **Dịch vụ & sản phẩm (menu)**: thêm khách sạn, xe, căn hộ, tour... Chọn đúng **Danh mục menu** và điền **Thứ tự hiển thị** (số nhỏ đứng trước). Bài sẽ tự xuất hiện trong menu dropdown.
- **Cẩm nang du lịch (bài viết)**: viết bài mới với tiêu đề, ngày, mô tả, ảnh bìa và nội dung.
- **Trang tĩnh**: sửa chính sách bảo mật, điều khoản.
- **Thông tin công ty**: sửa số điện thoại, Zalo, địa chỉ, giờ làm việc, Facebook, TikTok, số GPKD khi đã có.
- **Danh mục menu**: thêm hoặc đổi tên danh mục dropdown (cần cẩn thận vì các dịch vụ được gắn theo mã đường dẫn).

Mỗi lần **Save / Publish** trong trang quản trị, website sẽ tự cập nhật sau khoảng 1–2 phút.

---

## 5. Gắn tên miền serenetravel.vn (khi đã mua)

1. Trong Netlify: **Domain management → Add a domain** → nhập `serenetravel.vn`.
2. Làm theo hướng dẫn để trỏ DNS của tên miền về Netlify (Netlify sẽ hiển thị bản ghi cần thêm ở nhà cung cấp tên miền).
3. Netlify tự cấp chứng chỉ HTTPS miễn phí.

---

## 6. Chạy thử trên máy (tuỳ chọn, cần cài Node.js 18 trở lên)

```bash
npm install
npm start
```

Sau đó mở `http://localhost:8080`.

---

## Việc còn cần làm sau khi ra mắt

- Bổ sung nội dung chi tiết, giá và ảnh cho từng dịch vụ (hiện đang ghi "đang được cập nhật").
- Nén ảnh logo (`src/images/logo.jpg` đang khoảng 1,6 MB) để trang tải nhanh hơn.
- Khi có số GPKD, điền vào mục **Thông tin công ty**.
- Nếu sau này cần Google Analytics hoặc Facebook Pixel, cho biết để thêm vào.
