package com.dormitory.controller;

import com.dormitory.entity.Invoice;
import com.dormitory.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API cho Hóa đơn.
 * Xem luồng chi tiết: FLOW_GUIDE.md → Mục 10
 */
@RestController
@RequestMapping("/api/v1/invoices")
@CrossOrigin
public class InvoiceController {

    @Autowired
    private InvoiceService service;

    /** GET /api/v1/invoices — Lấy danh sách tất cả hóa đơn */
    @GetMapping
    public List<Invoice> getAll() {
        return service.getAll();
    }

    /** GET /api/v1/invoices/{id} — Lấy chi tiết 1 hóa đơn */
    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /** POST /api/v1/invoices — Tạo hóa đơn mới */
    @PostMapping
    public ResponseEntity<Invoice> create(@RequestBody Invoice invoice) {
        return ResponseEntity.ok(service.create(invoice));
    }

    /** PUT /api/v1/invoices/{id} — Cập nhật hóa đơn (đổi trạng thái thanh toán) */
    @PutMapping("/{id}")
    public ResponseEntity<Invoice> update(@PathVariable Long id, @RequestBody Invoice invoice) {
        return ResponseEntity.ok(service.update(id, invoice));
    }

    /** DELETE /api/v1/invoices/{id} — Xóa hóa đơn */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
