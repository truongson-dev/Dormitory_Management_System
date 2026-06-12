package com.dormitory.controller;

import com.dormitory.entity.Maintenance;
import com.dormitory.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API cho Yêu cầu bảo trì / sửa chữa.
 * Xem luồng chi tiết: FLOW_GUIDE.md → Mục 11
 */
@RestController
@RequestMapping("/api/v1/maintenances")
@CrossOrigin
public class MaintenanceController {

    @Autowired
    private MaintenanceService service;

    /** GET /api/v1/maintenances — Lấy tất cả yêu cầu bảo trì */
    @GetMapping
    public List<Maintenance> getAll() {
        return service.getAll();
    }

    /** GET /api/v1/maintenances/{id} — Lấy chi tiết 1 yêu cầu */
    @GetMapping("/{id}")
    public ResponseEntity<Maintenance> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** GET /api/v1/maintenances/room/{roomId} — Lấy yêu cầu theo phòng */
    @GetMapping("/room/{roomId}")
    public List<Maintenance> getByRoomId(@PathVariable Long roomId) {
        return service.getByRoomId(roomId);
    }

    /** POST /api/v1/maintenances — Tạo yêu cầu bảo trì mới */
    @PostMapping
    public ResponseEntity<Maintenance> create(@RequestBody Maintenance request) {
        return ResponseEntity.ok(service.create(request));
    }

    /** PUT /api/v1/maintenances/{id} — Cập nhật / đổi trạng thái xử lý */
    @PutMapping("/{id}")
    public ResponseEntity<Maintenance> update(@PathVariable Long id,
                                              @RequestBody Maintenance request) {
        try {
            return ResponseEntity.ok(service.update(id, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /** DELETE /api/v1/maintenances/{id} — Xóa yêu cầu bảo trì */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
