# NGUYÊN LÝ PUSH, DEPLOY VÀ CƠ CHẾ HOẠT ĐỘNG CỦA CLOUDFLARE WORKERS

Tài liệu này giải thích chi tiết về quy trình **Git Push**, quy trình **Deploy**, và **nguyên lý vận hành thực tế** của ứng dụng Next.js (Trung Hải Website) trên nền tảng Serverless Edge **Cloudflare Workers**.

---

## 1. Tổng Quan Kiến Trúc Hệ Thống (Architecture Overview)

Dự án Website Trung Hải sử dụng kiến trúc phân tán toàn cầu (Global Edge Network) thay vì máy chủ Node.js truyền thống (như VPS, Nginx, Docker):

```
                        +---------------------------------------+
                        |           NGƯỜI DÙNG TRUY CẬP         |
                        +-------------------+-------------------+
                                            |
                                            v
                        +---------------------------------------+
                        |      CLOUDFLARE GLOBAL EDGE NETWORK   |
                        |      (Hơn 300+ Trung tâm dữ liệu)     |
                        +---------+-------------------+---------+
                                  |                   |
            [Tài nguyên tĩnh: HTML, CSS, JS, Icon]    | [Trang SSR, Dynamic Route, API]
                                  |                   |
                                  v                   v
                        +------------------+ +------------------+
                        | CLOUDFLARE ASSETS| | CLOUDFLARE WORKER|
                        |  (Static CDN)    | | (V8 Isolate JS)  |
                        +------------------+ +--------+---------+
                                                      |
                                      +---------------+---------------+
                                      |                               |
                                      v                               v
                            +-------------------+           +-------------------+
                            |   CLOUDFLARE D1   |           |  CLOUDINARY CDN   |
                            |  (SQL Database)   |           | (Hình ảnh, Video) |
                            +-------------------+           +-------------------+
```

---

## 2. Phân Biệt "Git Push" và "Deploy" (Push vs Deploy)

Nhiều lập trình viên hay nhầm lẫn giữa việc đưa code lên GitHub và việc đưa trang web lên môi trường chạy thực tế:

| Khái niệm | `git push` | `deploy` |
| :--- | :--- | :--- |
| **Mục đích** | Đẩy mã nguồn từ máy tính cá nhân lên kho lưu trữ từ xa (GitHub/GitLab) để lưu trữ phiên bản và làm việc nhóm. | Đóng gói, tối ưu hóa mã nguồn thành các file máy đọc được và tải lên máy chủ Cloudflare để người dùng truy cập. |
| **Nơi lưu trữ** | Máy chủ GitHub (`github.com/Trunghaico/website-trunghai`). | Mạng lưới biên Cloudflare Edge (`*.workers.dev` hoặc tên miền chính). |
| **Dạng dữ liệu** | Mã nguồn gốc (TypeScript `.ts`, `.tsx`, `.css`, các file cấu hình). | File nén tối ưu (Worker JS bundle `.open-next/worker.js`, static chunk `.js`, `.css`). |
| **Thời điểm chạy** | Bất cứ khi nào bạn muốn sao lưu tiến độ code. | Khi bạn muốn cập nhật giao diện hoặc tính năng mới cho người dùng thực tế. |

> ⚠️ **Vì sao `git push` mặc định KHÔNG làm Cloudflare Worker tự deploy?**
> GitHub chỉ là nơi lưu trữ code. Cloudflare không tự ý truy cập vào GitHub của bạn trừ khi:
> 1. Bạn đã liên kết GitHub Repo đó trên trang quản trị **Cloudflare Dashboard** (Webhooks).
> 2. Hoặc bạn cấu hình **GitHub Actions Workflow** để tự chạy lệnh deploy mỗi khi có commit mới.

---

## 3. Cơ Chế Hoạt Động Của Cloudflare Workers Với Next.js

### 3.1. V8 Isolates – Trọng tâm sức mạnh của Cloudflare Worker
Khác với kiến trúc truyền thống sử dụng Node.js trong Docker container (mất vài giây hoặc vài phút để khởi động máy chủ):
- **Cloudflare Workers** hoạt động trên nền tảng **V8 Isolates** (công nghệ tạo môi trường thực thi siêu nhẹ của Google Chrome).
- **Không có Cold Start**: Worker khởi động và phản hồi người dùng chỉ trong khoảng **10 - 15 milliseconds** (nhanh gấp hàng chục lần so với máy chủ thông thường).
- **Phân tán tự động**: Code của bạn tự động nhân bản ra hàng trăm máy chủ trên khắp thế giới; người dùng ở Việt Nam sẽ truy cập máy chủ đặt tại TP.HCM/Hà Nội, người dùng ở Mỹ sẽ truy cập máy chủ tại Mỹ.

### 3.2. Vai trò của Adapter `@opennextjs/cloudflare`
Next.js ban đầu được thiết kế chạy trên môi trường Node.js. Để chạy mượt mà trên môi trường V8 Isolate của Cloudflare, dự án sử dụng adapter `@opennextjs/cloudflare`:
Khi chạy build, OpenNext phân tách toàn bộ project thành **2 phần độc lập**:

1. **Phần Tĩnh (Static Assets - `.open-next/assets`)**:
   - Gồm các file: `favicon.ico`, `icon.png`, `apple-icon.png`, CSS compiled, hình ảnh tĩnh, các JS chunks do Next.js sinh ra.
   - Các file này được lưu trực tiếp trên CDN bộ nhớ đệm của Cloudflare. Khi trình duyệt gọi đến, Cloudflare trả về ngay lập tức mà không cần chạy bất kỳ dòng code backend nào.

2. **Phần Động (Server Function - `.open-next/worker.js`)**:
   - Chứa logic Server-Side Rendering (SSR), Server Components, và các API Routes (`/api/news`, `/api/projects`, `/api/slides`, `/api/auth`,...).
   - Được đóng gói thành 1 file JavaScript duy nhất tuân thủ chuẩn Web API (`fetch`, `Request`, `Response`).

### 3.3. Các Bindings Trong `wrangler.toml`
Cloudflare kết nối các dịch vụ với nhau bằng cơ chế **Zero-latency Binding** (kết nối nội bộ bộ nhớ, không tốn thời gian gọi qua giao thức mạng HTTP/TCP bên ngoài):
- **`env.DB`**: Kết nối trực tiếp đến cơ sở dữ liệu **Cloudflare D1 (SQL)**. Các câu lệnh `SELECT`, `INSERT` được thực hiện trực tiếp tại Edge.
- **`env.ASSETS`**: Tự động phục vụ các file tĩnh trong `.open-next/assets`.
- **`[vars]`**: Chứa các biến môi trường cấu hình kết nối Cloudinary và định danh Database.

---

## 4. Từng Bước Diễn Ra Khi Chạy Lệnh `npm run deploy`

Khi bạn gõ lệnh `npm run deploy`, kịch bản sau sẽ tự động thực thi tuần tự:

```bash
opennextjs-cloudflare build && wrangler deploy
```

### Bước 4.1: Quá trình Build (`opennextjs-cloudflare build`)
1. **Next.js Compile**: Chạy `next build` với trình biên dịch Turbopack tốc độ cao.
2. **Kiểm tra TypeScript**: Quét toàn bộ kiểu dữ liệu trong dự án; nếu có bất kỳ lỗi code nào, quá trình sẽ dừng lại ngay lập tức để bảo vệ hệ thống.
3. **Pre-rendering**: Phân loại các trang tĩnh (Static `○`) và trang động (Dynamic Server `ƒ`).
4. **Bundle OpenNext**: Gom toàn bộ server code và các router của Next.js vào `.open-next/worker.js`, xuất các tài nguyên web vào `.open-next/assets`.

### Bước 4.2: Quá trình Deploy (`wrangler deploy`)
1. **Xác thực tài khoản**: Wrangler đọc `account_id` trong `wrangler.toml` và xác thực qua token đã đăng nhập.
2. **So khớp tài nguyên thông minh (Asset Diffing)**:
   - Wrangler quét danh sách file trong `.open-next/assets`.
   - So sánh với các file đã có trên Cloudflare: **Chỉ tải lên những file mới hoặc có thay đổi** (Ví dụ: tải 3 file mới, bỏ qua 40 file không đổi).
3. **Upload Worker Script**: Tải file `.open-next/worker.js` lên hạ tầng Cloudflare.
4. **Phát hành phiên bản mới (Instant Switchover)**:
   - Cloudflare tạo một **Version ID** duy nhất (ví dụ: `2b016da6-40d3-415e-8bb3-63cacd7e0be0`).
   - Ngay lập tức chuyển toàn bộ lưu lượng truy cập của người dùng sang phiên bản mới trong vòng chưa đầy **1 giây** mà **không gây gián đoạn dịch vụ (Zero Downtime)**.

---

## 5. Làm Thế Nào Để Cứ `git push` Là Tự Động Deploy?

Nếu muốn sau này mỗi khi gõ `git push`, Cloudflare tự động deploy mà bạn không cần gõ lệnh thủ công trên máy tính, bạn có thể thiết lập theo 1 trong 2 cách:

### Cách 1: Kết nối Git trực tiếp trên Cloudflare Dashboard (Khuyên dùng)
1. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com/) $\rightarrow$ **Workers & Pages**.
2. Chọn dự án `website-trunghai` $\rightarrow$ vào tab **Settings** $\rightarrow$ **Build & deployments**.
3. Chọn **Connect to Git** $\rightarrow$ Ủy quyền kết nối tới GitHub Repo `Trunghaico/website-trunghai`.
4. Cấu hình thông số build:
   - **Production branch**: `main`
   - **Build command**: `npm run cloudflare-build`
   - **Build output directory**: `.open-next/assets`
5. Bấm **Save and Deploy**. Từ thời điểm này, mỗi commit push lên `main` sẽ tự động được Cloudflare xây dựng và deploy lên production.

### Cách 2: Sử dụng GitHub Actions (.github/workflows)
Bạn có thể tạo một file `.github/workflows/deploy.yml` trong dự án:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build & Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: run deploy
```

---

## 6. Tổng Kết Quy Trình Làm Việc Tiêu Chuẩn

```
Code tính năng mới tại Local (npm run dev)
       |
Kiểm tra hoạt động hoàn chỉnh
       |
Git Commit các thay đổi (git commit -m "...")
       |
Git Push lên kho lưu trữ GitHub (git push origin main)
       |
Deploy lên Cloudflare Worker (npm run deploy)
       |
Website cập nhật ngay lập tức tại:
https://website-trunghai.snowy-frost-9c91.workers.dev
```
