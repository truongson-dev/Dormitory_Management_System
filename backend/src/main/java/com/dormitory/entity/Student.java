package com.dormitory.entity;

import jakarta.persistence.*;

/**
 * =====================================================
 * Entity: Student - Sinh viên ký túc xá
 * =====================================================
 * Ánh xạ tới bảng "students" trong database.
 *
 * Luồng trạng thái (status):
 *   [Pending] → (Admin duyệt) → [Approved]
 *   [Pending] → (Admin từ chối) → [Rejected]
 *
 *   - Pending  : Vừa đăng ký, chờ Admin xét duyệt
 *   - Approved : Được chấp thuận, đã có chỗ ở trong KTX
 *   - Rejected : Bị từ chối vào KTX
 *
 * Quan hệ:
 *   - Nhiều Student → 1 Room (room_id là FK tới rooms.id)
 *   - 1 Student → 1 User (user_id là FK tới users.id) [có thể null]
 *
 * Lưu ý:
 *   - Một sinh viên có thể chưa có tài khoản (user_id = null)
 *   - Khi Admin duyệt sinh viên vào phòng, cần cập nhật currentOccupancy của Room
 * =====================================================
 */
@Entity
@Table(name = "students")
public class Student {

    /** Khóa chính, tự động tăng */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Họ và tên đầy đủ của sinh viên */
    @Column(name = "name", nullable = false)
    private String name;

    /** Mã sinh viên - phải là duy nhất (VD: "SV001", "SV002") */
    @Column(name = "student_code", unique = true, nullable = false)
    private String studentCode;

    /** Số điện thoại liên lạc */
    @Column(name = "phone")
    private String phone;

    /** Địa chỉ email */
    @Column(name = "email")
    private String email;

    /** Ngày bắt đầu vào KTX (dạng chuỗi "YYYY-MM-DD") */
    @Column(name = "join_date")
    private String joinDate;

    /**
     * ID phòng sinh viên đang ở.
     * Là khóa ngoại tham chiếu tới rooms.id.
     * Có thể null nếu sinh viên chưa được xếp phòng.
     */
    @Column(name = "room_id")
    private Long roomId;

    /**
     * Trạng thái đơn đăng ký KTX.
     * Giá trị hợp lệ: "Pending" | "Approved" | "Rejected"
     * Mặc định: "Pending" khi tạo mới.
     */
    @Column(name = "status")
    private String status = "Pending";

    /**
     * ID tài khoản User liên kết.
     * Là khóa ngoại tham chiếu tới users.id.
     * Có thể null nếu sinh viên chưa có tài khoản đăng nhập.
     */
    @Column(name = "user_id")
    private Long userId;

    // ===== Constructor =====
    public Student() {}

    // ===== Getters & Setters =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStudentCode() { return studentCode; }
    public void setStudentCode(String studentCode) { this.studentCode = studentCode; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getJoinDate() { return joinDate; }
    public void setJoinDate(String joinDate) { this.joinDate = joinDate; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
