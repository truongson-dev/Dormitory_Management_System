package com.dormitory.entity;

import jakarta.persistence.*;

/**
 * =====================================================
 * Entity: Room - Phòng ký túc xá
 * =====================================================
 * Ánh xạ tới bảng "rooms" trong database.
 *
 * Thuộc tính quan trọng:
 *   - type            : Loại phòng ("Normal" | "VIP")
 *   - capacity        : Sức chứa tối đa của phòng
 *   - currentOccupancy: Số sinh viên đang ở hiện tại
 *   - status          : "Available" (còn chỗ) | "Full" (hết chỗ)
 *   - imageUrl        : Đường dẫn ảnh phòng (lưu trong /uploads/)
 *
 * Quan hệ:
 *   - 1 Room ← nhiều Student (students.room_id → rooms.id)
 *   - 1 Room ← nhiều Invoice (invoices.room_id → rooms.id)
 *   - 1 Room ← nhiều Maintenance (maintenance.room_id → rooms.id)
 *
 * Quy tắc nghiệp vụ:
 *   - Khi currentOccupancy >= capacity → status = "Full"
 *   - Khi currentOccupancy < capacity  → status = "Available"
 *   - Logic này được xử lý ở tầng Service khi phê duyệt sinh viên
 * =====================================================
 */
@Entity
@Table(name = "rooms")
public class Room {

    /** Khóa chính, tự động tăng */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Số phòng - phải là duy nhất (VD: "101", "202", "301") */
    @Column(name = "room_number", unique = true, nullable = false)
    private String roomNumber;

    /** Loại phòng: "Normal" (phổ thông) | "VIP" (cao cấp). Mặc định: Normal */
    @Column(name = "type")
    private String type = "Normal";

    /** Sức chứa tối đa của phòng. Mặc định: 4 người */
    @Column(name = "capacity")
    private Integer capacity = 4;

    /** Số sinh viên đang ở hiện tại. Tự động cập nhật khi duyệt/xóa sinh viên */
    @Column(name = "current_occupancy")
    private Integer currentOccupancy = 0;

    /** Giá thuê phòng mỗi tháng (đơn vị: VNĐ). Mặc định: 0 */
    @Column(name = "price")
    private Double price = 0.0;

    /** Trạng thái phòng: "Available" (có chỗ) | "Full" (đầy). Mặc định: Available */
    @Column(name = "status")
    private String status = "Available";

    /**
     * URL ảnh minh họa của phòng.
     * Được lưu dạng đường dẫn tương đối: "/uploads/id_timestamp_filename.jpg"
     * Có thể null nếu chưa có ảnh.
     */
    @Column(name = "image_url")
    private String imageUrl;

    // ===== Constructor =====
    public Room() {}

    // ===== Getters & Setters =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Integer getCurrentOccupancy() { return currentOccupancy; }
    public void setCurrentOccupancy(Integer currentOccupancy) { this.currentOccupancy = currentOccupancy; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
