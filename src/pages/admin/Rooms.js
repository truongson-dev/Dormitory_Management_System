import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import api from "../../api";

// Giá trị mặc định khi tạo phòng mới
const EMPTY_FORM = {
  roomNumber: "",
  type: "Normal",
  capacity: "",
  currentOccupancy: "",
  price: "",
  status: "Available",
};

// Trang Quản lý Phòng của Admin
const Rooms = () => {
  const navigate = useNavigate();

  // Các state lưu trữ dữ liệu và trạng thái UI
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // State hỗ trợ tìm kiếm, lọc và phân trang (Props, State, useEffect)
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Hiển thị 5 phòng trên 1 trang
  const [sortConfig, setSortConfig] = useState({
    key: "roomNumber",
    direction: "asc",
  });
  // Sử lại useEffect
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setEditingRoom(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setErrors({});
    setModal(true);
  };

  const openEdit = (room) => {
    // Điền dữ liệu phòng vào form để chỉnh sửa
    setEditingRoom(room);
    setForm({
      roomNumber: room.roomNumber,
      type: room.type,
      capacity: room.capacity,
      currentOccupancy: room.currentOccupancy,
      price: room.price,
      status: room.status,
    });
    setImageFile(null);
    setErrors({});
    setModal(true);
  };

  const openDelete = (room) => {
    setRoomToDelete(room);
    setDeleteModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.roomNumber.trim()) e.roomNumber = "Vui lòng nhập số phòng.";
    if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) < 1)
      e.capacity = "Sức chứa phải là số nguyên dương.";
    if (
      form.currentOccupancy === "" ||
      isNaN(form.currentOccupancy) ||
      Number(form.currentOccupancy) < 0
    )
      e.currentOccupancy = "Số người ở hiện tại không hợp lệ.";
    if (!form.price || isNaN(form.price) || Number(form.price) < 0)
      e.price = "Giá phòng phải là số hợp lệ.";
    if (Number(form.currentOccupancy) > Number(form.capacity))
      e.currentOccupancy = "Số người ở không thể vượt sức chứa.";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    // Validate: Thêm phòng mới PHẢI có ảnh
    if (!editingRoom && !imageFile) {
      showToast("Vui lòng chọn ảnh phòng!", "danger");
      setErrors({ image: "Vui lòng chọn ảnh phòng" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        roomNumber: form.roomNumber.trim(),
        type: form.type,
        capacity: Number(form.capacity),
        currentOccupancy: Number(form.currentOccupancy),
        price: Number(form.price),
        status:
          Number(form.currentOccupancy) >= Number(form.capacity)
            ? "Full"
            : "Available",
      };

      let savedRoom;

      // Tạo hoặc cập nhật phòng
      if (editingRoom) {
        const res = await api.put(`/rooms/${editingRoom.id}`, payload);
        savedRoom = res.data;
        showToast("Cập nhật phòng thành công!");
      } else {
        const res = await api.post("/rooms", payload);
        savedRoom = res.data;
        showToast("Thêm phòng mới thành công!");
      }

      // Upload ảnh nếu có
      // - Khi thêm mới: luôn có ảnh (đã check ở trên)
      // - Khi cập nhật: chỉ upload nếu chọn ảnh mới
      if (imageFile && savedRoom) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const imgRes = await api.post(
          `/rooms/${savedRoom.id}/image`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        savedRoom = imgRes.data;
      }

      // Cập nhật state
      if (editingRoom) {
        setRooms((prev) =>
          prev.map((r) => (r.id === savedRoom.id ? savedRoom : r)),
        );
      } else {
        setRooms((prev) => [...prev, savedRoom]);
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
      await api.delete(`/rooms/${roomToDelete.id}`);
      setRooms((prev) => prev.filter((r) => r.id !== roomToDelete.id));
      showToast("Đã xóa phòng thành công!");
    } catch (err) {
      showToast("Xóa thất bại. Vui lòng thử lại.", "danger");
    } finally {
      setDeleteModal(false);
      setRoomToDelete(null);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ================= LUỒNG TÌM KIẾM, LỌC & PHÂN TRANG =================
  // 1. Lọc theo tìm kiếm số phòng, loại phòng và trạng thái phòng
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesType = filterType === "All" ? true : room.type === filterType;
    const matchesStatus =
      filterStatus === "All" ? true : room.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // 2. Sắp xếp danh sách phòng
  const sortedFilteredRooms = React.useMemo(() => {
    let sortableItems = [...filteredRooms];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue =
          a[sortConfig.key] !== undefined && a[sortConfig.key] !== null
            ? a[sortConfig.key]
            : "";
        let bValue =
          b[sortConfig.key] !== undefined && b[sortConfig.key] !== null
            ? b[sortConfig.key]
            : "";

        if (
          sortConfig.key === "price" ||
          sortConfig.key === "capacity" ||
          sortConfig.key === "currentOccupancy"
        ) {
          const numA = Number(aValue);
          const numB = Number(bValue);
          return sortConfig.direction === "asc" ? numA - numB : numB - numA;
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
  }, [filteredRooms, sortConfig]);

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
  }, [searchText, filterType, filterStatus, sortConfig]);

  // 3. Phân tách danh sách theo trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = sortedFilteredRooms.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

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
          className={`alert alert-${toast.type} alert-dismissible fade show`}
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
        <h2 className="text-dark fw-bold mb-0">Quản lý phòng</h2>
        <button
          className="btn btn-primary-custom d-flex align-items-center gap-2"
          onClick={openAdd}
        >
          <Plus size={18} /> Thêm phòng mới
        </button>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC (SEARCH & FILTER) */}
      <div className="bg-white p-3 rounded-3 shadow-sm border-0 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <Label className="fw-semibold small text-muted">
              Tìm kiếm số phòng
            </Label>
            <Input
              type="text"
              placeholder="🔍 VD: 101, 202..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="form-control-custom"
            />
          </div>
          <div className="col-md-4">
            <Label className="fw-semibold small text-muted">Loại phòng</Label>
            <Input
              type="select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-control-custom"
            >
              <option value="All">Tất cả loại phòng</option>
              <option value="Normal">Thường (Normal)</option>
              <option value="VIP">VIP</option>
            </Input>
          </div>
          <div className="col-md-4">
            <Label className="fw-semibold small text-muted">
              Trạng thái phòng
            </Label>
            <Input
              type="select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-control-custom"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Available">Còn trống (Available)</option>
              <option value="Full">Đã đầy (Full)</option>
            </Input>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-3">
        <CardBody className="p-0">
          <Table responsive hover className="table-custom mb-0">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th
                  className="ps-4"
                  onClick={() => handleSort("roomNumber")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Số phòng {renderSortArrow("roomNumber")}
                </th>
                <th>Loại phòng</th>
                <th
                  onClick={() => handleSort("capacity")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Sức chứa {renderSortArrow("capacity")}
                </th>
                <th
                  onClick={() => handleSort("currentOccupancy")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Đang ở {renderSortArrow("currentOccupancy")}
                </th>
                <th>Trạng thái</th>
                <th
                  onClick={() => handleSort("price")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Giá phòng (VND) {renderSortArrow("price")}
                </th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentRooms.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    Không tìm thấy dữ liệu phòng phù hợp.
                  </td>
                </tr>
              ) : (
                currentRooms.map((room) => (
                  <tr key={room.id}>
                    <td>
                      {room.imageUrl ? (
                        <img
                          src={`http://localhost:8080${room.imageUrl}`}
                          alt="Room"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: "#e9ecef",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <small className="text-muted">No IMG</small>
                        </div>
                      )}
                    </td>
                    <td className="ps-4 fw-bold text-primary-custom">
                      {room.roomNumber}
                    </td>
                    <td>
                      {room.type === "VIP" ? (
                        <span className="badge bg-warning text-dark fw-bold">
                          VIP
                        </span>
                      ) : (
                        <span className="badge bg-secondary">Thường</span>
                      )}
                    </td>
                    <td>{room.capacity} người</td>
                    <td>{room.currentOccupancy} người</td>
                    <td>
                      <Badge
                        color={
                          room.status === "Available" ? "success" : "danger"
                        }
                        pill
                      >
                        {room.status === "Available" ? "Còn trống" : "Đã đầy"}
                      </Badge>
                    </td>
                    <td>{Number(room.price).toLocaleString("vi-VN")} đ</td>
                    <td className="text-center">
                      {/* Bấm vào xem chi tiết ứng dụng Hook useNavigate */}
                      <button
                        className="btn btn-sm btn-outline-info me-2"
                        title="Xem chi tiết"
                        onClick={() => navigate(`/admin/rooms/${room.id}`)}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        title="Sửa"
                        onClick={() => openEdit(room)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Xóa"
                        onClick={() => openDelete(room)}
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
                  {filteredRooms.length === 0 ? 0 : indexOfFirstItem + 1}
                </strong>{" "}
                -{" "}
                <strong>
                  {Math.min(indexOfLastItem, filteredRooms.length)}
                </strong>{" "}
                trong tổng số <strong>{filteredRooms.length}</strong> phòng
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
          {editingRoom ? "Chỉnh sửa thông tin phòng" : "Thêm phòng mới"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>
                Số phòng <span className="text-danger">*</span>
              </Label>
              <Input
                value={form.roomNumber}
                onChange={(e) => handleChange("roomNumber", e.target.value)}
                invalid={!!errors.roomNumber}
                placeholder="VD: 101"
              />
              <FormFeedback>{errors.roomNumber}</FormFeedback>
            </FormGroup>
            <div className="row">
              <div className="col-6">
                <FormGroup>
                  <Label>Loại phòng</Label>
                  <Input
                    type="select"
                    value={form.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  >
                    <option value="Normal">Thường</option>
                    <option value="VIP">VIP</option>
                  </Input>
                </FormGroup>
              </div>
              <div className="col-6">
                <FormGroup>
                  <Label>
                    Sức chứa <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.capacity}
                    onChange={(e) => handleChange("capacity", e.target.value)}
                    invalid={!!errors.capacity}
                    placeholder="VD: 4"
                  />
                  <FormFeedback>{errors.capacity}</FormFeedback>
                </FormGroup>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <FormGroup>
                  <Label>
                    Số người đang ở <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.currentOccupancy}
                    onChange={(e) =>
                      handleChange("currentOccupancy", e.target.value)
                    }
                    invalid={!!errors.currentOccupancy}
                  />
                  <FormFeedback>{errors.currentOccupancy}</FormFeedback>
                </FormGroup>
              </div>
              <div className="col-6">
                <FormGroup>
                  <Label>
                    Giá phòng (VND) <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    invalid={!!errors.price}
                    placeholder="VD: 1500000"
                  />
                  <FormFeedback>{errors.price}</FormFeedback>
                </FormGroup>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <FormGroup>
                  <Label>
                    Ảnh phòng {!editingRoom && <span className="text-danger">*</span>}
                  </Label>
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
                    invalid={!!errors.image}
                  />
                  {errors.image && (
                    <FormFeedback>{errors.image}</FormFeedback>
                  )}
                  <small className="text-muted d-block mt-1">
                    {editingRoom 
                      ? "Chọn ảnh mới nếu muốn thay đổi ảnh phòng." 
                      : "Bắt buộc phải chọn ảnh khi thêm phòng mới."}
                  </small>
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
            ) : editingRoom ? (
              "Lưu thay đổi"
            ) : (
              "Thêm phòng"
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
          Bạn có chắc muốn xóa phòng <strong>{roomToDelete?.roomNumber}</strong>
          ? Hành động này không thể hoàn tác.
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

export default Rooms;
