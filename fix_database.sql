-- =====================================================
-- FIX DATABASE - Thêm cột is_active để đăng nhập được
-- =====================================================

USE dormitory_db;

-- Kiểm tra cột is_active có tồn tại chưa
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'dormitory_db' 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'is_active';

-- Thêm cột is_active nếu chưa có
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Set tất cả users = active
UPDATE users SET is_active = TRUE;

-- Kiểm tra kết quả
SELECT id, username, password, role, is_active FROM users;

-- Kết quả mong đợi:
-- +----+----------+--------------+---------+-----------+
-- | id | username | password     | role    | is_active |
-- +----+----------+--------------+---------+-----------+
-- |  1 | admin    | 123456123456 | ADMIN   |         1 |
-- |  2 | student1 | 123456       | STUDENT |         1 |
-- |  3 | student2 | 123456       | STUDENT |         1 |
-- +----+----------+--------------+---------+-----------+

-- ✅ DONE! Giờ có thể đăng nhập với:
-- Username: admin
-- Password: 123456123456
