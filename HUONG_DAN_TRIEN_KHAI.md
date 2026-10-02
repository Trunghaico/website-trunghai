# HƯỚNG DẪN TRIỂN KHAI WEBSITE TRUNG HẢI (VERCEL + CLOUDFLARE D1 + CLOUDINARY)

Dự án website **CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI** được xây dựng trên nền tảng **Next.js (App Router)** tối tân, tối ưu chuẩn SEO, tự động điều chỉnh độ phân giải ảnh qua **Cloudinary CDN** và lưu trữ dữ liệu phân tán tại Edge thông qua **Cloudflare D1**.

---

## 1. Cấu Trúc Menu & Trang Đã Hoàn Thành
- **Header**: Dạng trong suốt khi ở đầu trang, tự động chuyển nền kính mờ (glassmorphism/solid) khi cuộn chuột.
- **Menu Header**:
  - `Trang chủ`: Banner slide hình ảnh đại công trình (Hầm Đèo Cả, Hầm Cù Mông, Hầm Phước Tượng, Quốc lộ 1).
  - `Giới thiệu`: Lịch sử, tầm nhìn, năng lực công ty, thông tin pháp lý MST `0312019045`, trụ sở 40-42 Thạch Thị Thanh, Q.1.
  - `Lĩnh vực hoạt động`: Thi công hầm xuyên núi NATM, cầu dầm Super T, đường sắt, xử lý sạt trượt ta luy, thiết bị cơ giới nặng.
  - `Công trình`: Danh sách dự án trọng điểm kèm bộ lọc hạng mục và popup xem chi tiết dự án + thông số kỹ thuật.
  - `Tin tức`: Tin dự án, thi đua công trường, an toàn lao động.
  - `Tuyển dụng`: Các vị trí tuyển dụng (Kỹ sư hiện trường, Chỉ huy trưởng, Trắc đạc) và form nộp CV trực tuyến.
- **Trang Quản Trị (Admin CMS)** tại đường dẫn: `/admin`
  - Đăng/sửa/xóa dự án công trình.
  - Đăng/sửa/xóa bài viết tin tức.
  - Quản lý tin tuyển dụng.
  - Công cụ upload ảnh lên Cloudinary để lấy link URL trực tiếp.
  - Cập nhật số hotline, email, địa chỉ công ty.

---

## 2. Cách Chạy Thử Tại Local (Máy Tính Của Bạn)
1. Mở terminal tại thư mục này:
   ```bash
   npm run dev
   ```
2. Truy cập trình duyệt:
   - Giao diện người dùng: `http://localhost:3000`
   - Giao diện quản trị Admin: `http://localhost:3000/admin`

*(Lưu ý: Ngay cả khi chưa nhập key Cloudflare D1 hay Cloudinary, website vẫn chạy mượt mà 100% nhờ cơ chế bộ nhớ đệm tự động tích hợp sẵn!)*

---

## 3. Các Bước Triển Khai Lên Vercel (Production)

### Bước 1: Đẩy mã nguồn lên GitHub / GitLab
Tạo một repository mới trên GitHub (ví dụ: `web-trunghai`) và đẩy code lên:
```bash
git init
git add .
git commit -m "Khoi tao website Trung Hai JSC"
git branch -M main
git remote add origin https://github.com/<tai-khoan>/web-trunghai.git
git push -u origin main
```

### Bước 2: Import dự án vào Vercel
1. Truy cập [vercel.com](https://vercel.com) và đăng nhập.
2. Chọn **"Add New..."** -> **"Project"** -> chọn repository `web-trunghai`.
3. Vercel sẽ tự động phát hiện framework là **Next.js**.

### Bước 3: Cấu hình Cơ sở dữ liệu Cloudflare D1
1. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com/) -> vào mục **Workers & Pages** -> chọn **D1 SQL Database**.
2. Nhấn **Create Database** (ví dụ đặt tên: `trunghai_db`).
3. Mở tab **Console** trong database vừa tạo, dán toàn bộ nội dung trong file [schema.sql](file:///c:/Users/LONG%20IT/Desktop/web-trunghai/schema.sql) và bấm **Execute** để tạo các bảng `projects`, `news`, `jobs`, `settings`.
4. Lấy các thông số:
   - `Account ID` (ở thanh bên phải tổng quan của Cloudflare).
   - `Database ID` (trong trang chi tiết database D1).
   - `API Token` (vào *My Profile* -> *API Tokens* -> tạo token có quyền chỉnh sửa D1).

### Bước 4: Cấu hình Cloudinary
1. Đăng ký tài khoản miễn phí tại [cloudinary.com](https://cloudinary.com).
2. Vào **Settings** -> **Upload** -> tạo một **Upload preset** dạng *Unsigned* đặt tên là `trunghai_uploads`.
3. Lấy tên `Cloud Name` từ trang Dashboard của Cloudinary.

### Bước 5: Điền Biến Môi Trường (Environment Variables) trên Vercel
Trong trang cài đặt dự án trên Vercel (mục *Environment Variables*), thêm các khóa sau:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_D1_DATABASE_ID`
- `CLOUDFLARE_API_TOKEN`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (giá trị: `trunghai_uploads`)

Sau đó nhấn **Deploy**. Website sẽ được xuất bản lên internet và sẵn sàng trỏ tên miền chính `trunghaico.vn`!
