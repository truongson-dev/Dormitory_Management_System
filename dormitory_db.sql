-- =====================================================
-- DORMITORY MANAGEMENT SYSTEM — MySQL Database Schema
-- Xem quan hệ bảng: FLOW_GUIDE.md → Mục 3
-- Xem hướng dẫn chạy: FLOW_GUIDE.md → Phần cuối
--
-- Cách dùng: Mở MySQL Workbench → chạy toàn bộ file này
-- =====================================================
DROP DATABASE IF EXISTS dormitory_db;
CREATE DATABASE dormitory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dormitory_db;
-- =====================================================
-- 1. BẢNG USERS — Tài khoản đăng nhập
--    role: 'ADMIN' | 'STUDENT'
-- =====================================================
CREATE TABLE users (
    id       BIGINT       AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50)  NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role     VARCHAR(20)  NOT NULL DEFAULT 'STUDENT'
);
-- =====================================================
-- 2. BẢNG ROOMS — Phòng ký túc xá
--    type:   'Normal' | 'VIP'
--    status: 'Available' | 'Full'
-- =====================================================
CREATE TABLE rooms (
    id                BIGINT       AUTO_INCREMENT PRIMARY KEY,
    room_number       VARCHAR(10)  NOT NULL UNIQUE,
    type              VARCHAR(20)  NOT NULL DEFAULT 'Normal',
    capacity          INT          NOT NULL DEFAULT 4,
    current_occupancy INT          NOT NULL DEFAULT 0,
    price             DOUBLE       NOT NULL DEFAULT 0,
    status            VARCHAR(20)  NOT NULL DEFAULT 'Available',
    image_url         VARCHAR(255)          DEFAULT NULL
);
-- =====================================================
-- 3. BẢNG STUDENTS — Sinh viên KTX
--    status: 'Pending' | 'Approved' | 'Rejected'
--    Luồng duyệt: FLOW_GUIDE.md → Mục 9
-- =====================================================
CREATE TABLE students (
    id           BIGINT       AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    student_code VARCHAR(20)  NOT NULL UNIQUE,
    phone        VARCHAR(15),
    email        VARCHAR(100),
    join_date    VARCHAR(20),
    room_id      BIGINT,
    status       VARCHAR(20)  NOT NULL DEFAULT 'Pending',
    user_id      BIGINT,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
-- =====================================================
-- 4. BẢNG INVOICES — Hóa đơn phòng
--    type:   'Rent' | 'Electricity' | 'Water'
--    status: 'Unpaid' | 'Paid'
--    Luồng: FLOW_GUIDE.md → Mục 10
-- =====================================================
CREATE TABLE invoices (
    id      BIGINT      AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT,
    type    VARCHAR(30) NOT NULL DEFAULT 'Rent',
    amount  DOUBLE      NOT NULL DEFAULT 0,
    status  VARCHAR(20) NOT NULL DEFAULT 'Unpaid',
    month   VARCHAR(10),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);
-- =====================================================
-- 5. BẢNG MAINTENANCE — Yêu cầu sửa chữa / bảo trì
--    priority: 'Normal' | 'Urgent'
--    status:   'Pending' | 'In Progress' | 'Completed'
--    Luồng: FLOW_GUIDE.md → Mục 11
-- =====================================================
CREATE TABLE maintenance (
    id          BIGINT       AUTO_INCREMENT PRIMARY KEY,
    room_id     BIGINT       NOT NULL,
    title       VARCHAR(100) NOT NULL,
    description TEXT         NOT NULL,
    priority    VARCHAR(20)  NOT NULL DEFAULT 'Normal',
    status      VARCHAR(20)  NOT NULL DEFAULT 'Pending',
    created_at  VARCHAR(20),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);
-- =====================================================
-- DỮ LIỆU MẪU — USERS
-- =====================================================
INSERT INTO users (username, password, role) VALUES
('admin',    '123456123456', 'ADMIN'),
('student1', '123456',       'STUDENT'),
('student2', '123456',       'STUDENT');
-- =====================================================
-- DỮ LIỆU MẪU — ROOMS
-- =====================================================
INSERT INTO rooms (room_number, type, capacity, current_occupancy, price, status, image_url) VALUES
('101', 'Normal', 4, 2, 1500000, 'Available', NULL),
('102', 'VIP',    2, 2, 3000000, 'Full',      NULL),
('103', 'Normal', 4, 0, 1500000, 'Available', NULL),
('201', 'Normal', 4, 3, 1500000, 'Available', NULL),
('202', 'VIP',    2, 1, 3000000, 'Available', NULL),
('203', 'Normal', 4, 4, 1500000, 'Full',      NULL),
('301', 'VIP',    2, 0, 3500000, 'Available', NULL),
('302', 'Normal', 6, 3, 1200000, 'Available', NULL);
-- =====================================================
-- DỮ LIỆU MẪU — STUDENTS
-- =====================================================
INSERT INTO students (name, student_code, phone, email, join_date, room_id, status, user_id) VALUES
('Nguyễn Văn A', 'SV001', '0987654321', 'nva@gmail.com', '2023-09-01', 1, 'Approved', 2),
('Trần Thị B',   'SV002', '0912345678', 'ttb@gmail.com', '2023-09-02', 1, 'Approved', 3),
('Lê Văn C',     'SV003', '0933445566', 'lvc@gmail.com', '2023-08-15', 2, 'Approved', NULL),
('Phạm Thị D',   'SV004', '0977889900', 'ptd@gmail.com', '2023-08-15', 2, 'Approved', NULL),
('Hoàng Văn E',  'SV005', '0911223344', 'hve@gmail.com', '2023-09-05', 4, 'Pending',  NULL),
('Ngô Thị F',    'SV006', '0944556677', 'ntf@gmail.com', '2023-09-10', 4, 'Approved', NULL);
-- =====================================================
-- DỮ LIỆU MẪU — INVOICES
-- =====================================================
INSERT INTO invoices (room_id, type, amount, status, month) VALUES
(1, 'Rent',        1500000, 'Paid',   '2023-09'),
(1, 'Electricity', 250000,  'Unpaid', '2023-09'),
(1, 'Water',       80000,   'Unpaid', '2023-09'),
(2, 'Rent',        3000000, 'Paid',   '2023-09'),
(2, 'Electricity', 320000,  'Paid',   '2023-09');
-- =====================================================
-- DỮ LIỆU MẪU — MAINTENANCE
-- =====================================================
INSERT INTO maintenance (room_id, title, description, priority, status, created_at) VALUES
(1, 'Hỏng bóng đèn tuýp',      'Bóng đèn tuýp ở cửa ra vào bị nhấp nháy liên tục rồi tắt hẳn.', 'Normal', 'Pending',     '2026-05-20'),
(1, 'Gãy vòi nước rửa bát',    'Vòi nước bồn rửa bát bị rò rỉ nước ở chân vòi, áp lực yếu.',   'Urgent', 'In Progress', '2026-05-22'),
(2, 'Hỏng điều hòa nhiệt độ',  'Điều hòa phát ra tiếng kêu to và không mát, chỉ có gió nhẹ.',   'Urgent', 'Pending',     '2026-05-23');