import React, { useState, useEffect } from 'react';
import { Card, CardBody, Badge, Spinner, Alert } from 'reactstrap';
import api from '../../api';
import { useSelector } from 'react-redux';

// Trang xem trạng thái đăng ký và thông tin phòng của Sinh viên
const MyRoom = () => {
    const { user } = useSelector(state => state.auth); // Lấy user hiện tại
    const [registration, setRegistration] = useState(null); // Lọc thông tin đăng ký của sinh viên này
    const [roomDetails, setRoomDetails] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy tất cả sinh viên
                const studRes = await api.get('/students');
                
                // Tìm sinh viên có userId trùng với tài khoản đang đăng nhập
                const myReg = studRes.data.find(s => s.userId === user.id);
                setRegistration(myReg);

                // Nếu có đăng ký, lấy thêm thông tin phòng & hóa đơn
                if (myReg && myReg.roomId) {
                    const [roomRes, invRes] = await Promise.all([
                        api.get(`/rooms/${myReg.roomId}`),
                        api.get('/invoices')
                    ]);
                    setRoomDetails(roomRes.data);
                    
                    // Lọc hóa đơn của phòng này
                    const roomInvoices = invRes.data.filter(inv => inv.roomId === myReg.roomId);
                    setInvoices(roomInvoices);
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    if (loading) return <div className="text-center mt-5"><Spinner color="primary" /></div>;

    if (!registration) {
        return (
            <Alert color="info" className="shadow-sm">
                Bạn chưa đăng ký phòng nào. Hãy qua trang "Đăng ký phòng" để bắt đầu nhé.
            </Alert>
        );
    }

    return (
        <div>
            <h3 className="mb-4 fw-bold text-dark">Thông tin Phòng Của Tôi</h3>
            
            <Card className="shadow-sm border-0 mb-4">
                <CardBody>
                    <h5 className="fw-bold mb-3">Trạng thái đăng ký</h5>
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-muted">Tình trạng:</span>
                        {registration.status === 'Pending' && <Badge color="warning" className="text-dark p-2">Đang chờ duyệt</Badge>}
                        {registration.status === 'Approved' && <Badge color="success" className="p-2">Đã được duyệt</Badge>}
                        {registration.status === 'Rejected' && <Badge color="danger" className="p-2">Bị từ chối</Badge>}
                    </div>
                </CardBody>
            </Card>

            {roomDetails && (
                <>
                    <Card className="shadow-sm border-0 mb-4">
                        <CardBody>
                            <h5 className="fw-bold mb-3 text-primary-custom">Phòng {roomDetails.roomNumber}</h5>
                            <p className="text-muted mb-1">Loại phòng: <strong className="text-dark">{roomDetails.type}</strong></p>
                            <p className="text-muted mb-1">Giá phòng: <strong className="text-danger">{Number(roomDetails.price).toLocaleString('vi-VN')} đ/tháng</strong></p>
                            <p className="text-muted mb-0">Ngày bắt đầu ở: <strong className="text-dark">{registration.joinDate}</strong></p>
                        </CardBody>
                    </Card>

                    {/* Danh sách Hóa đơn */}
                    <Card className="shadow-sm border-0">
                        <CardBody>
                            <h5 className="fw-bold mb-3 text-dark">Danh sách hóa đơn của phòng</h5>
                            {invoices.length === 0 ? (
                                <Alert color="secondary" className="mb-0">
                                    Không có hóa đơn nào cho phòng của bạn.
                                </Alert>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Mã HĐ</th>
                                                <th>Loại phí</th>
                                                <th>Số tiền (VND)</th>
                                                <th>Kỳ thu</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.map((inv) => (
                                                <tr key={inv.id}>
                                                    <td className="fw-bold">#{inv.id}</td>
                                                    <td>
                                                        <span className={`badge ${
                                                            inv.type === 'Rent' ? 'bg-primary' :
                                                            inv.type === 'Electricity' ? 'bg-warning text-dark' :
                                                            inv.type === 'Water' ? 'bg-info text-dark' : 'bg-secondary'
                                                        }`}>
                                                            {inv.type === 'Rent' ? 'Tiền phòng' :
                                                             inv.type === 'Electricity' ? 'Tiền điện' :
                                                             inv.type === 'Water' ? 'Tiền nước' : 'Khác'}
                                                        </span>
                                                    </td>
                                                    <td className="fw-semibold text-danger">
                                                        {Number(inv.amount).toLocaleString('vi-VN')} đ
                                                    </td>
                                                    <td>{inv.month}</td>
                                                    <td>
                                                        <Badge color={inv.status === 'Paid' ? 'success' : 'warning'} pill>
                                                            {inv.status === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </>
            )}
        </div>
    );
};

export default MyRoom;
