import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  CardBody,
  Badge,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
} from "reactstrap";
import {
  Pencil,
  Trash2,
  Plus,
  CheckCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import api from "../../api";

// Danh sách các loại hóa đơn
const INVOICE_TYPES = [
  { value: "Rent", label: "Tiền phòng" },
  { value: "Electricity", label: "Tiền điện" },
  { value: "Water", label: "Tiền nước" },
  { value: "Other", label: "Khác" },
];

// Dữ liệu form mặc định
const EMPTY_FORM = {
  roomId: "",
  type: "Rent",
  amount: "",
  month: "",
  status: "Unpaid",
};

// Trang quản lý Hóa đơn của Admin
const Invoices = () => {
  // States để lưu dữ liệu danh sách hóa đơn, phòng và cấu hình UI
  const [invoices, setInvoices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // State sắp xếp (mặc định hóa đơn mới nhất xếp lên đầu)
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [invRes, roomRes] = await Promise.all([
        api.get("/invoices"),
        api.get("/rooms"),
      ]);
      setInvoices(invRes.data);
      setRooms(roomRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoomNumber = (roomId) => {
    const room = rooms.find((r) => r.id === roomId || r.id === Number(roomId));
    return room ? `Phòng ${room.roomNumber}` : `Phòng #${roomId}`;
  };

  const getTypeLabel = (type) => {
    const found = INVOICE_TYPES.find((t) => t.value === type);
    return found ? found.label : type;
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setEditingInvoice(null);
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    setForm({ ...EMPTY_FORM, month });
    setErrors({});
    setModal(true);
  };

  const openEdit = (invoice) => {
    setEditingInvoice(invoice);
    setForm({
      roomId: invoice.roomId,
      type: invoice.type,
      amount: invoice.amount,
      month: invoice.month,
      status: invoice.status,
    });
    setErrors({});
    setModal(true);
  };

  const openDelete = (invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteModal(true);
  };

  const handleMarkPaid = async (invoice) => {
    try {
      const res = await api.put(`/invoices/${invoice.id}`, {
        ...invoice,
        status: "Paid",
      });
      setInvoices((prev) =>
        prev.map((i) => (i.id === invoice.id ? res.data : i)),
      );
      showToast(`Đã đánh dấu thanh toán cho hóa đơn #${invoice.id}!`);
    } catch (err) {
      showToast("Cập nhật thất bại.", "danger");
    }
  };

  const validate = () => {
    const e = {};
    if (!form.roomId) e.roomId = "Vui lòng chọn phòng.";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = "Số tiền phải là số dương.";
    if (!form.month) e.month = "Vui lòng chọn kỳ thu.";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        roomId: Number(form.roomId),
        type: form.type,
        amount: Number(form.amount),
        month: form.month,
        status: form.status,
      };

      if (editingInvoice) {
        const res = await api.put(`/invoices/${editingInvoice.id}`, payload);
        setInvoices((prev) =>
          prev.map((i) => (i.id === editingInvoice.id ? res.data : i)),
        );
        showToast("Cập nhật hóa đơn thành công!");
      } else {
        const res = await api.post("/invoices", payload);
        setInvoices((prev) => [...prev, res.data]);
        showToast("Tạo hóa đơn thành công!");
      }
      setModal(false);
    } catch (err) {
      console.error(err);
      showToast("Có lỗi xảy ra. Vui lòng thử lại.", "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/invoices/${invoiceToDelete.id}`);
      setInvoices((prev) => prev.filter((i) => i.id !== invoiceToDelete.id));
      showToast("Đã xóa hóa đơn thành công!");
    } catch (err) {
      showToast("Xóa thất bại. Vui lòng thử lại.", "danger");
    } finally {
      setDeleteModal(false);
      setInvoiceToDelete(null);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ================= LUỒNG TÌM KIẾM, LỌC & PHÂN TRANG =================
  const filteredInvoices = invoices.filter((inv) => {
    // Liên kết với danh sách phòng ở client để lấy số phòng tìm kiếm
    const room = rooms.find(
      (r) => r.id === inv.roomId || r.id === Number(inv.roomId),
    );
    const roomNumber = room ? room.roomNumber : "";

    const matchesSearch = roomNumber
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ? true : inv.status === filterStatus;
    const matchesType = filterType === "All" ? true : inv.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Thực hiện sắp xếp
  const sortedFilteredInvoices = React.useMemo(() => {
    let sortableItems = [...filteredInvoices];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "roomNumber") {
          const roomA = rooms.find(
            (r) => r.id === a.roomId || r.id === Number(a.roomId),
          );
          const roomB = rooms.find(
            (r) => r.id === b.roomId || r.id === Number(b.roomId),
          );
          aValue = roomA ? roomA.roomNumber : "";
          bValue = roomB ? roomB.roomNumber : "";
        } else {
          aValue =
            a[sortConfig.key] !== undefined && a[sortConfig.key] !== null
              ? a[sortConfig.key]
              : "";
          bValue =
            b[sortConfig.key] !== undefined && b[sortConfig.key] !== null
              ? b[sortConfig.key]
              : "";
        }

        if (typeof aValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
      });
    }
    return sortableItems;
  }, [filteredInvoices, sortConfig, rooms]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <ArrowUp size={14} className="ms-1 text-primary-custom" />
      ) : (
        <ArrowDown size={14} className="ms-1 text-primary-custom" />
      );
    }
    return <ArrowUpDown size={14} className="ms-1 text-muted opacity-50" />;
  };

  // Tự động quay lại trang 1 khi thay đổi điều kiện lọc hoặc sắp xếp
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterStatus, filterType, sortConfig]);

  // Phân chia dữ liệu theo trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = sortedFilteredInvoices.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // ===================================================================

  const totalUnpaid = invoices
    .filter((i) => i.status === "Unpaid")
    .reduce((sum, i) => sum + i.amount, 0);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    );

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`alert alert-${toast.type} fade show`}
          role="alert"
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            minWidth: 300,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {toast.msg}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-dark fw-bold mb-1">Điện nước &amp; Hóa đơn</h2>
          {totalUnpaid > 0 && (
            <small className="text-danger fw-semibold">
              Chưa thu: {totalUnpaid.toLocaleString("vi-VN")} đ
            </small>
          )}
        </div>
        <button
          className="btn btn-primary-custom d-flex align-items-center gap-2"
          onClick={openAdd}
        >
          <Plus size={18} /> Tạo hóa đơn
        </button>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC CẢI TIẾN */}
      <div className="bg-white p-3 rounded-3 shadow-sm border-0 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <Label className="fw-semibold small text-muted">
              Tìm theo số phòng
            </Label>
            <Input
              type="text"
              placeholder="🔍 VD: 101, 102..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="form-control-custom"
            />
          </div>
          <div className="col-md-3">
            <Label className="fw-semibold small text-muted">Loại chi phí</Label>
            <Input
              type="select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-control-custom"
            >
              <option value="All">Tất cả loại phí</option>
              {INVOICE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Input>
          </div>
          <div className="col-md-6">
            <Label className="fw-semibold small text-muted d-block">
              Trạng thái thanh toán
            </Label>
            <div className="d-flex gap-2">
              {["All", "Unpaid", "Paid"].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`btn btn-sm px-3 ${filterStatus === s ? "btn-primary-custom" : "btn-outline-secondary"}`}
                  onClick={() => setFilterStatus(s)}
                >
                  {s === "All"
                    ? "Tất cả"
                    : s === "Unpaid"
                      ? "Chưa thanh toán"
                      : "Đã thanh toán"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-3">
        <CardBody className="p-0">
          <Table responsive hover className="table-custom mb-0">
            <thead>
              <tr>
                <th
                  className="ps-4"
                  onClick={() => handleSort("id")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Mã HĐ {renderSortArrow("id")}
                </th>
                <th
                  onClick={() => handleSort("roomNumber")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Phòng {renderSortArrow("roomNumber")}
                </th>
                <th
                  onClick={() => handleSort("type")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Loại phí {renderSortArrow("type")}
                </th>
                <th
                  onClick={() => handleSort("amount")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Số tiền (VND) {renderSortArrow("amount")}
                </th>
                <th
                  onClick={() => handleSort("month")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Kỳ thu {renderSortArrow("month")}
                </th>
                <th
                  onClick={() => handleSort("status")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Trạng thái {renderSortArrow("status")}
                </th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    Không tìm thấy hóa đơn nào phù hợp.
                  </td>
                </tr>
              ) : (
                currentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="ps-4 fw-bold">#{invoice.id}</td>
                    <td className="fw-semibold text-primary-custom">
                      {getRoomNumber(invoice.roomId)}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          invoice.type === "Rent"
                            ? "bg-primary"
                            : invoice.type === "Electricity"
                              ? "bg-warning text-dark"
                              : invoice.type === "Water"
                                ? "bg-info text-dark"
                                : "bg-secondary"
                        }`}
                      >
                        {getTypeLabel(invoice.type)}
                      </span>
                    </td>
                    <td className="fw-semibold text-danger">
                      {Number(invoice.amount).toLocaleString("vi-VN")} đ
                    </td>
                    <td>{invoice.month}</td>
                    <td>
                      <Badge
                        color={
                          invoice.status === "Paid" ? "success" : "warning"
                        }
                        pill
                      >
                        {invoice.status === "Paid"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </Badge>
                    </td>
                    <td className="text-center">
                      {invoice.status === "Unpaid" && (
                        <button
                          className="btn btn-sm btn-outline-success me-1"
                          title="Đánh dấu đã thanh toán"
                          onClick={() => handleMarkPaid(invoice)}
                        >
                          <CheckCircle size={15} />
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        title="Sửa"
                        onClick={() => openEdit(invoice)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Xóa"
                        onClick={() => openDelete(invoice)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* KHU VỰC PHÂN TRANG */}
          <div className="d-flex justify-content-between align-items-center p-3 border-top flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted">
                Hiển thị{" "}
                <strong>
                  {filteredInvoices.length === 0 ? 0 : indexOfFirstItem + 1}
                </strong>{" "}
                -{" "}
                <strong>
                  {Math.min(indexOfLastItem, filteredInvoices.length)}
                </strong>{" "}
                trong tổng số <strong>{filteredInvoices.length}</strong> hóa đơn
              </span>
              <select
                className="form-select form-select-sm"
                style={{ width: "auto" }}
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} / trang
                  </option>
                ))}
              </select>
            </div>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(1)}
                    title="Trang đầu"
                  >
                    &laquo;
                  </button>
                </li>
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Trước
                  </button>
                </li>
                {Array.from({ length: totalPages || 1 }, (_, i) => i + 1)
                  .filter(
                    (num) =>
                      num === 1 ||
                      num === totalPages ||
                      Math.abs(num - currentPage) <= 1,
                  )
                  .reduce((acc, num, idx, arr) => {
                    if (idx > 0 && num - arr[idx - 1] > 1) acc.push("...");
                    acc.push(num);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <li
                        key={`ellipsis-${idx}`}
                        className="page-item disabled"
                      >
                        <span className="page-link">…</span>
                      </li>
                    ) : (
                      <li
                        key={item}
                        className={`page-item ${currentPage === item ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(item)}
                        >
                          {item}
                        </button>
                      </li>
                    ),
                  )}
                <li
                  className={`page-item ${currentPage === (totalPages || 1) ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Sau
                  </button>
                </li>
                <li
                  className={`page-item ${currentPage === (totalPages || 1) ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(totalPages || 1)}
                    title="Trang cuối"
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </CardBody>
      </Card>

      {/* Add/Edit Modal */}
      <Modal isOpen={modal} toggle={() => setModal(false)} centered>
        <ModalHeader toggle={() => setModal(false)}>
          {editingInvoice ? "Chỉnh sửa hóa đơn" : "Tạo hóa đơn mới"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>
                Phòng <span className="text-danger">*</span>
              </Label>
              <Input
                type="select"
                value={form.roomId}
                onChange={(e) => handleChange("roomId", e.target.value)}
                invalid={!!errors.roomId}
              >
                <option value="">-- Chọn phòng --</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Phòng {room.roomNumber} ({room.type})
                  </option>
                ))}
              </Input>
              <FormFeedback>{errors.roomId}</FormFeedback>
            </FormGroup>
            <div className="row">
              <div className="col-6">
                <FormGroup>
                  <Label>Loại phí</Label>
                  <Input
                    type="select"
                    value={form.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  >
                    {INVOICE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
              <div className="col-6">
                <FormGroup>
                  <Label>
                    Kỳ thu <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="month"
                    value={form.month}
                    onChange={(e) => handleChange("month", e.target.value)}
                    invalid={!!errors.month}
                  />
                  <FormFeedback>{errors.month}</FormFeedback>
                </FormGroup>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <FormGroup>
                  <Label>
                    Số tiền (VND) <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    invalid={!!errors.amount}
                    placeholder="VD: 1500000"
                    disabled={
                      editingInvoice && editingInvoice.status === "Paid"
                    }
                  />
                  <FormFeedback>{errors.amount}</FormFeedback>
                </FormGroup>
              </div>
              <div className="col-6">
                <FormGroup>
                  <Label>Trạng thái</Label>
                  <Input
                    type="select"
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    disabled={
                      editingInvoice && editingInvoice.status === "Paid"
                    }
                  >
                    <option value="Unpaid">Chưa thanh toán</option>
                    <option value="Paid">Đã thanh toán</option>
                  </Input>
                </FormGroup>
              </div>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={() => setModal(false)}>
            Hủy
          </Button>
          <Button
            className="btn-primary-custom"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Spinner size="sm" />
            ) : editingInvoice ? (
              "Lưu thay đổi"
            ) : (
              "Tạo hóa đơn"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(false)}
        centered
        size="sm"
      >
        <ModalHeader toggle={() => setDeleteModal(false)}>
          Xác nhận xóa
        </ModalHeader>
        <ModalBody>
          Bạn có chắc muốn xóa hóa đơn <strong>#{invoiceToDelete?.id}</strong>?
          Hành động này không thể hoàn tác.
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            outline
            onClick={() => setDeleteModal(false)}
          >
            Hủy
          </Button>
          <Button color="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Invoices;
