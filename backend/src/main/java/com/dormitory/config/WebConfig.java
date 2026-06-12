package com.dormitory.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * =====================================================
 * WebConfig - Cấu hình tài nguyên tĩnh (Static Resources)
 * =====================================================
 * Mục đích:
 *   Map đường dẫn URL "/uploads/**" tới thư mục "uploads/"
 *   trên server, giúp React Frontend có thể hiển thị ảnh
 *   phòng đã được upload lên Backend.
 *
 * Luồng hoạt động:
 *   1. Admin upload ảnh phòng → POST /api/v1/rooms/{id}/image
 *   2. Backend lưu file vào thư mục "uploads/" trên server
 *   3. Backend lưu đường dẫn "/uploads/tên_file.jpg" vào DB
 *   4. React gọi GET http://localhost:8080/uploads/tên_file.jpg
 *   5. WebConfig map URL này → file vật lý → trả về ảnh
 * =====================================================
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Đăng ký resource handler để phục vụ file ảnh đã upload.
     *
     * @param registry - Đối tượng ResourceHandlerRegistry để cấu hình
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Lấy đường dẫn tuyệt đối của thư mục uploads/ trên server
        Path uploadDir = Paths.get("uploads");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        // Map URL pattern "/uploads/**" → thư mục vật lý "uploads/"
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/" + uploadPath + "/");
    }
}
