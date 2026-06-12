package com.dormitory.repository;

import com.dormitory.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * =====================================================
 * RoomRepository - Tầng truy cập dữ liệu cho Room
 * =====================================================
 * Kế thừa JpaRepository để có sẵn các phương thức CRUD cơ bản:
 *   - findAll()    : Lấy tất cả phòng
 *   - findById(id) : Tìm phòng theo ID
 *   - save(room)   : Lưu (tạo mới hoặc cập nhật)
 *   - deleteById(id) : Xóa phòng theo ID
 *
 * Lưu ý: Khi xóa phòng có sinh viên hoặc hóa đơn liên kết,
 * cần xử lý trước ở tầng Service để tránh lỗi FK constraint.
 * =====================================================
 */
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    // Các phương thức CRUD mặc định từ JpaRepository là đủ dùng.
    // Có thể thêm: Optional<Room> findByRoomNumber(String roomNumber);
}
