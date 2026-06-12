import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Table,
  Badge,
  Button,
  Input,
  Label,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  Wrench,
  Check,
  Clock,
  Trash2,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

// Trang Quản lý Yêu cầu Sửa chữa của Admin
const MaintenanceRequests = () => {
  const navigate = useNavigate();

  // State quản lý dữ liệu (Props, State, useEffect)
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // States hỗ trợ tìm kiếm, lọc và phân trang
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // State cho Modal Xác nhận xóa
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // State sắp xếp (mặc định yêu cầu mới nhất xếp lên đầu)
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      const [maintRes, roomRes] = await Promise.all([
        api.get("/maintenances"),
        api.get("/rooms"),
      ]);
      setRequests(maintRes.data);
      setRooms(roomRes.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách bảo trì:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRoomNumber = (roomId) => {
    const room = rooms.find((r) => r.id === roomId || r.id === Number(roomId));
    return room ? `Phòng ${room.roomNumber}` : `Phòng #${roomId}`;
  };

  // Cập nhật trạng thái sự cố nhanh (Pending -> In Progress -> Completed)
  const handleUpdateStatus = async (item, newStatus) => {
    try {
      const payload = {
        ...item,
        status: newStatus,
      };
      const res = await api.put(`/maintenances/${item.id}`, payload);
      setRequests((prev) =>
        prev.map((req) => (req.id === item.id ? res.data : req)),
      );
      showToast(
        `Đã chuyển trạng thái sự cố sang: ${
          newStatus === "In Progress" ? "Đang sửa chữa" : "Đã sửa xong"
        }`,
        "success",
      );
    } catch (err) {
      console.error(err);
      showToast("Cập nhật trạng thái thất bại.", "danger");
    }
  };

  // Mở Modal xóa
  const openDelete = (item) => {
    setItemToDelete(item);
    setDeleteModal(true);
  };

  // Thực thi xóa yêu cầu bảo trì
  const handleDelete = async () => {
    try {
      await api.delete(`/maintenances/${itemToDelete.id}`);
      setRequests((prev) => prev.filter((req) => req.id !== itemToDelete.id));
      showToast("Đã xóa yêu cầu bảo trì thành công!", "success");
    } catch (err) {
      showToast("Xóa thất bại. Vui lòng thử lại sau.", "danger");
    } finally {
      setDeleteModal(false);
      setItemToDelete(null);
    }
  };

  // ================= LUỒNG TÌM KIẾM, LỌC & PHÂN TRANG =================
  const filteredRequests = requests.filter((req) => {
    // Tìm phòng để lấy số phòng cho thanh tìm kiếm
    const room = rooms.find(
      (r) => r.id === req.roomId || r.id === Number(req.roomId),
    );
    const roomNumber = room ? room.roomNumber : "";

    const matchesSearch = roomNumber
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ? true : req.status === filterStatus;
    const matchesPriority =
      filterPriority === "All" ? true : req.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Thực hiện sắp xếp
  const sortedFilteredRequests = React.useMemo(() => {
    let sortableItems = [...filteredRequests];
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
        } else if (sortConfig.key === "createdAt") {
          aValue = a.createdAt || "";
          bValue = b.createdAt || "";
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
  }, [filteredRequests, sortConfig, rooms]);

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

  // Tự động quay lại trang 1 khi thay đổi bộ lọc hoặc sắp xếp
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterStatus, filterPriority, sortConfig]);

  // Phân chia danh sách theo trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = sortedFilteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

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
      {/* Toast Alert */}
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
          <h2 className="text-dark fw-bold mb-1">
            Duyệt &amp; Quản lý bảo trì
          </h2>
          <small className="text-muted">
            Xem, phê duyệt, chuyển trạng thái sửa chữa thiết bị từ Sinh viên
          </small>
        </div>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC */}
      <div className="bg-white p-3 rounded-3 shadow-sm border-0 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <Label className="fw-semibold small text-muted">
              Số phòng báo cáo
            </Label>
            <Input
              type="text"
              placeholder="🔍 Tìm số phòng... (VD: 101)"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="form-control-custom"
            />
          </div>
          <div className="col-md-4">
            <Label className="fw-semibold small text-muted">
              Trạng thái xử lý
            </Label>
            <Input
              type="select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-control-custom"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Pending">Chờ xử lý (Pending)</option>
              <option value="In Progress">Đang sửa chữa (In Progress)</option>
              <option value="Completed">Đã sửa xong (Completed)</option>
            </Input>
          </div>
          <div className="col-md-4">
            <Label className="fw-semibold small text-muted">
              Mức độ khẩn cấp
            </Label>
            <Input
              type="select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="form-control-custom"
            >
              <option value="All">Tất cả mức độ</option>
              <option value="Normal">Thường (Normal)</option>
              <option value="Urgent">Khẩn cấp (Urgent)</option>
            </Input>
          </div>
        </div>
      </div>

      {/* BẢNG YÊU CẦU BẢO TRÌ */}
      <Card className="border-0 shadow-sm rounded-3">
        <CardBody className="p-0">
          <Table responsive hover className="table-custom mb-0">
            <thead>
              <tr>
                <th
                  className="ps-4"
                  onClick={() => handleSort("createdAt")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Ngày báo {renderSortArrow("createdAt")}
                </th>
                <th
                  onClick={() => handleSort("roomNumber")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Phòng {renderSortArrow("roomNumber")}
                </th>
                <th
                  onClick={() => handleSort("title")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Sự cố {renderSortArrow("title")}
                </th>
                <th
                  onClick={() => handleSort("priority")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Khẩn cấp {renderSortArrow("priority")}
                </th>
                <th
                  onClick={() => handleSort("status")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Trạng thái {renderSortArrow("status")}
                </th>
                <th className="text-center">Hành động xử lý</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    Không tìm thấy yêu cầu sửa chữa cơ sở vật chất nào phù hợp.
                  </td>
                </tr>
              ) : (
                currentRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="ps-4 text-secondary">
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </td>
                    <td className="fw-bold text-primary-custom">
                      {getRoomNumber(req.roomId)}
                    </td>
                    <td style={{ minWidth: "220px", whiteSpace: "normal" }}>
                      <div className="fw-bold text-dark">{req.title}</div>
                      <div className="text-muted small">{req.description}</div>
                    </td>
                    <td>
                      <Badge
                        color={
                          req.priority === "Urgent" ? "danger" : "secondary"
                        }
                      >
                        {req.priority === "Urgent" ? "Gấp" : "Thường"}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        color={
                          req.status === "Completed"
                            ? "success"
                            : req.status === "In Progress"
                              ? "info"
                              : "warning text-dark"
                        }
                        pill
                      >
                        {req.status === "Completed"
                          ? "Đã sửa xong"
                          : req.status === "In Progress"
                            ? "Đang sửa"
                            : "Chờ xử lý"}
                      </Badge>
                    </td>
                    <td className="text-center">
                      {/* Xem chi tiết phòng */}
                      <button
                        className="btn btn-sm btn-outline-info me-2"
                        title="Xem chi tiết phòng này"
                        onClick={() => navigate(`/admin/rooms/${req.roomId}`)}
                      >
                        <Eye size={14} />
                      </button>

                      {/* Tiến hành sửa (Pending -> In Progress) */}
                      {req.status === "Pending" && (
                        <button
                          className="btn btn-sm btn-outline-warning me-2 d-inline-flex align-items-center gap-1"
                          title="Bắt đầu tiến hành sửa chữa"
                          onClick={() => handleUpdateStatus(req, "In Progress")}
                        >
                          <Clock size={14} /> Sửa
                        </button>
                      )}

                      {/* Hoàn thành sửa (In Progress -> Completed) */}
                      {req.status === "In Progress" && (
                        <button
                          className="btn btn-sm btn-outline-success me-2 d-inline-flex align-items-center gap-1"
                          title="Đã khắc phục xong sự cố"
                          onClick={() => handleUpdateStatus(req, "Completed")}
                        >
                          <Check size={14} /> Hoàn thành
                        </button>
                      )}

                      {/* Xóa yêu cầu sửa chữa */}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Xóa báo cáo này"
                        onClick={() => openDelete(req)}
                      >
                        <Trash2 size={14} />
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
                  {filteredRequests.length === 0 ? 0 : indexOfFirstItem + 1}
                </strong>{" "}
                -{" "}
                <strong>
                  {Math.min(indexOfLastItem, filteredRequests.length)}
                </strong>{" "}
                trong tổng số <strong>{filteredRequests.length}</strong> yêu cầu
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
          Bạn có chắc muốn xóa báo cáo sự cố{" "}
          <strong>"{itemToDelete?.title}"</strong>?
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

export default MaintenanceRequests;
