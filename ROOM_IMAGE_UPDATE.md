# ✅ Đã sửa: Bắt buộc chọn ảnh khi thêm phòng mới

## 🎯 THAY ĐỔI

### 1. **Logic validation trong `handleSave()`**

#### ✅ Đã thêm:
```javascript
// Validate: Thêm phòng mới PHẢI có ảnh
if (!editingRoom && !imageFile) {
    showToast("Vui lòng chọn ảnh phòng!", "danger");
    setErrors({ image: "Vui lòng chọn ảnh phòng" });
    return;
}
```

**Giải thích:**
- Khi thêm phòng mới (`!editingRoom`) mà không có ảnh (`!imageFile`)
- → Hiển thị toast đỏ: "Vui lòng chọn ảnh phòng!"
- → Set error state để hiển thị lỗi dưới input file
- → Return để không cho submit form

---

### 2. **UI Form - Hiển thị lỗi rõ ràng**

#### ✅ Đã thêm:

**a) Dấu * bắt buộc khi thêm phòng mới:**
```javascript
<Label>
    Ảnh phòng {!editingRoom && <span className="text-danger">*</span>}
</Label>
```

**b) Hiển thị lỗi validation:**
```javascript
<Input
    type="file"
    accept="image/*"
    onChange={(e) => {
        setImageFile(e.target.files[0]);
        // Clear error khi chọn ảnh
        if (errors.image) {
            setErrors((prev) => ({ ...prev, image: undefined }));
        }
    }}
    invalid={!!errors.image}  // ← Hiển thị border đỏ khi có lỗi
/>
{errors.image && (
    <FormFeedback>{errors.image}</FormFeedback>  // ← Hiển thị message lỗi
)}
```

**c) Text hướng dẫn khác nhau:**
```javascript
<small className="text-muted d-block mt-1">
    {editingRoom 
        ? "Chọn ảnh mới nếu muốn thay đổi ảnh phòng." 
        : "Bắt buộc phải chọn ảnh khi thêm phòng mới."}
</small>
```

**d) Preview ảnh đã chọn:**
```javascript
{imageFile && (
    <div className="mt-2">
        <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            style={{
                maxWidth: "200px",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "2px solid #dee2e6",
            }}
        />
        <p className="text-success small mt-1">
            ✓ Đã chọn: {imageFile.name}
        </p>
    </div>
)}
```

**e) Hiển thị ảnh hiện tại khi edit:**
```javascript
{editingRoom && editingRoom.imageUrl && !imageFile && (
    <div className="mt-2">
        <p className="text-muted small mb-1">Ảnh hiện tại:</p>
        <img
            src={`http://localhost:8080${editingRoom.imageUrl}`}
            alt="Current"
            style={{
                maxWidth: "200px",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "2px solid #dee2e6",
            }}
        />
    </div>
)}
```

---

## 📊 LUỒNG HOẠT ĐỘNG

### ✅ Khi THÊM phòng mới:

```
1. User click "Thêm phòng mới"
   ↓
2. Modal mở, form rỗng
   ↓
3. User nhập thông tin phòng
   ↓
4. User PHẢI chọn ảnh (có dấu * đỏ)
   ↓
5. Nếu không chọn ảnh → Click "Thêm phòng"
   ↓
6. ❌ Validation failed:
   - Toast đỏ: "Vui lòng chọn ảnh phòng!"
   - Input file border đỏ
   - Hiển thị message: "Vui lòng chọn ảnh phòng"
   ↓
7. User chọn ảnh
   ↓
8. Preview ảnh hiển thị
   ↓
9. Click "Thêm phòng"
   ↓
10. ✅ Validation passed:
    - Tạo phòng trong database
    - Upload ảnh
    - Hiển thị toast xanh: "Thêm phòng mới thành công!"
```

### ✅ Khi CẬP NHẬT phòng:

```
1. User click nút "Sửa" phòng
   ↓
2. Modal mở, form điền sẵn data
   ↓
3. Hiển thị ảnh hiện tại (nếu có)
   ↓
4. User có thể:
   - Giữ nguyên ảnh cũ (không chọn file mới)
   - Hoặc chọn ảnh mới
   ↓
5. Click "Lưu thay đổi"
   ↓
6. ✅ Validation passed:
   - Cập nhật thông tin phòng
   - Nếu có chọn ảnh mới → Upload ảnh mới
   - Nếu không chọn → Giữ nguyên ảnh cũ
   - Hiển thị toast xanh: "Cập nhật phòng thành công!"
```

---

## 🎨 GIAO DIỆN MỚI

### Khi THÊM phòng mới:
```
┌─────────────────────────────────────┐
│ Ảnh phòng *                         │ ← Có dấu * đỏ
│ [Choose File] No file chosen        │
│ ⚠ Vui lòng chọn ảnh phòng          │ ← Lỗi hiển thị (nếu không chọn)
│ Bắt buộc phải chọn ảnh khi thêm... │ ← Text hướng dẫn
│                                     │
│ [Preview ảnh nếu đã chọn]          │ ← Preview
│ ✓ Đã chọn: room_image.jpg          │
└─────────────────────────────────────┘
```

### Khi CẬP NHẬT phòng:
```
┌─────────────────────────────────────┐
│ Ảnh phòng                           │ ← Không có dấu * (optional)
│ [Choose File] No file chosen        │
│ Chọn ảnh mới nếu muốn thay đổi...  │ ← Text hướng dẫn
│                                     │
│ Ảnh hiện tại:                       │
│ [Ảnh cũ hiển thị ở đây]           │ ← Ảnh hiện tại
│                                     │
│ Hoặc nếu chọn ảnh mới:             │
│ [Preview ảnh mới]                   │ ← Preview ảnh mới
│ ✓ Đã chọn: new_image.jpg           │
└─────────────────────────────────────┘
```

---

## ✅ CÁC CASE KIỂM TRA

### ✅ Case 1: Thêm phòng KHÔNG chọn ảnh
```
Input: Click "Thêm phòng" mà không chọn file
Output: 
  - Toast đỏ: "Vui lòng chọn ảnh phòng!"
  - Input file border đỏ
  - Message lỗi hiển thị
  - Form KHÔNG submit
```

### ✅ Case 2: Thêm phòng CÓ chọn ảnh
```
Input: Nhập đầy đủ thông tin + chọn ảnh
Output:
  - Tạo phòng thành công
  - Upload ảnh thành công
  - Toast xanh: "Thêm phòng mới thành công!"
  - Modal đóng
```

### ✅ Case 3: Cập nhật phòng KHÔNG chọn ảnh mới
```
Input: Sửa thông tin phòng, không chọn file mới
Output:
  - Cập nhật thông tin phòng
  - Giữ nguyên ảnh cũ
  - Toast xanh: "Cập nhật phòng thành công!"
```

### ✅ Case 4: Cập nhật phòng CÓ chọn ảnh mới
```
Input: Sửa thông tin phòng + chọn ảnh mới
Output:
  - Cập nhật thông tin phòng
  - Upload ảnh mới
  - Toast xanh: "Cập nhật phòng thành công!"
```

### ✅ Case 5: Chọn ảnh sau khi có lỗi
```
Input: 
  1. Không chọn ảnh → Click submit → Có lỗi
  2. Chọn ảnh
Output:
  - Lỗi validation tự động mất
  - Border đỏ biến mất
  - Message lỗi biến mất
```

---

## 🔍 CODE REVIEW

### ✅ Ưu điểm:

1. **Validation rõ ràng:**
   - Check ngay từ đầu function
   - Return sớm nếu không hợp lệ
   - Hiển thị lỗi cụ thể

2. **UX tốt:**
   - Preview ảnh trước khi upload
   - Hiển thị ảnh hiện tại khi edit
   - Text hướng dẫn rõ ràng
   - Lỗi tự động mất khi chọn ảnh

3. **Code ngắn gọn:**
   - Chỉ thêm 4-5 dòng validation
   - Logic rõ ràng, dễ hiểu
   - Không phức tạp hóa

4. **Consistent:**
   - Giống style validation của các field khác
   - Dùng chung FormFeedback component
   - Toast message thống nhất

---

## 🎓 HƯỚNG DẪN TEST

### Test Case 1: Thêm phòng không có ảnh
```
1. Click "Thêm phòng mới"
2. Nhập tất cả thông tin NGOẠI TRỪ ảnh
3. Click "Thêm phòng"
4. Expected: 
   ✓ Toast đỏ xuất hiện
   ✓ Input file có border đỏ
   ✓ Có message "Vui lòng chọn ảnh phòng"
   ✓ Modal KHÔNG đóng
```

### Test Case 2: Thêm phòng có ảnh
```
1. Click "Thêm phòng mới"
2. Nhập tất cả thông tin + Chọn ảnh
3. Expected: Preview ảnh hiển thị
4. Click "Thêm phòng"
5. Expected:
   ✓ Toast xanh: "Thêm phòng mới thành công!"
   ✓ Modal đóng
   ✓ Phòng xuất hiện trong danh sách với ảnh
```

### Test Case 3: Chọn ảnh sau khi lỗi
```
1. Click "Thêm phòng mới"
2. Không chọn ảnh → Click submit → Có lỗi
3. Chọn ảnh
4. Expected:
   ✓ Lỗi validation biến mất
   ✓ Preview ảnh hiển thị
   ✓ Text "✓ Đã chọn: [tên file]" hiển thị
```

### Test Case 4: Edit phòng không đổi ảnh
```
1. Click "Sửa" một phòng có ảnh
2. Sửa thông tin KHÔNG chọn ảnh mới
3. Expected: Ảnh hiện tại hiển thị
4. Click "Lưu thay đổi"
5. Expected:
   ✓ Toast xanh: "Cập nhật phòng thành công!"
   ✓ Phòng cập nhật với ảnh cũ
```

### Test Case 5: Edit phòng đổi ảnh mới
```
1. Click "Sửa" một phòng
2. Chọn ảnh mới
3. Expected: Preview ảnh mới hiển thị
4. Click "Lưu thay đổi"
5. Expected:
   ✓ Toast xanh
   ✓ Phòng cập nhật với ảnh mới
```

---

## 📝 TÓM TẮT

- ✅ Bắt buộc chọn ảnh khi thêm phòng mới
- ✅ Optional chọn ảnh mới khi cập nhật phòng
- ✅ Validation rõ ràng với toast + message lỗi
- ✅ Preview ảnh trước khi upload
- ✅ Hiển thị ảnh hiện tại khi edit
- ✅ Lỗi tự động mất khi chọn ảnh
- ✅ Code ngắn gọn, dễ maintain

**Chúc bạn code vui vẻ! 🚀**
