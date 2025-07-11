# Yoping

Yoping là hệ thống giám sát tình trạng mạng nội bộ và internet theo từng thiết bị, giúp quản lý chất lượng kết nối mạng (WiFi / LAN), khoanh vùng sự cố, và cung cấp báo cáo trực quan.

## 📂 Cấu trúc thư mục

```
yoping/
├── client/       # Electron + ReactJS, chạy trên từng máy client (ping, wifi)
├── server/       # Golang + ClickHouse, nhận log và lưu trữ
├── frontend/     # ReactJS, dashboard báo cáo tình trạng mạng
```

## ⚙ Công nghệ sử dụng

- **Client**: Electron + ReactJS
  - Chạy trên máy người dùng, đo ping, RSSI WiFi, summary từng phút
  - Batch gửi JSON lên server

- **Server**: Golang + ClickHouse
  - REST API nhận dữ liệu summary từ client
  - Lưu trữ dữ liệu `(device_id, minute)` key để tránh duplicate
  - API cho frontend query

- **Frontend**: ReactJS
  - Hiển thị biểu đồ latency, RSSI, packet loss theo thời gian
  - Dashboard quản lý tình trạng theo `device_name` và `location`

## 📈 Nghiệp vụ chính

- Client đo ping (tới router, internet), thu thập thông tin WiFi (SSID, RSSI).
- Tính trung bình theo phút (average latency, max latency, min RSSI, packet loss).
- Gửi summary lên server.
- Server lưu vào ClickHouse với key `(device_id, minute)` để:
  - Dễ retry, không lo duplicate.
  - Tối ưu query cho báo cáo.

- Dashboard web cho phép:
  - Theo dõi tình trạng mạng từng thiết bị
  - Lọc theo device_name, location
  - Cảnh báo latency cao

## 🚀 Hướng dẫn chạy

### 1. Clone repo
```bash
git clone https://github.com/Yopaz-Co-Ltd/yoping
cd yoping
```

### 2. Khởi động server
```bash
cd server
go build -o yoping-server .
./yoping-server
```

### 3. Chạy client Electron
```bash
cd client
npm install
npm run electron:dev
```

### 4. Chạy frontend dashboard
```bash
cd frontend
npm install
npm run dev
```

## ✨ Liên kết

- Github: [https://github.com/Yopaz-Co-Ltd/yoping](https://github.com/Yopaz-Co-Ltd/yoping)
- Redmine: [https://redmine.yopaz.vn/projects/yoping](https://redmine.yopaz.vn/projects/yoping)

## 🤔 Vì sao lựa chọn công nghệ này?

- **Electron + ReactJS (client)**: cho phép dễ dàng phát triển UI đa nền tảng (Windows, macOS, Linux) với khả năng tương tác sâu (ping, wifi) qua NodeJS.
- **Golang (server)**: hiệu suất cao, dễ triển khai binary, dễ scale ngang, xử lý batch logs nhanh.
- **ClickHouse (database)**: tối ưu cho time-series data, lưu trữ log summary lớn với tốc độ insert/query rất cao.
- **ReactJS (frontend)**: frontend dashboard dễ maintain, có nhiều thư viện biểu đồ realtime (recharts, chartjs) hỗ trợ latency, RSSI, packet loss.

➡ Giải pháp này đảm bảo:
- Tốc độ cao (Go + ClickHouse).
- UI thân thiện, dễ mở rộng.
- Tiết kiệm chi phí hạ tầng & băng thông do client chỉ gửi summary.
---