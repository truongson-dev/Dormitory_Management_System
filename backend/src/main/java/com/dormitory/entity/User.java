package com.dormitory.entity;

import jakarta.persistence.*;

/**
 * =====================================================
 * Entity: User - Tài khoản đăng nhập hệ thống
 * =====================================================
 * Ánh xạ tới bảng "users" trong database.
 *
 * Vai trò trong hệ thống:
 *   - ADMIN   : Quản lý toàn bộ KTX (phòng, sinh viên, hóa đơn, bảo trì)
 *   - STUDENT : Xem thông tin phòng, gửi yêu cầu bảo trì của mình
 *
 * Quan hệ:
 *   - 1 User có thể liên kết với 1 Student (qua trường user_id trong bảng students)
 *
 * Lưu ý bảo mật:
 *   - Hiện tại mật khẩu lưu dạng plain text (chưa mã hóa)
 *   - Khuyến nghị dùng BCryptPasswordEncoder trong Spring Security khi triển khai thực tế
 * =====================================================
 */
@Entity
@Table(name = "users")
public class User {

    /** Khóa chính, tự động tăng */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Tên đăng nhập - phải là duy nhất trong hệ thống */
    @Column(name = "username", unique = true, nullable = false)
    private String username;

    /**
     * Mật khẩu của người dùng.
     * TODO: Trong môi trường production, nên mã hóa bằng BCrypt trước khi lưu.
     */
    @Column(name = "password", nullable = false)
    private String password;

    /**
     * Vai trò người dùng trong hệ thống.
     * Giá trị hợp lệ: "ADMIN" | "STUDENT"
     * Mặc định là "STUDENT" khi đăng ký mới.
     */
    @Column(name = "role", nullable = false)
    private String role = "STUDENT";

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    // ===== Constructor =====
    public User() {}

    // ===== Getters & Setters =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
