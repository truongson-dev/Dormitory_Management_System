package com.dormitory.controller;

import com.dormitory.entity.Room;
import com.dormitory.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * REST API cho Phòng KTX.
 * Xem luồng chi tiết: FLOW_GUIDE.md → Mục 6, 7
 */
@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin
public class RoomController {

    @Autowired
    private RoomService service;

    /** GET /api/v1/rooms — Lấy danh sách tất cả phòng */
    @GetMapping
    public List<Room> getAll() {
        return service.getAll();
    }

    /** GET /api/v1/rooms/{id} — Lấy chi tiết 1 phòng */
    @GetMapping("/{id}")
    public ResponseEntity<Room> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /** POST /api/v1/rooms — Tạo phòng mới */
    @PostMapping
    public ResponseEntity<Room> create(@RequestBody Room room) {
        return ResponseEntity.ok(service.create(room));
    }

    /** PUT /api/v1/rooms/{id} — Cập nhật thông tin phòng */
    @PutMapping("/{id}")
    public ResponseEntity<Room> update(@PathVariable Long id, @RequestBody Room room) {
        return ResponseEntity.ok(service.update(id, room));
    }

    /** DELETE /api/v1/rooms/{id} — Xóa phòng */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    /**
     * POST /api/v1/rooms/{id}/image — Upload ảnh cho phòng.
     * Xem luồng chi tiết: FLOW_GUIDE.md → Mục 7
     */
    @PostMapping("/{id}/image")
    public ResponseEntity<Room> uploadImage(@PathVariable Long id,
                                            @RequestParam("image") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            String fileName = id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("uploads");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Files.copy(file.getInputStream(), uploadPath.resolve(fileName));

            Room room = service.getById(id);
            room.setImageUrl("/uploads/" + fileName);
            service.update(id, room);

            return ResponseEntity.ok(room);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
