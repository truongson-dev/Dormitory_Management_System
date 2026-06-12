package com.dormitory.repository;

import com.dormitory.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * =====================================================
 * UserRepository - Tầng truy cập dữ liệu cho User
 * =====================================================
 * Kế thừa JpaRepository để có sẵn các phương thức CRUD cơ bản:
 *   - findAll()    : Lấy tất cả người dùng
 *   - findById(id) : Tìm người dùng theo ID
 *   - save(user)   : Lưu (tạo mới hoặc cập nhật)
 *   - deleteById() : Xóa người dùng theo ID
 *
 * Custom Query Methods:
 *   - findByUsername(username) : Tìm user theo tên đăng nhập.
 *     Được sử dụng trong:
 *       + UserService.login()    → xác thực đăng nhập
 *       + UserService.register() → kiểm tra username đã tồn tại chưa
 *     Spring Data JPA tự sinh câu SQL:
 *     SELECT * FROM users WHERE username = ?
 * =====================================================
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Tìm kiếm người dùng theo tên đăng nhập.
     * Trả về Optional để an toàn khi không tìm thấy (không ném NullPointerException).
     *
     * @param username - Tên đăng nhập cần tìm
     * @return Optional chứa User nếu tìm thấy, Optional.empty() nếu không có
     */
    Optional<User> findByUsername(String username);
}
