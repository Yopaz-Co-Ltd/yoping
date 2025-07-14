# Hướng dẫn cho AI

Repository gồm backend Go và client Electron/React. Khi cập nhật mã nguồn hãy tuân theo các bước kiểm tra cơ bản dưới đây.

## Kiểm tra bắt buộc

1. **Định dạng Go**: chạy `gofmt -w` cho mọi file `.go` được chỉnh sửa.
2. **Kiểm tra Go**: chạy `go vet ./...` trong `server/backend`.
3. **Định dạng JS/TS**: chạy `npx eslint --fix` trong `client/screen` nếu có thay đổi mã nguồn React.
4. **Lint React**: chạy `npm run lint` trong `client/screen` khi chỉnh sửa ở thư mục này.

Luôn đảm bảo thư mục làm việc sạch (`git status`) trước khi kết thúc.
