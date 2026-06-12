package com.dormitory.service;

import com.dormitory.entity.Student;
import com.dormitory.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

import java.util.List;

/**
 * Xử lý logic nghiệp vụ cho Sinh viên.
 * Xem luồng chi tiết: FLOW_GUIDE.md → Mục 8, 9
 */
@Service
public class StudentService {

    @Autowired
    private StudentRepository repository;
    
    @Autowired
    private UserService userService;

    public List<Student> getAll() {
        return repository.findAll().stream()
                .filter(s -> !"Deleted".equals(s.getStatus()))
                .collect(Collectors.toList());
    }

    public Student getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với ID: " + id));
    }

    /** Tạo sinh viên mới với status mặc định là "Pending" */
    public Student create(Student student) {
        if (student.getStatus() == null) {
            student.setStatus("Pending");
        }
        return repository.save(student);
    }

    public Student update(Long id, Student student) {
        Student existing = getById(id);
        existing.setName(student.getName());
        existing.setStudentCode(student.getStudentCode());
        existing.setPhone(student.getPhone());
        existing.setEmail(student.getEmail());
        existing.setJoinDate(student.getJoinDate());
        existing.setRoomId(student.getRoomId());

        if (student.getStatus() != null) existing.setStatus(student.getStatus());
        if (student.getUserId() != null) existing.setUserId(student.getUserId());

        return repository.save(existing);
    }

    public void delete(Long id) {
        Student existing = getById(id);
        existing.setStatus("Deleted");
        repository.save(existing);
        
        if (existing.getUserId() != null) {
            userService.disableUser(existing.getUserId());
        }
    }
}
