package com.dormitory.entity;

import jakarta.persistence.*;

/**
 * =====================================================
 * Entity: Maintenance - Yêu cầu sửa chữa / bảo trì
 * =====================================================
 * Ánh xạ tới bảng "maintenance" trong database.
 *
 * Luồng trạng thái (status):
 *   [Pending] → (Admin nhận việc) → [In Progress] → (Hoàn thành) → [Completed]
 *
 *   - Pending     : Yêu cầu mới, chờ Admin xử lý
 *   - In Progress : Admin đang xử lý / đã phân công thợ
 *   - Completed   : Đã sửa chữa xong
 *
 * Mức độ ưu tiên (priority):
 *   - "Normal" : Sự cố bình thường, xử lý theo thứ tự
 *   - "Urgent" : Sự cố khẩn cấp, cần xử lý ngay
 *
 * Quan hệ:
 *   - Nhiều Maintenance → 1 Room (room_id là FK tới rooms.id)
 *
 * Luồng nghiệp vụ:
 *   1. Sinh viên/Admin tạo yêu cầu → status = "Pending", createdAt = ngày hôm nay
 *   2. Admin vào trang Bảo trì → thấy danh sách yêu cầu Pending
 *   3. Admin cập nhật status → "In Progress" khi bắt đầu xử lý
 *   4. Admin cập nhật status → "Completed" khi hoàn thành
 * =====================================================
 */
@Entity
@Table(name = "maintenance")
public class Maintenance {

    /** Khóa chính, tự động tăng */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID phòng gặp sự cố.
     * Là khóa ngoại tham chiếu tới rooms.id.
     * Bắt buộc phải có (nullable = false).
     */
    @Column(name = "room_id", nullable = false)
    private Long roomId;

    /**
     * Tiêu đề mô tả ngắn gọn sự cố.
     * VD: "Hỏng bóng đèn tuýp", "Vỡ đường ống nước"
     */
    @Column(name = "title", nullable = false)
    private String title;

    /**
     * Mô tả chi tiết về sự cố và hiện trạng.
     * Lưu kiểu TEXT trong DB để hỗ trợ nội dung dài.
     */
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    /**
     * Mức độ ưu tiên xử lý.
     * Giá trị hợp lệ: "Normal" | "Urgent"
     * Mặc định: "Normal"
     */
    @Column(name = "priority")
    private String priority = "Normal";

    /**
     * Trạng thái xử lý yêu cầu.
     * Giá trị hợp lệ: "Pending" | "In Progress" | "Completed"
     * Mặc định: "Pending"
     */
    @Column(name = "status")
    private String status = "Pending";

    /**
     * Ngày tạo yêu cầu sửa chữa.
     * Dạng chuỗi: "YYYY-MM-DD" (VD: "2024-05-30")
     * Tự động gán bởi MaintenanceService.create() nếu không truyền lên.
     */
    @Column(name = "created_at")
    private String createdAt;

    // ===== Constructor =====
    /** Constructor mặc định bắt buộc của JPA */
    public Maintenance() {}

    // ===== Getters & Setters =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
