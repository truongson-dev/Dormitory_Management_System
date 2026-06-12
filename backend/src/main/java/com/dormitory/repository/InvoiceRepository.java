package com.dormitory.repository;

import com.dormitory.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * =====================================================
 * InvoiceRepository - Tầng truy cập dữ liệu cho Invoice
 * =====================================================
 * Kế thừa JpaRepository để có sẵn các phương thức CRUD cơ bản:
 *   - findAll()      : Lấy tất cả hóa đơn
 *   - findById(id)   : Tìm hóa đơn theo ID
 *   - save(invoice)  : Lưu (tạo mới hoặc cập nhật)
 *   - deleteById(id) : Xóa hóa đơn theo ID
 *
 * Có thể mở rộng thêm:
 *   - findByRoomId(Long roomId)     : Lấy hóa đơn theo phòng
 *   - findByStatus(String status)   : Lấy hóa đơn theo trạng thái (Paid/Unpaid)
 *   - findByMonth(String month)     : Lấy hóa đơn theo tháng
 * =====================================================
 */
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    // Các phương thức CRUD mặc định từ JpaRepository là đủ dùng.
}
