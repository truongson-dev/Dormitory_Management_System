package com.dormitory.service;

import com.dormitory.entity.Maintenance;
import com.dormitory.repository.MaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Xử lý logic nghiệp vụ cho Yêu cầu bảo trì / sửa chữa.
 * Xem luồng chi tiết: FLOW_GUIDE.md → Mục 11
 */
@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRepository repository;

    public List<Maintenance> getAll() {
        return repository.findAll();
    }

    public Maintenance getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu bảo trì với ID: " + id));
    }

    public List<Maintenance> getByRoomId(Long roomId) {
        return repository.findByRoomId(roomId);
    }

    /** Tạo yêu cầu mới: tự gán ngày tạo và đặt status = "Pending" */
    public Maintenance create(Maintenance request) {
        if (request.getCreatedAt() == null || request.getCreatedAt().isEmpty()) {
            request.setCreatedAt(java.time.LocalDate.now().toString());
        }
        request.setStatus("Pending");
        return repository.save(request);
    }

    /** Cập nhật thông tin hoặc thay đổi trạng thái xử lý (In Progress / Completed) */
    public Maintenance update(Long id, Maintenance request) {
        Maintenance existing = getById(id);
        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setPriority(request.getPriority());
        existing.setStatus(request.getStatus());
        return repository.save(existing);
    }

    public void delete(Long id) {
        Maintenance existing = getById(id);
        repository.delete(existing);
    }
}
