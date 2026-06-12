package com.dormitory.controller;

/**
 * DTO nhận dữ liệu từ request đăng nhập.
 * Xem luồng: FLOW_GUIDE.md → Mục 4
 */
public class LoginRequest {
    private String username;
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
