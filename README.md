# 🏢 Dormitory Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

Dormitory Management System là một ứng dụng quản lý ký túc xá toàn diện, giúp đơn giản hóa và tối ưu hóa các quy trình quản lý phòng, sinh viên, hóa đơn và yêu cầu bảo trì cho cả ban quản lý và sinh viên.

---

## 🌟 Tính năng nổi bật

### Dành cho Quản trị viên (Admin):
- **Quản lý phòng (Room Management):** Thêm, sửa, xóa và theo dõi trạng thái các phòng (trống, đã kín, đang bảo trì).
- **Quản lý sinh viên (Student Management):** Quản lý hồ sơ sinh viên, sắp xếp phòng và theo dõi thông tin liên lạc.
- **Quản lý hóa đơn (Invoice Management):** Tạo, theo dõi và quản lý các khoản phí (tiền phòng, điện, nước).
- **Quản lý bảo trì (Maintenance):** Tiếp nhận và xử lý các yêu cầu sửa chữa, bảo trì từ sinh viên.
- **Bảng điều khiển (Dashboard):** Xem tổng quan thống kê về tình trạng phòng, doanh thu và các hoạt động.

### Dành cho Sinh viên (Student):
- **Cổng thông tin sinh viên (Student Portal):** Xem thông tin cá nhân và chi tiết phòng đang ở.
- **Thanh toán & Hóa đơn:** Xem lịch sử hóa đơn và trạng thái thanh toán.
- **Yêu cầu bảo trì:** Gửi yêu cầu sửa chữa các vấn đề trong phòng trực tiếp đến ban quản lý.

---

## 💻 Công nghệ sử dụng

Hệ thống được phát triển theo kiến trúc Client-Server hiện đại:

**Frontend:**
- [ReactJS](https://reactjs.org/) - Xây dựng giao diện người dùng
- [Redux](https://redux.js.org/) - Quản lý state
- CSS / HTML5

**Backend:**
- [Java Spring Boot](https://spring.io/projects/spring-boot) - Xây dựng RESTful APIs
- Spring Data JPA - Tương tác cơ sở dữ liệu
- Spring Security - Xác thực và phân quyền

**Cơ sở dữ liệu:**
- MySQL

---

## 📂 Cấu trúc thư mục

```text
Dormitory_Management_System/
│
├── backend/                # Chứa mã nguồn Backend (Spring Boot)
│   ├── src/main/java/      # Các Controllers, Services, Models, Repositories
│   ├── src/main/resources/ # Cấu hình (application.properties)
│   └── pom.xml             # Quản lý thư viện Maven
│
├── database/               # Chứa script khởi tạo Database (.sql)
│
├── public/                 # Các tài nguyên tĩnh Frontend
├── src/                    # Chứa mã nguồn Frontend (React)
│   ├── components/         # Các UI components tái sử dụng
│   ├── pages/              # Các trang chính (Admin, Student, Auth)
│   ├── Redux/              # Actions, Reducers, Store
│   ├── routes/             # Cấu hình Routing
│   └── App.js              # Entry point Frontend
│
└── package.json            # Quản lý thư viện NPM
```

---

## 🚀 Hướng dẫn cài đặt và chạy dự án

### Yêu cầu hệ thống:
- Node.js (v14+)
- Java JDK 11 hoặc mới hơn
- Maven
- MySQL Server

### 1. Thiết lập Cơ sở dữ liệu:
1. Mở MySQL và tạo một database mới, ví dụ: `dormitory_db`.
2. Chạy file script SQL `database/dormitory_db.sql` hoặc `dormitory_db.sql` để tạo các bảng và dữ liệu mẫu.

### 2. Khởi chạy Backend (Spring Boot):
1. Mở thư mục `backend/` bằng IDE (IntelliJ IDEA, Eclipse, VS Code...).
2. Mở file `backend/src/main/resources/application.properties` và cấu hình kết nối Database:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/dormitory_db
   spring.datasource.username=TÊN_ĐĂNG_NHẬP_MYSQL
   spring.datasource.password=MẬT_KHẨU_MYSQL
   ```
3. Chạy file `DormitoryApplication.java`. Backend sẽ chạy tại: `http://localhost:8080` (hoặc port bạn đã cấu hình).

### 3. Khởi chạy Frontend (ReactJS):
1. Mở terminal và di chuyển vào thư mục gốc của dự án.
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi động ứng dụng:
   ```bash
   npm start
   ```
4. Truy cập giao diện ứng dụng tại: `http://localhost:3000`

---

## 📜 Giấy phép (License)
Dự án này được phân phối dưới giấy phép MIT.

---
*Phát triển bởi truongson-dev*
