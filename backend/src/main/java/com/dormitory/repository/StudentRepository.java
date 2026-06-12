package com.dormitory.repository;

import com.dormitory.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * =====================================================
 * StudentRepository - Tầng truy cập dữ liệu cho Student
 * =====================================================
 * Kế thừa JpaRepository để có sẵn các phương thức CRUD cơ bản:
 *   - findAll()       : Lấy tất cả sinh viên
 *   - findById(id)    : Tìm sinh viên theo ID
 *   - save(student)   : Lưu (tạo mới hoặc cập nhật)
 *   - deleteById(id)  : Xóa sinh viên theo ID
 *
 * Không cần viết SQL thủ công nhờ Spring Data JPA tự sinh code.
 * =====================================================
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    // Các phương thức CRUD mặc định từ JpaRepository là đủ dùng.
    // Có thể thêm custom query ở đây nếu cần tìm theo tên, mã SV, v.v.
    // VD: List<Student> findByRoomId(Long roomId);
}
