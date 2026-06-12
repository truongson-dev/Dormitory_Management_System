package com.dormitory.repository;

import com.dormitory.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * =====================================================
 * MaintenanceRepository - Tầng truy cập dữ liệu cho Maintenance
 * =====================================================
 * Kế thừa JpaRepository để có sẵn các phương thức CRUD cơ bản:
 *   - findAll()         : Lấy tất cả yêu cầu bảo trì
 *   - findById(id)      : Tìm yêu cầu theo ID
 *   - save(maintenance) : Lưu (tạo mới hoặc cập nhật)
 *   - deleteById(id)    : Xóa yêu cầu theo ID
 *
 * Custom Query Methods:
 *   - findByRoomId(roomId) : Lấy tất cả yêu cầu của 1 phòng cụ thể.
 *     Spring Data JPA tự sinh câu SQL:
 *     SELECT * FROM maintenance WHERE room_id = ?
 * =====================================================
 */
@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {

    /**
     * Tìm tất cả yêu cầu bảo trì của một phòng cụ thể.
     *
     * @param roomId - ID của phòng cần lọc
     * @return Danh sách yêu cầu bảo trì thuộc phòng đó
     */
    List<Maintenance> findByRoomId(Long roomId);
}
