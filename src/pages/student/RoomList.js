import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, CardBody, Badge, Button, Spinner, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';
import api from '../../api';
import { useSelector } from 'react-redux';

// Trang hiển thị danh sách phòng cho sinh viên đăng ký
const RoomList = () => {
    const { user } = useSelector(state => state.auth); // Lấy thông tin user đăng nhập
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State cho Tìm kiếm và Bộ lọc
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterPrice, setFilterPrice] = useState('All');

    // State cho Modal Đăng ký
    const [modal, setModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    
    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const [formData, setFormData] = useState({
        name: '',
        studentCode: '',
        phone: '',
        email: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Gọi API lấy danh sách phòng
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await api.get('/rooms');
                setRooms(res.data);
            } catch (error) {
                console.error("Lỗi lấy danh sách phòng", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    // Mở form đăng ký phòng
    const openRegisterModal = (room) => {
        setSelectedRoom(room);
        setFormData({
            name: '',
            studentCode: '',
            phone: '',
            email: ''
        });
        setModal(true);
    };

    // Xử lý thay đổi input trong form
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    // Gửi yêu cầu đăng ký phòng
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const studentPayload = {
                ...formData,
                roomId: selectedRoom.id,
                joinDate: new Date().toISOString().split('T')[0],
                status: 'Pending', // Mặc định là chờ duyệt
                userId: user?.id // Liên kết với tài khoản đăng nhập
            };
            await api.post('/students', studentPayload);
            alert("Đăng ký thành công! Vui lòng chờ Admin phê duyệt.");
            setModal(false);
        } catch (error) {
            alert("Có lỗi xảy ra khi đăng ký.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    // ================= LUỒNG TÌM KIẾM & BỘ LỌC =================
    const filteredRooms = rooms.filter(room => {
        // Sinh viên chỉ xem được phòng còn trống (Available)
        const isAvailable = room.status === 'Available';
        const matchesSearch = room.roomNumber.toLowerCase().includes(searchText.toLowerCase());
        const matchesType = filterType === 'All' ? true : room.type === filterType;
        
        let matchesPrice = true;
        if (filterPrice === 'under1.5') {
            matchesPrice = room.price < 1500000;
        } else if (filterPrice === '1.5to3') {
            matchesPrice = room.price >= 1500000 && room.price <= 3000000;
        } else if (filterPrice === 'over3') {
            matchesPrice = room.price > 3000000;
        }

        return isAvailable && matchesSearch && matchesType && matchesPrice;
    });

    // Reset trang về 1 khi đổi điều kiện lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [searchText, filterType, filterPrice]);

    // Phân chia dữ liệu theo trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    // ==========================================================

    if (loading) return <div className="text-center mt-5"><Spinner color="primary" /></div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-dark mb-0">Khám phá &amp; Đăng ký Phòng trống</h3>
            </div>

            {/* THANH TÌM KIẾM & BỘ LỌC */}
            <div className="bg-white p-3 rounded-3 shadow-sm border-0 mb-4">
                <div className="row g-3">
                    <div className="col-md-4">
                        <Label className="fw-semibold small text-muted">Số phòng</Label>
                        <Input
                            type="text"
                            placeholder="🔍 Tìm số phòng... (VD: 101)"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            className="form-control-custom"
                        />
                    </div>
                    <div className="col-md-4">
                        <Label className="fw-semibold small text-muted">Hạng phòng</Label>
                        <Input
                            type="select"
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            className="form-control-custom"
                        >
                            <option value="All">Tất cả loại phòng</option>
                            <option value="Normal">Thường (Normal)</option>
                            <option value="VIP">VIP</option>
                        </Input>
                    </div>
                    <div className="col-md-4">
                        <Label className="fw-semibold small text-muted">Khoảng giá (tháng)</Label>
                        <Input
                            type="select"
                            value={filterPrice}
                            onChange={e => setFilterPrice(e.target.value)}
                            className="form-control-custom"
                        >
                            <option value="All">Tất cả giá phòng</option>
                            <option value="under1.5">Dưới 1.5 triệu đ</option>
                            <option value="1.5to3">1.5 triệu - 3.0 triệu đ</option>
                            <option value="over3">Trên 3.0 triệu đ</option>
                        </Input>
                    </div>
                </div>
            </div>

            {/* DANH SÁCH PHÒNG CARD */}
            <Row>
                {currentRooms.length === 0 ? (
                    <Col><p className="text-muted">Không có phòng trống nào phù hợp với bộ lọc tìm kiếm.</p></Col>
                ) : currentRooms.map(room => (
                    <Col md="4" className="mb-4" key={room.id}>
                        <Card className="shadow-sm border-0 h-100 dashboard-card">
                            <CardBody className="d-flex flex-column justify-content-between">
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4 className="fw-bold mb-0 text-primary-custom">Phòng {room.roomNumber}</h4>
                                        <Badge color={room.type === 'VIP' ? 'warning' : 'secondary'} className={room.type === 'VIP' ? 'text-dark fw-bold' : ''}>
                                            {room.type}
                                        </Badge>
                                    </div>
                                    {room.imageUrl && (
                                        <div className="mb-3">
                                            <img src={`http://localhost:8080${room.imageUrl}`} alt={`Phòng ${room.roomNumber}`} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                                        </div>
                                    )}
                                    <hr/>
                                    <div className="mb-4">
                                        <p className="mb-1 text-muted">Sức chứa tối đa: <strong className="text-dark">{room.capacity} người</strong></p>
                                        <p className="mb-1 text-muted">Đang ở thực tế: <strong className="text-dark">{room.currentOccupancy} người</strong></p>
                                        <p className="mb-0 text-muted">Giá phòng: <strong className="text-danger">{Number(room.price).toLocaleString('vi-VN')} đ/tháng</strong></p>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    {/* Bấm vào xem chi tiết phòng sử dụng useNavigate */}
                                    <Button
                                        color="secondary"
                                        outline
                                        className="w-50"
                                        onClick={() => navigate(`/student/rooms/${room.id}`)}
                                    >
                                        Chi tiết
                                    </Button>
                                    <Button
                                        color="primary"
                                        className="w-50 btn-primary-custom"
                                        onClick={() => openRegisterModal(room)}
                                    >
                                        Đăng ký
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* KHU VỰC PHÂN TRANG (PAGINATION) */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center p-3 mt-3 bg-white rounded-3 shadow-sm">
                    <span className="small text-muted">
                        Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredRooms.length)} trong tổng số {filteredRooms.length} phòng
                    </span>
                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Trước</button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                <li key={num} className={`page-item ${currentPage === num ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(num)}>{num}</button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Sau</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

            {/* Modal điền thông tin đăng ký */}
            <Modal isOpen={modal} toggle={() => setModal(false)} centered>
                <ModalHeader toggle={() => setModal(false)}>Đăng ký Phòng {selectedRoom?.roomNumber}</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label>Họ và tên sinh viên <span className="text-danger">*</span></Label>
                            <Input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="VD: Nguyễn Văn A" />
                        </FormGroup>
                        <FormGroup>
                            <Label>Mã sinh viên <span className="text-danger">*</span></Label>
                            <Input type="text" name="studentCode" value={formData.studentCode} onChange={handleChange} required placeholder="VD: SV001" />
                        </FormGroup>
                        <FormGroup>
                            <Label>Số điện thoại <span className="text-danger">*</span></Label>
                            <Input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="VD: 0987654321" />
                        </FormGroup>
                        <FormGroup>
                            <Label>Email <span className="text-danger">*</span></Label>
                            <Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="VD: sv@gmail.com" />
                        </FormGroup>
                        <hr/>
                        <div className="d-flex justify-content-end gap-2">
                            <Button color="secondary" outline onClick={() => setModal(false)}>Hủy</Button>
                            <Button color="primary" type="submit" className="btn-primary-custom" disabled={submitting}>
                                {submitting ? <Spinner size="sm"/> : 'Xác nhận đăng ký'}
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default RoomList;
