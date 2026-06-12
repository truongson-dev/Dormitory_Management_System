import React, { useState, useEffect, useContext } from 'react';
import { Card, CardBody, Form, FormGroup, Label, Input, Button, Table, Badge, Spinner, Alert, Row, Col } from 'reactstrap';
import { useSelector } from 'react-redux';
import { Wrench, Plus } from 'lucide-react';
import api from '../../api';

// Giao diện Sinh viên báo cáo hư hỏng vật chất KTX
const MaintenanceRequestForm = () => {
  const { user } = useSelector(state => state.auth); // Tài khoản sinh viên đang đăng nhập

  // Các State dữ liệu
  const [studentInfo, setStudentInfo] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]); // Lịch sử báo hỏng của phòng này
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Normal');

  useEffect(() => {
    fetchStudentAndRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStudentAndRoom = async () => {
    try {
      // 1. Lấy toàn bộ sinh viên
      const studRes = await api.get('/students');
      // Tìm sinh viên tương ứng tài khoản đăng nhập
      const myInfo = studRes.data.find(s => s.userId === user.id && s.status === 'Approved');
      setStudentInfo(myInfo);

      if (myInfo && myInfo.roomId) {
        // 2. Lấy thông tin chi tiết phòng
        const roomRes = await api.get(`/rooms/${myInfo.roomId}`);
        setRoom(roomRes.data);

        // 3. Lấy lịch sử báo hỏng sự cố
        const maintRes = await api.get('/maintenances').catch(() => ({ data: [] }));
        const myRoomRequests = maintRes.data.filter(m => m.roomId === myInfo.roomId);
        setRequests(myRoomRequests);
      }
    } catch (err) {
      console.error("Lỗi lấy thông tin sự cố:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin báo cáo.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        roomId: room.id,
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        status: 'Pending', // Mặc định là chờ sửa
        createdAt: new Date().toISOString().split('T')[0]
      };

      const res = await api.post('/maintenances', payload);
      setRequests(prev => [res.data, ...prev]);
      
      // Reset Form
      setTitle('');
      setDescription('');
      setPriority('Normal');
      showToast("Gửi báo cáo sự cố thành công! Ban quản lý sẽ tiếp nhận sớm.", "success");
    } catch (err) {
      console.error(err);
      showToast("Gửi báo cáo thất bại. Vui lòng thử lại sau.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner color="primary" /></div>;

  // Nếu sinh viên chưa có phòng ở hợp lệ
  if (!studentInfo || !room) {
    return (
      <Alert color="warning" className="shadow-sm border-0">
        <h5>⚠️ Không thể sử dụng chức năng</h5>
        Bạn chưa được phê duyệt xếp vào bất kỳ phòng nào tại Ký túc xá. Bạn chỉ có thể gửi báo hỏng vật chất sau khi đã được xếp vào phòng cụ thể.
      </Alert>
    );
  }

  return (
    <div className="pb-5">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`alert alert-${toast.type} alert-dismissible fade show`}
          role="alert"
          style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, minWidth: 300, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        >
          {toast.msg}
        </div>
      )}

      <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <Wrench size={24} className="text-primary-custom" /> Báo hỏng thiết bị &amp; Sửa chữa
      </h3>

      <Row>
        {/* FORM BÁO HỎNG */}
        <Col lg="5" className="mb-4">
          <Card className="border-0 shadow-sm rounded-3 bg-white">
            <CardBody>
              <h5 className="fw-bold mb-3 text-dark">Tạo yêu cầu báo hỏng</h5>
              <div className="alert alert-info py-2 px-3 small border-0 mb-3">
                📍 Đang tạo báo cáo cho: <strong>Phòng {room.roomNumber}</strong> ({room.type})
              </div>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label className="fw-semibold text-secondary small">Vật dụng hư hại <span className="text-danger">*</span></Label>
                  <Input
                    type="text"
                    placeholder="VD: Hỏng bóng đèn, Rò nước bồn cầu..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    className="form-control-custom"
                  />
                </FormGroup>

                <FormGroup>
                  <Label className="fw-semibold text-secondary small">Mô tả chi tiết tình trạng hư hỏng <span className="text-danger">*</span></Label>
                  <Input
                    type="textarea"
                    rows="4"
                    placeholder="Nhập mô tả cụ thể sự cố (VD: Đèn nháy liên tục không sáng, vòi nước rỉ nhỏ giọt ở cổ vòi...)"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    className="form-control-custom"
                  />
                </FormGroup>

                <FormGroup>
                  <Label className="fw-semibold text-secondary small">Mức độ khẩn cấp</Label>
                  <Input
                    type="select"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="form-control-custom"
                  >
                    <option value="Normal">Thường (Bảo trì định kỳ)</option>
                    <option value="Urgent">Khẩn cấp (Hỏng điện nước nặng cần khắc phục ngay)</option>
                  </Input>
                </FormGroup>

                <Button color="primary" type="submit" className="btn-primary-custom w-100 mt-2 d-flex justify-content-center align-items-center gap-2" disabled={submitting}>
                  {submitting ? <Spinner size="sm"/> : <><Plus size={18}/> Gửi Ban quản lý</>}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>

        {/* LỊCH SỬ BÁO BÁO PHÒNG */}
        <Col lg="7">
          <Card className="border-0 shadow-sm rounded-3 bg-white h-100">
            <CardBody>
              <h5 className="fw-bold mb-3 text-dark">Lịch sử sự cố của phòng</h5>
              <div className="table-responsive">
                <Table hover className="align-middle text-nowrap small">
                  <thead className="table-light">
                    <tr>
                      <th>Ngày báo</th>
                      <th>Sự cố</th>
                      <th>Mức độ</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr><td colSpan={4} className="text-center text-muted py-4">Chưa phát sinh yêu cầu sửa chữa nào.</td></tr>
                    ) : requests.map(req => (
                      <tr key={req.id}>
                        <td>{req.createdAt ? new Date(req.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                        <td style={{ minWidth: '180px', whiteSpace: 'normal' }}>
                          <div className="fw-bold text-dark">{req.title}</div>
                          <div className="text-muted small">{req.description}</div>
                        </td>
                        <td>
                          <Badge color={req.priority === 'Urgent' ? 'danger' : 'secondary'}>
                            {req.priority === 'Urgent' ? 'Gấp' : 'Thường'}
                          </Badge>
                        </td>
                        <td>
                          <Badge color={
                            req.status === 'Completed' ? 'success' :
                            req.status === 'In Progress' ? 'info' : 'warning text-dark'
                          } pill>
                            {req.status === 'Completed' ? 'Đã sửa xong' :
                             req.status === 'In Progress' ? 'Đang sửa' : 'Chờ xử lý'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MaintenanceRequestForm;
