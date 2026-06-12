package com.dormitory.service;

import com.dormitory.entity.Room;
import com.dormitory.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Xử lý logic nghiệp vụ cho Phòng KTX.
 * Xem luồng chi tiết: FLOW_GUIDE.md → Mục 6, 7
 */
@Service
public class RoomService {

    @Autowired
    private RoomRepository repository;

    public List<Room> getAll() {
        return repository.findAll();
    }

    public Room getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + id));
    }

    public Room create(Room room) {
        return repository.save(room);
    }

    /** Cập nhật thông tin phòng (không cập nhật imageUrl ở đây, dùng uploadImage) */
    public Room update(Long id, Room room) {
        Room existing = getById(id);
        existing.setRoomNumber(room.getRoomNumber());
        existing.setType(room.getType());
        existing.setCapacity(room.getCapacity());
        existing.setCurrentOccupancy(room.getCurrentOccupancy());
        existing.setPrice(room.getPrice());
        existing.setStatus(room.getStatus());

        // Cập nhật imageUrl nếu có (từ upload ảnh)
        if (room.getImageUrl() != null) {
            existing.setImageUrl(room.getImageUrl());
        }
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
