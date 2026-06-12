package com.dormitory.service;

import com.dormitory.entity.Invoice;
import com.dormitory.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Xử lý logic nghiệp vụ cho Hóa đơn.
 * Xem luồng chi tiết: FLOW_GUIDE.md → Mục 10
 */
@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository repository;

    public List<Invoice> getAll() {
        return repository.findAll();
    }

    public Invoice getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
    }

    public Invoice create(Invoice invoice) {
        return repository.save(invoice);
    }

    public Invoice update(Long id, Invoice invoice) {
        Invoice existing = getById(id);
        if ("Paid".equals(existing.getStatus()) &&
            (!existing.getAmount().equals(invoice.getAmount()) || 
             !"Paid".equals(invoice.getStatus()))) {
            throw new RuntimeException("Không thể sửa tiền hoặc trạng thái của hóa đơn đã thanh toán");
        }
        
        existing.setRoomId(invoice.getRoomId());
        existing.setType(invoice.getType());
        existing.setAmount(invoice.getAmount());
        existing.setStatus(invoice.getStatus());
        existing.setMonth(invoice.getMonth());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
