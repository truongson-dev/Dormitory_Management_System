package com.dormitory.entity;

import jakarta.persistence.*;

/**
 * =====================================================
 * Entity: Invoice - Hóa đơn phòng ký túc xá
 * =====================================================
 * Ánh xạ tới bảng "invoices" trong database.
 *
 * Các loại hóa đơn (type):
 *   - "Rent"        : Tiền phòng hàng tháng
 *   - "Electricity" : Tiền điện
 *   - "Water"       : Tiền nước
 *
 * Trạng thái hóa đơn (status):
 *   - "Unpaid" : Chưa thanh toán (mặc định khi tạo mới)
 *   - "Paid"   : Đã thanh toán
 *
 * Quan hệ:
 *   - Nhiều Invoice → 1 Room (room_id là FK tới rooms.id)
 *
 * Luồng nghiệp vụ:
 *   1. Admin tạo hóa đơn cho phòng vào đầu tháng → status = "Unpaid"
 *   2. Sinh viên/Admin xác nhận thanh toán → status = "Paid"
 *   3. Dashboard đếm số hóa đơn "Unpaid" để cảnh báo
 * =====================================================
 */
@Entity
@Table(name = "invoices")
public class Invoice {

    /** Khóa chính, tự động tăng */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID phòng được xuất hóa đơn.
     * Là khóa ngoại tham chiếu tới rooms.id.
     */
    @Column(name = "room_id")
    private Long roomId;

    /**
     * Loại hóa đơn.
     * Giá trị hợp lệ: "Rent" | "Electricity" | "Water"
     * Mặc định: "Rent"
     */
    @Column(name = "type")
    private String type = "Rent";

    /** Số tiền hóa đơn (đơn vị: VNĐ). Mặc định: 0 */
    @Column(name = "amount")
    private Double amount = 0.0;

    /**
     * Trạng thái thanh toán.
     * Giá trị hợp lệ: "Unpaid" | "Paid"
     * Mặc định: "Unpaid"
     */
    @Column(name = "status")
    private String status = "Unpaid";

    /**
     * Tháng áp dụng hóa đơn.
     * Dạng chuỗi: "YYYY-MM" (VD: "2024-01")
     */
    @Column(name = "month")
    private String month;

    // ===== Constructor =====
    public Invoice() {}

    // ===== Getters & Setters =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
}
