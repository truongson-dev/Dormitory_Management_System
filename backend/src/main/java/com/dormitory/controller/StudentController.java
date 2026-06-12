package com.dormitory.controller;

import com.dormitory.entity.Student;
import com.dormitory.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API cho Sinh viên.
 * Xem luồng chi tiết: FLOW_GUIDE.md → Mục 8, 9
 */
@RestController
@RequestMapping("/api/v1/students")
@CrossOrigin
public class StudentController {

    @Autowired
    private StudentService service;

    /** GET /api/v1/students — Lấy danh sách tất cả sinh viên */
    @GetMapping
    public List<Student> getAll() {
        return service.getAll();
    }

    /** GET /api/v1/students/{id} — Lấy chi tiết 1 sinh viên */
    @GetMapping("/{id}")
    public ResponseEntity<Student> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /** POST /api/v1/students — Thêm sinh viên mới */
    @PostMapping
    public ResponseEntity<Student> create(@RequestBody Student student) {
        return ResponseEntity.ok(service.create(student));
    }

    /** PUT /api/v1/students/{id} — Cập nhật thông tin / duyệt sinh viên */
    @PutMapping("/{id}")
    public ResponseEntity<Student> update(@PathVariable Long id, @RequestBody Student student) {
        return ResponseEntity.ok(service.update(id, student));
    }

    /** DELETE /api/v1/students/{id} — Xóa sinh viên */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
