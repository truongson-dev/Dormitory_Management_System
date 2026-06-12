import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Table,
  Badge,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { ArrowLeft, User, FileText, Wrench } from "lucide-react";
import api from "../../api";

// Trang Chi tiết Phòng (Xem thông tin chuyên sâu của một phòng)
// Áp dụng Hook useNavigate (quay lại) và Hook useParams (lấy ID trên URL)
const RoomDetail = () => {
  const { id } = useParams(); // Lấy ID phòng từ URL (Ví dụ: /admin/rooms/1 -> id = 1)
  const navigate = useNavigate(); // Hook điều hướng quay lại trang trước

  // Các State quản lý dữ liệu (Props, State, useEffect)
  const [room, setRoom] = useState(null);
  const [students, setStudents] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //
    fetchRoomData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRoomData = async () => {
    setLoading(true);
    try {
      // Gọi song song các API từ Spring Boot/Mock Server bằng Promise.all để tối ưu hiệu năng
      const [roomRes, studentsRes, invoicesRes, maintRes] = await Promise.all([
        api.get(`/rooms/${id}`),
        api.get("/students"),
        api.get("/invoices"),
        api.get("/maintenances").catch(() => ({ data: [] })), // Hỗ trợ fallback nếu backend chưa chạy API bảo trì
      ]);

      setRoom(roomRes.data);

      // Lọc danh sách sinh viên thuộc phòng này
      const roomStudents = studentsRes.data.filter(
        (s) => s.roomId === Number(id) && s.status === "Approved",
      );
      setStudents(roomStudents);

      // Lọc hóa đơn thuộc phòng này
      const roomInvoices = invoicesRes.data.filter(
        (i) => i.roomId === Number(id),
      );
      setInvoices(roomInvoices);

      // Lọc danh sách sửa chữa thuộc phòng này
      const roomMaintenances = maintRes.data.filter(
        (m) => m.roomId === Number(id),
      );
      setMaintenances(roomMaintenances);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết phòng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xác định đường dẫn quay lại dựa theo quyền hạn của tài khoản
  const handleBack = () => {
    // useNavigate quay lại trang lịch sử trước đó
    navigate(-1);
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    );
  if (!room)
    return (
      <div className="text-center mt-5 text-danger">
        ⚠️ Không tìm thấy thông tin phòng!
      </div>
    );

  return (
    <div className="container-fluid pb-5">
      {/* Nút Quay lại sử dụng useNavigate */}
      <button
        className="btn btn-outline-secondary btn-sm mb-4 d-flex align-items-center gap-2"
        onClick={handleBack}
      >
        <ArrowLeft size={16} /> Quay lại trang danh sách
      </button>

      {/* Banner thông tin tổng quan của phòng */}
      <Card className="border-0 shadow-sm rounded-3 mb-4 overflow-hidden">
        <div className="bg-primary-gradient p-4 text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="text-uppercase small fw-bold opacity-75">
                Chi tiết số phòng
              </span>
              <h1 className="fw-bold mb-0">Phòng {room.roomNumber}</h1>
            </div>
            <Badge
              color={room.type === "VIP" ? "warning" : "light"}
              className={
                room.type === "VIP"
                  ? "text-dark fs-6 px-3 py-2 fw-bold"
                  : "text-primary fs-6 px-3 py-2"
              }
            >
              Hạng {room.type}
            </Badge>
          </div>
        </div>
        <CardBody className="bg-white">
          <Row className="text-center g-3">
            {room.imageUrl && (
              <Col xs="12" className="mb-3">
                <img
                  src={`http://localhost:8080${room.imageUrl}`}
                  alt={`Phòng ${room.roomNumber}`}
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </Col>
            )}
            <Col xs="6" md="3">
              <span className="small text-muted d-block">Trạng thái phòng</span>
              <Badge
                color={room.status === "Available" ? "success" : "danger"}
                pill
                className="mt-1"
              >
                {room.status === "Available" ? "Còn trống" : "Đã đầy"}
              </Badge>
            </Col>
            <Col xs="6" md="3">
              <span className="small text-muted d-block">Sức chứa tối đa</span>
              <strong className="fs-5 text-dark mt-1 d-block">
                {room.capacity} người
              </strong>
            </Col>
            <Col xs="6" md="3">
              {/* Hiển thị currentOccupancy từ database - đồng nhất với trang danh sách phòng */}
              <span className="small text-muted d-block">Sinh viên đang ở</span>
              <strong className="fs-5 text-dark mt-1 d-block">
                {room.currentOccupancy} người
              </strong>
            </Col>
            <Col xs="6" md="3">
              <span className="small text-muted d-block">
                Đơn giá thuê (VND)
              </span>
              <strong className="fs-5 text-danger mt-1 d-block">
                {Number(room.price).toLocaleString("vi-VN")} đ/tháng
              </strong>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Row>
        {/* CỘT TRÁI: DANH SÁCH SINH VIÊN */}
        <Col lg="6" className="mb-4">
          <Card className="border-0 shadow-sm rounded-3 h-100 bg-white">
            <CardBody>
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <User size={20} className="text-primary-custom" /> Danh sách
                sinh viên đã duyệt ({students.length})
              </h5>
              <div className="table-responsive">
                <Table hover className="align-middle small">
                  <thead className="table-light">
                    <tr>
                      <th>Sinh viên</th>
                      <th>Mã SV</th>
                      <th>Số ĐT</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted">
                          Hiện chưa có sinh viên nào được duyệt ở phòng này.
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <div className="fw-bold">{student.name}</div>
                            <small className="text-muted">
                              Gia nhập:{" "}
                              {student.joinDate
                                ? new Date(student.joinDate).toLocaleDateString(
                                    "vi-VN",
                                  )
                                : "N/A"}
                            </small>
                          </td>
                          <td className="fw-semibold text-secondary">
                            {student.studentCode}
                          </td>
                          <td>{student.phone}</td>
                          <td>{student.email}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* CỘT PHẢI: LỊCH SỬ HÓA ĐƠN PHÒNG */}
        <Col lg="6" className="mb-4">
          <Card className="border-0 shadow-sm rounded-3 h-100 bg-white">
            <CardBody>
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <FileText size={20} className="text-primary-custom" /> Hóa đơn
                của phòng ({invoices.length})
              </h5>
              <div className="table-responsive">
                <Table hover className="align-middle small">
                  <thead className="table-light">
                    <tr>
                      <th>Mã HĐ</th>
                      <th>Loại phí</th>
                      <th>Kỳ thu</th>
                      <th>Số tiền</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-muted">
                          Chưa phát sinh hóa đơn cho phòng này.
                        </td>
                      </tr>
                    ) : (
                      invoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="fw-semibold">#{invoice.id}</td>
                          <td>
                            <Badge
                              // Màu sắc và nhãn hiển thị dựa trên loại hóa đơn (rent, electricity, water)
                              color={
                                invoice.type === "Rent"
                                  ? "primary"
                                  : invoice.type === "Electricity"
                                    ? "warning text-dark"
                                    : invoice.type === "Water"
                                      ? "info text-dark"
                                      : "secondary"
                              }
                            >
                              {invoice.type === "Rent"
                                ? "Tiền phòng"
                                : invoice.type === "Electricity"
                                  ? "Tiền điện"
                                  : invoice.type === "Water"
                                    ? "Tiền nước"
                                    : "Khác"}
                            </Badge>
                          </td>
                          <td>{invoice.month}</td>
                          <td className="fw-semibold text-danger">
                            {Number(invoice.amount).toLocaleString("vi-VN")} đ
                          </td>
                          <td>
                            <Badge
                              color={
                                invoice.status === "Paid"
                                  ? "success"
                                  : "warning"
                              }
                              pill
                            >
                              {invoice.status === "Paid"
                                ? "Đã thu"
                                : "Chưa thu"}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* LỊCH SỬ BÁO CÁO HỎNG HÓC & SỬA CHỮA (TẬP TRUNG TIỆN ÍCH CHO PHÒNG) */}
      <Card className="border-0 shadow-sm rounded-3 bg-white mt-2">
        <CardBody>
          <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
            <Wrench size={20} className="text-primary-custom" /> Yêu cầu sửa
            chữa đồ đạc trong phòng ({maintenances.length})
          </h5>
          <div className="table-responsive">
            <Table hover className="align-middle small">
              <thead className="table-light">
                <tr>
                  <th>Ngày báo</th>
                  <th>Nội dung sự cố</th>
                  <th>Mức độ</th>
                  <th>Trạng thái xử lý</th>
                </tr>
              </thead>
              <tbody>
                {maintenances.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted">
                      Phòng này chưa báo cáo sự cố hoặc hư hỏng nào. Cơ sở vật
                      chất tốt!
                    </td>
                  </tr>
                ) : (
                  maintenances.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{item.title}</div>
                        <div className="text-muted small">
                          {item.description}
                        </div>
                      </td>
                      <td>
                        <Badge
                          color={
                            item.priority === "Urgent" ? "danger" : "secondary"
                          }
                        >
                          {item.priority === "Urgent" ? "Gấp" : "Thường"}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          color={
                            item.status === "Completed"
                              ? "success"
                              : item.status === "In Progress"
                                ? "info"
                                : "warning text-dark"
                          }
                          pill
                        >
                          {item.status === "Completed"
                            ? "Đã hoàn thành"
                            : item.status === "In Progress"
                              ? "Đang sửa chữa"
                              : "Chờ xử lý"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default RoomDetail;
