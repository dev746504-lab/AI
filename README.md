# WonderSnap

**Các mô hình 3D điều khiển bằng cử chỉ tay, tạo nên từ những hạt sáng, chạy hoàn toàn trong trình duyệt của bạn.**

Búng tay trước webcam và tới 250.000 hạt GPU sẽ xoáy lên thành hình. Nắm tay để chúng dựng thành tháp Eiffel, một trái tim đang đập hay một động cơ V8. Mở bàn tay để mô hình chuyển sang cái kế tiếp, hoặc nổ tung thành sơ đồ có chú thích cho từng bộ phận. Không cần chuột, không cần tay cầm, không cần cài đặt gì ngoài Node.js.

![WonderSnap hiển thị một trái tim người đang đập tạo từ các hạt](docs/preview.png)

## Bắt đầu nhanh

Bạn cần [Node.js](https://nodejs.org/) 18 trở lên và một webcam (không bắt buộc: mọi thứ đều dùng được bằng chuột và bàn phím).

```bash
git clone https://github.com/dev746504-lab/AI.git
cd AI
npm install
npm start
```

Sau đó mở **http://localhost:5173** bằng Chrome hoặc Edge và bấm **Bắt đầu với camera**, hoặc **Tiếp tục không dùng camera** để điều khiển bằng nút trên màn hình và bàn phím.

> Trình duyệt chỉ cho phép truy cập camera trên `localhost` hoặc `https`, vì vậy ứng dụng đi kèm một server cục bộ rất nhỏ. Để dùng cổng khác: `npm start -- 8080`.

## Cách hoạt động

| Tầng | Chức năng |
|---|---|
| **Nhận diện bàn tay** | [MediaPipe Hand Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker) theo dõi tối đa hai bàn tay (21 điểm mốc mỗi tay) từ webcam, hoàn toàn trên máy bạn |
| **Nhận diện cử chỉ** | Các bộ phân loại tự viết biến điểm mốc thành tư thế (nắm, mở, chỉ, chụm, chữ V), bộ nhận diện cú búng tay, xoay/nghiêng tay và thu phóng hai tay, rồi đưa qua bộ lọc nhiễu và máy trạng thái |
| **Hệ thống hạt** | Bộ render WebGL2 tự viết. Vật lý hạt chạy trên GPU bằng transform feedback: không Three.js, không game engine, không framework |
| **Mô hình** | 41 mô hình procedural dựng từ số đo thực rồi lấy mẫu thành đám mây điểm, có các bộ phận được đặt tên, có thể nổ tung, phát sáng và kéo ra |
| **Server** | Một server tĩnh Node.js không phụ thuộc thư viện nào (`server.mjs`) |

Không có gì được gửi đi đâu cả: video không bao giờ rời khỏi máy bạn.

## Cử chỉ

| Cử chỉ | Tác dụng |
|---|---|
| 🫰 **Búng tay** | Gọi các hạt ra, hoặc làm mô hình tan đi |
| ✊ **Nắm tay** | Dựng kỳ quan, cơ quan hoặc cỗ máy |
| ✋ **Mở bàn tay** | Kỳ quan chuyển sang cái kế tiếp. Cơ quan, động cơ và phương tiện sẽ **nổ tung**: mở tay càng rộng thì các bộ phận bay càng xa, nắm lại sẽ ghép về |
| 🔄 **Xoay / nâng tay** | Xoay và nghiêng mô hình đã dựng |
| ☝️ **Chỉ tay** | Giữ ngón tay trên một bộ phận để chọn. Bộ phận sáng lên và một thẻ giải thích chức năng của nó |
| 🤏 **Chụm ngón** | Kéo bộ phận đã chọn về phía bạn; chụm lần nữa để đặt lại |
| 🙌 **Hai tay** | Dang ra hoặc thu lại để thu phóng |
| ✌️ **Chữ V** | Nhảy sang mô hình kế tiếp |

## Bàn phím và chuột

| Phím | Tác dụng |
|---|---|
| `Space` | Búng tay |
| `F` / `O` / `V` | Nắm tay / mở tay / chữ V |
| `←` `→` | Mô hình trước / kế tiếp |
| `E`, `↑` `↓`, lăn chuột | Mức nổ tung |
| `+` `-` `0`, ctrl + lăn chuột | Thu phóng |
| `C` | Bật/tắt camera |
| `L` | Nhãn bộ phận |
| `R` | Tự xoay |
| `G` | Bật/tắt xoay bằng tay |
| `X` | Mặt cắt ngang (`,` và `.` để dịch mặt phẳng cắt) |
| `Q` | Chế độ đố vui |
| `M` | Lệnh giọng nói và đọc to |
| `K` | Quay video |
| `D` | Chạy demo |
| `I` / `Esc` | Mô tả / bỏ chọn bộ phận đang chọn |
| `H` | Trợ giúp |

Nhấp chuột vào một bộ phận để chọn, kéo chuột để xoay.

## Tính năng

- **Tim đập và phổi thở.** Tim co bóp theo nhịp "lub-dub" 72 nhịp/phút, phổi phồng lên mỗi 4,5 giây, và các xung ánh sáng chạy trong chúng như máu hay không khí.
- **Nổ tung với các bộ phận có tên.** Mỗi bộ phận có đường dẫn nhãn nói rõ chức năng của nó.
- **Chế độ đố vui.** "Tìm: Hippocampus": chỉ tay (hoặc nhấp chuột) vào đúng bộ phận. Năm câu hỏi, có tính điểm.
- **Điều khiển bằng giọng nói.** Nói (bằng tiếng Anh) "show me the heart", "open it up", "where is the right atrium", "zoom in", "quiz"… Các bộ phận được đọc to bằng tổng hợp giọng nói (Chrome hoặc Edge).
- **Mặt cắt.** Một mặt phẳng cắt đi theo bàn tay bạn và để lộ tiết diện phát sáng.
- **Quay video.** Lưu video WebM của cảnh đang xem.

## Các mô hình

| Nhóm | Mô hình |
|---|---|
| **Kỳ quan (11)** | Tháp Rùa, Tháp Eiffel, Tượng Nữ thần Tự do, Burj Khalifa, Đại Kim tự tháp, Đấu trường La Mã, Tháp nghiêng Pisa, Taj Mahal, Big Ben, Tượng Chúa Cứu thế, Nhà hát Opera Sydney |
| **Giải phẫu (10)** | Não, Tim đang đập, Thận, Phổi đang thở, Mắt, Tai, Răng, Hộp sọ, Bộ xương, Cơ thể người (da, nội tạng, thần kinh, động mạch, tĩnh mạch, xương) |
| **Sinh học (2)** | Chuỗi xoắn kép DNA có thể tách đôi, Tế bào động vật |
| **Động cơ (4)** | Động cơ thẳng hàng 4 xi-lanh, HEMI V8 tăng áp, Động cơ phản lực turbofan, Động cơ hình sao 9 xi-lanh |
| **Phương tiện (4)** | Xe thể thao, Xe máy, Máy bay chở khách, Tên lửa Saturn V (có tách tầng) |
| **Máy móc (3)** | Đồng hồ cơ đeo tay, Bộ pin xe điện (280 cell, thanh dẫn, làm mát, BMS), Robot AI (chip NPU, pin, servo, camera, lõi năng lượng) |
| **Trí tuệ nhân tạo (7)** | Mạng nơ-ron, Mạng tích chập (CNN), Transformer (LLM), Nơ-ron sinh học và nhân tạo, Chip GPU AI, Xe tự lái, Trung tâm dữ liệu AI |

## Độ nhạy cử chỉ

Mục **Độ nhạy cử chỉ** trong bảng trạng thái mặc định là **Tiêu chuẩn**, giữ nguyên ngưỡng cử chỉ ban đầu. Chế độ **Dễ tính hơn** nới lỏng đôi chút việc nhận diện tư thế tay tĩnh và độ mở bàn tay. Việc nhận diện búng tay và chụm ngón không thay đổi, và lựa chọn chỉ có hiệu lực trong phiên trang hiện tại.

## Tùy chọn trên URL

| Tùy chọn | Tác dụng |
|---|---|
| `?n=250000` | Số lượng hạt |
| `?model=12` | Bắt đầu ở một mô hình cụ thể |
| `?autostart=camera` / `?autostart=nocamera` | Bỏ qua màn hình bắt đầu |
| `?trails=0` | Tắt vệt sáng của hạt |
| `?dpr=1` | Ép tỉ lệ điểm ảnh của thiết bị (hữu ích với GPU yếu) |

## Kiểm thử

39 bài kiểm thử đầu-cuối và đơn vị bằng [Playwright](https://playwright.dev/), điều khiển ứng dụng thật với các bàn tay giả lập trên đồng hồ xác định.

```bash
npx playwright install chromium   # chạy một lần
npm test
```

| Tệp test | Phạm vi |
|---|---|
| `app.spec.js` | Toàn bộ câu chuyện cử chỉ, mọi mô hình, nổ tung/ghép lại, bàn phím, lăn chuột, các tab, demo, giao diện điện thoại, xoay và nghiêng tay |
| `features.spec.js` | Nhịp tim và hơi thở, thu phóng hai tay, chỉ để chọn, chụm để kéo ra, đố vui, lệnh giọng nói, mặt cắt, quay video |
| `camera.spec.js` | `getUserMedia` thật tới MediaPipe trên webcam giả của Chromium, cùng cách xử lý khi bị từ chối camera |
| `gpu.spec.js` | Shader vật lý trên GPU khớp với bản sao trên CPU ở mức ~1e-7 trong mọi chế độ |
| `logic.spec.js` | Bộ phân loại tư thế, bộ nhận diện búng tay, bộ lọc nhiễu, máy trạng thái, bộ điều khiển, bộ phân tích lệnh giọng nói |
| `models.spec.js` | Mọi mô hình đều xác định, hữu hạn và nhanh, có số đo thực và các bộ phận nổ tung đúng cách |

## Cấu trúc dự án

```
index.html, styles.css     trang và kiểu dáng
server.mjs                 server tĩnh không phụ thuộc thư viện
models/                    mô hình điểm mốc bàn tay của MediaPipe
vendor/mediapipe/          runtime MediaPipe (để các host tĩnh như Vercel phục vụ được)
src/app.js                 vòng lặp render, nổ tung, thu phóng, chọn bộ phận, đố vui, mặt cắt, HUD, nhãn, demo
src/hands.js               webcam + MediaPipe Hand Landmarker
src/features.js            lệnh giọng nói, đọc to, quay video
src/gl/                    shader và bộ render WebGL2 (vật lý transform-feedback)
src/logic/                 cử chỉ, máy trạng thái, bộ điều khiển, bản sao vật lý trên CPU
src/lib/                   toán vector, bộ lấy mẫu, hình dạng procedural
src/models/                kỳ quan, giải phẫu, sinh học, động cơ, phương tiện, máy móc
tests/                     các bài test Playwright
```

## Xử lý sự cố

- **Camera không khởi động:** hãy mở ứng dụng qua `http://localhost:5173`, đừng nhấp đúp vào `index.html`, và cho phép truy cập camera khi trình duyệt hỏi.
- **Nhận diện bàn tay không tải được:** kiểm tra thư mục `vendor/mediapipe/` có đủ trong dự án.
- **Tốc độ khung hình thấp:** thử `http://localhost:5173/?n=100000&dpr=1`.
- **Cổng đã được dùng:** `npm start -- 8080` rồi mở `http://localhost:8080`.

## Giấy phép

[MIT](LICENSE) © 2026 Akbar Sheikh
