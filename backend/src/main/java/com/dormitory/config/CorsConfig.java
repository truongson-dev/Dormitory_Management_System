package com.dormitory.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * =====================================================
 * CorsConfig - Cấu hình CORS (Cross-Origin Resource Sharing)
 * =====================================================
 * Mục đích:
 *   Cho phép React Frontend (localhost:3000) gọi API
 *   tới Spring Boot Backend (localhost:8080) mà không
 *   bị trình duyệt chặn do chính sách CORS.
 *
 * Luồng hoạt động:
 *   Browser (React) → gửi HTTP request → Spring Boot
 *   → Spring Boot kiểm tra Origin trong header
 *   → Nếu Origin trong danh sách cho phép → Chấp nhận
 *   → Ngược lại → Trả về lỗi CORS 403
 * =====================================================
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Cấu hình cho phép cross-origin request từ React app.
     *
     * @param registry - Đối tượng CorsRegistry để đăng ký cấu hình
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")                          // Áp dụng cho tất cả endpoint
                .allowedOrigins("http://localhost:3000")    // Chỉ cho phép từ React frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Các HTTP method được phép
                .allowedHeaders("*")                        // Chấp nhận mọi header
                .allowCredentials(true);                    // Cho phép gửi cookie / credentials
    }
}
