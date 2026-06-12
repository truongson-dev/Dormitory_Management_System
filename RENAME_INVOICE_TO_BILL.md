# 🔄 Hướng dẫn đổi tên Invoice → Bill

## 📋 CÁC FILE CẦN ĐỔI TÊN

### 🎯 BACKEND (Java)

#### 1. Entity
- `Invoice.java` → `Bill.java`

#### 2. Repository  
- `InvoiceRepository.java` → `BillRepository.java`

#### 3. Service
- `InvoiceService.java` → `BillService.java`

#### 4. Controller
- `InvoiceController.java` → `BillController.java`

#### 5. Database
- Table: `invoices` → `bills`
- SQL file: `dormitory_db.sql`

### 🎨 FRONTEND (React)

#### 1. Pages
- `src/pages/admin/Invoices.js` → `Bills.js`

#### 2. Routes
- `src/routes/AdminRoutes.js` (đổi path `/invoices` → `/bills`)

#### 3. Components
- Update các component sử dụng invoice

#### 4. API Calls
- Update tất cả endpoint từ `/invoices` → `/bills`

---

## 🚀 CÁCH ĐỔI TÊN

### ✅ Cách 1: Đổi thủ công (Khuyến nghị)

#### Backend:

**Bước 1: Đổi tên files (Right-click → Rename)**
```
backend/src/main/java/com/dormitory/entity/
  Invoice.java → Bill.java

backend/src/main/java/com/dormitory/repository/
  InvoiceRepository.java → BillRepository.java

backend/src/main/java/com/dormitory/service/
  InvoiceService.java → BillService.java

backend/src/main/java/com/dormitory/controller/
  InvoiceController.java → BillController.java
```

**Bước 2: Update class names trong các file**
```java
// Bill.java
@Entity
@Table(name = "bills")  // ← Đổi từ "invoices"
public class Bill {     // ← Đổi từ Invoice
    // ...
}

// BillRepository.java
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByRoomId(Long roomId);  // ← Đổi Invoice → Bill
}

// BillService.java
public class BillService {
    @Autowired
    private BillRepository repository;  // ← Đổi InvoiceRepository
    
    public List<Bill> getAll() { ... }  // ← Đổi Invoice
}

// BillController.java
@RestController
@RequestMapping("/api/v1/bills")  // ← Đổi từ /invoices
@CrossOrigin
public class BillController {
    @Autowired
    private BillService service;  // ← Đổi InvoiceService
    
    @GetMapping
    public ResponseEntity<List<Bill>> getAll() { ... }  // ← Đổi Invoice
}
```

**Bước 3: Update Database**
```sql
-- Đổi tên bảng
RENAME TABLE invoices TO bills;

-- Hoặc nếu muốn an toàn:
CREATE TABLE bills LIKE invoices;
INSERT INTO bills SELECT * FROM invoices;
-- DROP TABLE invoices;  (chờ test xong mới drop)
```

#### Frontend:

**Bước 1: Đổi tên file**
```
src/pages/admin/Invoices.js → Bills.js
```

**Bước 2: Update component name**
```javascript
// Bills.js
const Bills = () => {  // ← Đổi từ Invoices
    const [bills, setBills] = useState([]);  // ← Đổi từ invoices
    // ...
}
export default Bills;  // ← Đổi từ Invoices
```

**Bước 3: Update routes**
```javascript
// AdminRoutes.js
import Bills from "../pages/admin/Bills";  // ← Đổi từ Invoices

<Route path="bills" element={<Bills />} />  // ← Đổi từ invoices
```

**Bước 4: Update API calls trong tất cả files**
```javascript
// Từ:
api.get("/invoices")
api.post("/invoices", data)
api.put(`/invoices/${id}`, data)
api.delete(`/invoices/${id}`)

// Thành:
api.get("/bills")
api.post("/bills", data)
api.put(`/bills/${id}`, data)
api.delete(`/bills/${id}`)
```

**Bước 5: Update variable names**
```javascript
// Dashboard.js, RoomDetail.js, MyRoom.js, etc.
const [bills, setBills] = useState([]);  // ← Đổi từ invoices
const totalRevenue = bills.filter(...);  // ← Đổi từ invoices
```

---

### ✅ Cách 2: Dùng Find & Replace (VS Code)

**Bước 1: Mở Find & Replace (Ctrl + Shift + H)**

**Bước 2: Replace từng pattern:**

#### Backend Java:
```
Find: Invoice
Replace: Bill
Files to include: backend/**/*.java
```

```
Find: invoices
Replace: bills
Files to include: backend/**/*.java, *.sql
```

```
Find: /api/v1/invoices
Replace: /api/v1/bills
Files to include: backend/**/*.java
```

#### Frontend React:
```
Find: Invoices
Replace: Bills
Files to include: src/**/*.js
```

```
Find: invoices
Replace: bills
Files to include: src/**/*.js
```

```
Find: /invoices
Replace: /bills
Files to include: src/**/*.js
```

---

## 📝 CHECKLIST ĐẦY ĐỦ

### Backend:
- [ ] Đổi tên `Invoice.java` → `Bill.java`
- [ ] Đổi tên `InvoiceRepository.java` → `BillRepository.java`
- [ ] Đổi tên `InvoiceService.java` → `BillService.java`
- [ ] Đổi tên `InvoiceController.java` → `BillController.java`
- [ ] Update `@Table(name = "bills")` trong entity
- [ ] Update `@RequestMapping("/api/v1/bills")` trong controller
- [ ] Update tất cả `Invoice` → `Bill` trong code
- [ ] Đổi tên table `invoices` → `bills` trong database
- [ ] Update SQL file `dormitory_db.sql`
- [ ] Rebuild backend

### Frontend:
- [ ] Đổi tên `Invoices.js` → `Bills.js`
- [ ] Update import trong `AdminRoutes.js`
- [ ] Update route path: `invoices` → `bills`
- [ ] Update component name: `Invoices` → `Bills`
- [ ] Update state: `invoices` → `bills`, `setInvoices` → `setBills`
- [ ] Update API endpoints: `/invoices` → `/bills`
- [ ] Update trong `Dashboard.js`
- [ ] Update trong `RoomDetail.js`
- [ ] Update trong `MyRoom.js`
- [ ] Update menu config (nếu có)
- [ ] Update tất cả biến `invoice` → `bill`

### Database:
- [ ] Backup database trước khi đổi
- [ ] Rename table: `invoices` → `bills`
- [ ] Test queries với tên mới
- [ ] Update foreign keys (nếu có)

### Testing:
- [ ] Backend API test
- [ ] Frontend page render
- [ ] CRUD operations hoạt động
- [ ] Dashboard statistics đúng
- [ ] Room detail hiển thị bills
- [ ] Student view bills

---

## 🔍 REGEX PATTERNS HỮU ÍCH

### Find all Invoice references:
```regex
\bInvoice\b
\binvoice\b
\bINVOICE\b
invoices
Invoices
/invoices
```

### Replace patterns:
```
Invoice → Bill
invoice → bill
INVOICE → BILL
invoices → bills
Invoices → Bills
/invoices → /bills
```

---

## 🐛 LƯU Ý QUAN TRỌNG

### ⚠️ Cần cẩn thận:
1. **Backup database** trước khi rename table
2. **Commit code** trước khi đổi tên hàng loạt
3. **Test thoroughly** sau khi đổi
4. **Update documentation** và comments

### ⚠️ Không đổi:
- Tên biến cục bộ trong logic phức tạp (nếu làm mất nghĩa)
- Comments giải thích (trừ khi cần cập nhật)
- Log messages cũ (trừ khi cần consistent)

### ⚠️ Phải đổi:
- Class names
- File names
- Table names
- API endpoints
- Route paths
- Variable names (state, props)
- Component names
- Import statements

---

## 🧪 TEST SAU KHI ĐỔI

### Backend Test:
```bash
# Start backend
mvn spring-boot:run

# Test API
curl http://localhost:8080/api/v1/bills
```

### Frontend Test:
```bash
# Start frontend
npm start

# Navigate to
http://localhost:3000/admin/bills
```

### Database Test:
```sql
USE dormitory_db;

-- Check table exists
SHOW TABLES LIKE 'bills';

-- Check data
SELECT * FROM bills;

-- Check foreign keys
SHOW CREATE TABLE bills;
```

---

## 📚 EXAMPLE COMMITS

```
feat: rename Invoice to Bill in backend

- Renamed Invoice.java to Bill.java
- Renamed InvoiceRepository to BillRepository
- Renamed InvoiceService to BillService
- Renamed InvoiceController to BillController
- Updated @Table annotation to use "bills"
- Updated API endpoint to /api/v1/bills
```

```
feat: rename Invoice to Bill in frontend

- Renamed Invoices.js to Bills.js
- Updated component name to Bills
- Updated all state variables invoices → bills
- Updated API calls to /bills endpoint
- Updated route path to /admin/bills
```

```
refactor: rename invoices table to bills

- Renamed database table from invoices to bills
- Updated dormitory_db.sql schema
- Migrated existing data
```

---

## ✅ KẾT LUẬN

Đổi tên `Invoice` → `Bill` giúp:
- ✅ Code dễ đọc hơn (bill ngắn hơn invoice)
- ✅ Phù hợp với ngữ cảnh tiếng Việt (hóa đơn)
- ✅ Consistent naming
- ✅ Professional

**Thời gian ước tính:** 30-60 phút (tuỳ số lượng file)

**Độ khó:** ⭐⭐⭐ (Trung bình)

**Khuyến nghị:** Làm từng bước, test sau mỗi bước!
