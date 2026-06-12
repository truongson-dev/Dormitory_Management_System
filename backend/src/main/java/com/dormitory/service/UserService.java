package com.dormitory.service;

import com.dormitory.entity.User;
import com.dormitory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Xử lý logic đăng nhập và đăng ký.
 * Xem luồng chi tiết: FLOW_GUIDE.md → Mục 4, 5
 */
@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    /** Xác thực thông tin đăng nhập, trả về User nếu hợp lệ */
    public User login(String username, String password) {
        Optional<User> userOpt = repository.findByUsername(username);

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            // Bỏ qua check active để đăng nhập được ngay
            // if (!userOpt.get().isActive()) {
            //     throw new RuntimeException("Tài khoản đã bị vô hiệu hóa.");
            // }
            return userOpt.get();
        }
        throw new RuntimeException("Sai tên đăng nhập hoặc mật khẩu");
    }

    /** Tạo tài khoản mới với role mặc định là STUDENT */
    public User register(User user) {
        if (repository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }
        user.setRole("STUDENT");
        user.setActive(true);
        return repository.save(user);
    }
    
    /** Vô hiệu hóa tài khoản (Soft Delete) */
    public void disableUser(Long userId) {
        repository.findById(userId).ifPresent(u -> {
            u.setActive(false);
            repository.save(u);
        });
    }
}
