# Yoping

Yoping giúp theo dõi chất lượng mạng (WiFi/LAN) trên từng thiết bị. Ứng dụng client (Electron + React) thu thập ping và thông tin WiFi định kỳ, sau đó gửi dữ liệu tóm tắt mỗi phút tới server viết bằng Go và lưu trong ClickHouse. Số liệu được dùng cho dashboard báo cáo tình trạng mạng.

## Cấu trúc thư mục

```
yoping/
├── client/      # Electron app kèm React UI ở client/screen
├── server/
│   ├── backend/ # mã nguồn Go kết nối ClickHouse
│   └── docker-compose.yml # khởi tạo ClickHouse bằng Docker
```

## Công nghệ

- **Client**: Electron + React (thư mục `client/screen`)
- **Server**: Golang + ClickHouse
- **Dashboard**: React (dự kiến phát triển sau)

## Hướng dẫn khởi động

### 1. Clone repo
```bash
git clone https://github.com/Yopaz-Co-Ltd/yoping
cd yoping
```

### 2. Khởi chạy ClickHouse (tuỳ chọn)
```bash
cd server
docker compose up -d
```

### 3. Build & chạy server
```bash
cd server/backend
go build -o yoping-server .
./yoping-server
```

### 4. Chạy client ở chế độ phát triển
```bash
cd client
npm install
npm run dev
```
Lệnh trên đồng thời khởi chạy React (`screen:dev`) và Electron (`app:dev`).

### 5. Build UI và chạy client production
```bash
cd client
npm run screen:build
npm run app:start
```

## Liên kết

- Github: <https://github.com/Yopaz-Co-Ltd/yoping>
- Redmine: <https://redmine.yopaz.vn/projects/yoping>

## Lý do chọn công nghệ

- **Electron + React**: phát triển UI đa nền tảng và truy cập hệ thống (ping, WiFi) qua NodeJS
- **Golang**: hiệu năng cao, dễ triển khai và xử lý log theo lô
- **ClickHouse**: tối ưu cho dữ liệu time-series, hỗ trợ insert/query cực nhanh

Giải pháp giúp theo dõi mạng với tốc độ cao, UI thân thiện và giảm băng thông vì client chỉ gửi dữ liệu tóm tắt.
