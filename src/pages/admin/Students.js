import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  CardBody,
  Spinner,
  Badge,
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
  Check,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import api from "../../api";

const EMPTY_FORM = {
  name: "",
  roomId: "",
  phone: "",
  email: "",
  joinDate: "",
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchText, setSearchText] = useState("");

  // State hỗ trợ lọc và phân trang (Props, State, useEffect)
  const [filterRoom, setFilterRoom] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // 5 sinh viên trên 1 trang
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [studRes, roomRes] = await Promise.all([
        api.get("/students"),
        api.get("/rooms"),
      ]);
      setStudents(studRes.data);
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

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setEditingStudent(null);
    setForm({
      ...EMPTY_FORM,
      joinDate: new Date().toISOString().split("T")[0],
    });
    setErrors({});
    setModal(true);
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setForm({
      name: student.name,
      roomId: student.roomId,
      phone: student.phone,
      email: student.email,
      joinDate: student.joinDate,
    });
    setErrors({});
    setModal(true);
  };

  const openDelete = (student) => {
    setStudentToDelete(student);
    setDeleteModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập họ và tên.";
    if (!form.roomId) e.roomId = "Vui lòng chọn phòng.";
    if (!form.phone.trim()) e.phone = "Vui lòng nhập số điện thoại.";
    else if (!/^(0|\+84)\d{8,10}$/.test(form.phone.trim()))
      e.phone = "Số điện thoại không hợp lệ.";
    if (!form.email.trim()) e.email = "Vui lòng nhập email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Email không hợp lệ.";
    if (!form.joinDate) e.joinDate = "Vui lòng chọn ngày gia nhập.";
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
        name: form.name.trim(),
        roomId: Number(form.roomId),
        phone: form.phone.trim(),
        email: form.email.trim(),
        joinDate: form.joinDate,
      };

      if (editingStudent) {
        const res = await api.put(`/students/${editingStudent.id}`, payload);
        setStudents((prev) =>
          prev.map((s) => (s.id === editingStudent.id ? res.data : s)),
        );
        showToast("Cập nhật sinh viên thành công!");
      } else {
        const res = await api.post("/students", payload);
        setStudents((prev) => [...prev, res.data]);
        showToast("Thêm sinh viên thành công!");
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
      await api.delete(`/students/${studentToDelete.id}`);
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
      showToast("Đã xóa sinh viên thành công!");
    } catch (err) {
      showToast("Xóa thất bại. Vui lòng thử lại.", "danger");
    } finally {
      setDeleteModal(false);
      setStudentToDelete(null);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Hàm duyệt sinh viên (Chuyển trạng thái từ Pending sang Approved)
  const handleApprove = async (student) => {
    try {
      const payload = {
        ...student,
        status: "Approved",
      };
      const res = await api.put(`/students/${student.id}`, payload);
      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? res.data : s)),
      );
      showToast(`Đã phê duyệt sinh viên ${student.name} vào phòng!`, "success");

      // Đồng thời cập nhật occupancy phòng ở phía client
      const roomToUpdate = rooms.find((r) => r.id === student.roomId);
      if (roomToUpdate) {
        const newOccupancy = roomToUpdate.currentOccupancy + 1;
        await api.put(`/rooms/${roomToUpdate.id}`, {
          ...roomToUpdate,
          currentOccupancy: newOccupancy,
          status: newOccupancy >= roomToUpdate.capacity ? "Full" : "Available",
        });
        // Cập nhật lại danh sách phòng
        setRooms((prev) =>
          prev.map((r) =>
            r.id === roomToUpdate.id
              ? {
                  ...r,
                  currentOccupancy: newOccupancy,
                  status: newOccupancy >= r.capacity ? "Full" : "Available",
                }
              : r,
          ),
        );
      }
    } catch (err) {
      console.error(err);
      showToast("Có lỗi xảy ra khi phê duyệt.", "danger");
    }
  };

  // ================= LUỒNG TÌM KIẾM, LỌC & PHÂN TRANG =================
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.email.toLowerCase().includes(searchText.toLowerCase()) ||
      s.phone.includes(searchText);
    const matchesRoom =
      filterRoom === "All" ? true : s.roomId === Number(filterRoom);
    const matchesStatus =
      filterStatus === "All" ? true : (s.status || "Approved") === filterStatus;

    return matchesSearch && matchesRoom && matchesStatus;
  });

  // 2. Sắp xếp danh sách sinh viên
  const sortedFilteredStudents = React.useMemo(() => {
    let sortableItems = [...filteredStudents];
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
  }, [filteredStudents, sortConfig, rooms]);

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

  // Reset trang về 1 khi đổi điều kiện lọc hoặc sắp xếp
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterRoom, filterStatus, sortConfig]);

  // Phân chia dữ liệu theo trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = sortedFilteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // ===================================================================

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
            minWidth: 280,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {toast.msg}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-dark fw-bold mb-0">Quản lý sinh viên</h2>
        <button
          className="btn btn-primary-custom d-flex align-items-center gap-2"
          onClick={openAdd}
        >
          <Plus size={18} /> Thêm sinh viên
        </button>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC CẢI TIẾN */}
      <div className="bg-white p-3 rounded-3 shadow-sm border-0 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <Label className="fw-semibold small text-muted">
              Tìm kiếm sinh viên
            </Label>
            <Input
              type="text"
              placeholder="🔍 Nhập tên, email, số điện thoại..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="form-control-custom"
            />
          </div>
          <div className="col-md-4">
            <Label className="fw-semibold small text-muted">
              Lọc theo Phòng
            </Label>
            <Input
              type="select"
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
              className="form-control-custom"
            >
              <option value="All">Tất cả các phòng</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Phòng {room.roomNumber} ({room.type})
                </option>
              ))}
            </Input>
          </div>
          <div className="col-md-4">
            <Label className="fw-semibold small text-muted">
              Trạng thái hồ sơ
            </Label>
            <Input
              type="select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-control-custom"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Approved">Đã duyệt (Approved)</option>
              <option value="Pending">Chờ duyệt (Pending)</option>
              <option value="Rejected">Từ chối (Rejected)</option>
            </Input>
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
                  onClick={() => handleSort("name")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Họ và Tên {renderSortArrow("name")}
                </th>
                <th
                  onClick={() => handleSort("roomNumber")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Phòng {renderSortArrow("roomNumber")}
                </th>
                <th
                  onClick={() => handleSort("phone")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Số điện thoại {renderSortArrow("phone")}
                </th>
                <th
                  onClick={() => handleSort("email")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Email {renderSortArrow("email")}
                </th>
                <th
                  onClick={() => handleSort("joinDate")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Ngày gia nhập {renderSortArrow("joinDate")}
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
              {currentStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    Không tìm thấy kết quả sinh viên phù hợp.
                  </td>
                </tr>
              ) : (
                currentStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="ps-4 fw-semibold text-dark">
                      {student.name}
                    </td>
                    <td>{getRoomNumber(student.roomId)}</td>
                    <td>{student.phone}</td>
                    <td>{student.email}</td>
                    <td>
                      {student.joinDate
                        ? new Date(student.joinDate).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </td>
                    <td>
                      {/* Badge trạng thái hồ sơ của sinh viên */}
                      <Badge
                        color={
                          (student.status || "Approved") === "Approved"
                            ? "success"
                            : (student.status || "Approved") === "Pending"
                              ? "warning text-dark"
                              : "danger"
                        }
                        pill
                      >
                        {(student.status || "Approved") === "Approved"
                          ? "Đã duyệt"
                          : (student.status || "Approved") === "Pending"
                            ? "Chờ duyệt"
                            : "Từ chối"}
                      </Badge>
                    </td>
                    <td className="text-center">
                      {/* Nút phê duyệt nhanh khi hồ sơ đang chờ duyệt (Pending) */}
                      {(student.status || "Approved") === "Pending" && (
                        <button
                          className="btn btn-sm btn-outline-success me-2"
                          title="Phê duyệt vào ở phòng"
                          onClick={() => handleApprove(student)}
                        >
                          <Check size={15} />
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        title="Sửa"
                        onClick={() => openEdit(student)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Xóa"
                        onClick={() => openDelete(student)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* KHU VỰC PHÂN TRANG (PAGINATION) */}
          <div className="d-flex justify-content-between align-items-center p-3 border-top flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted">
                Hiển thị{" "}
                <strong>
                  {filteredStudents.length === 0 ? 0 : indexOfFirstItem + 1}
                </strong>{" "}
                -{" "}
                <strong>
                  {Math.min(indexOfLastItem, filteredStudents.length)}
                </strong>{" "}
                trong tổng số <strong>{filteredStudents.length}</strong> sinh
                viên
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
          {editingStudent
            ? "Chỉnh sửa thông tin sinh viên"
            : "Thêm sinh viên mới"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>
                Họ và tên <span className="text-danger">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                invalid={!!errors.name}
                placeholder="Nguyễn Văn A"
              />
              <FormFeedback>{errors.name}</FormFeedback>
            </FormGroup>
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
                    Phòng {room.roomNumber} ({room.type}) -{" "}
                    {room.currentOccupancy}/{room.capacity} người
                  </option>
                ))}
              </Input>
              <FormFeedback>{errors.roomId}</FormFeedback>
            </FormGroup>
            <div className="row">
              <div className="col-6">
                <FormGroup>
                  <Label>
                    Số điện thoại <span className="text-danger">*</span>
                  </Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    invalid={!!errors.phone}
                    placeholder="0987654321"
                  />
                  <FormFeedback>{errors.phone}</FormFeedback>
                </FormGroup>
              </div>
              <div className="col-6">
                <FormGroup>
                  <Label>
                    Ngày gia nhập <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={form.joinDate}
                    onChange={(e) => handleChange("joinDate", e.target.value)}
                    invalid={!!errors.joinDate}
                  />
                  <FormFeedback>{errors.joinDate}</FormFeedback>
                </FormGroup>
              </div>
            </div>
            <FormGroup>
              <Label>
                Email <span className="text-danger">*</span>
              </Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                invalid={!!errors.email}
                placeholder="example@gmail.com"
              />
              <FormFeedback>{errors.email}</FormFeedback>
            </FormGroup>
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
            ) : editingStudent ? (
              "Lưu thay đổi"
            ) : (
              "Thêm sinh viên"
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
          Bạn có chắc muốn xóa sinh viên{" "}
          <strong>{studentToDelete?.name}</strong>? Hành động này không thể hoàn
          tác.
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

export default Students;
