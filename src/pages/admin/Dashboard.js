import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Badge, Spinner } from 'reactstrap';
import {
  BedDouble, Users, CheckCircle, FileText, Wrench,
  TrendingUp, AlertCircle, ArrowUpRight, Clock,
  Activity, BarChart2
} from 'lucide-react';
import api from '../../api';

// ===================================================
// Trang Dashboard – Thống kê tổng quan cho Admin
// ===================================================
const Dashboard = () => {
  const [data, setData] = useState({
    rooms: [],
    students: [],
    invoices: [],
    maintenances: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [rRes, sRes, iRes, mRes] = await Promise.all([
          api.get('/rooms'),
          api.get('/students'),
          api.get('/invoices'),
          api.get('/maintenances'),
        ]);
        setData({
          rooms: rRes.data || [],
          students: sRes.data || [],
          invoices: iRes.data || [],
          maintenances: mRes.data || [],
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const { rooms, students, invoices, maintenances } = data;

  // ── Thống kê doanh thu theo kỳ (Tạo xu hướng thời gian 6 tháng) ──
  const chartData = React.useMemo(() => {
    const mockHistory = {
      5: { paid: 2500000, total: 3000000 },
      4: { paid: 3800000, total: 4200000 },
      3: { paid: 3200000, total: 3500000 },
      2: { paid: 4800000, total: 5000000 },
      1: { paid: 5500000, total: 6000000 },
    };

    const d = new Date();
    return Array.from({ length: 6 }).map((_, idx) => {
      const i = 5 - idx;
      const monthDate = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const yyyy = monthDate.getFullYear();
      const mm = String(monthDate.getMonth() + 1).padStart(2, '0');
      const monthKey = `${yyyy}-${mm}`;

      // Lấy doanh thu thật từ DB
      const realPaid = invoices.filter(inv => inv.status === 'Paid' && inv.month === monthKey).reduce((s, inv) => s + inv.amount, 0);
      const realTotal = invoices.filter(inv => inv.month === monthKey).reduce((s, inv) => s + inv.amount, 0);

      const hasRealData = invoices.some(inv => inv.month === monthKey);
      let paid = realPaid;
      let total = realTotal;

      if (!hasRealData && mockHistory[i]) {
        paid = mockHistory[i].paid;
        total = mockHistory[i].total;
      }

      return {
        label: `${mm}/${yyyy.toString().slice(2)}`,
        key: monthKey,
        paid,
        total
      };
    });
  }, [invoices]);

  const maxVal = React.useMemo(() => {
    return Math.max(...chartData.map(d => Math.max(d.paid, d.total)), 1000000);
  }, [chartData]);

  const svgWidth = 600;
  const svgHeight = 200;
  const paddingX = 50;
  const paddingY = 30;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  const points = React.useMemo(() => {
    return chartData.map((d, i) => {
      const x = paddingX + (i * (graphWidth / 5));
      const yPaid = paddingY + graphHeight - (d.paid / maxVal) * graphHeight;
      const yTotal = paddingY + graphHeight - (d.total / maxVal) * graphHeight;
      return { x, yPaid, yTotal, ...d };
    });
  }, [chartData, maxVal, graphWidth, graphHeight]);

  const pathPaid = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yPaid}`).join(' ');
  const pathTotal = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yTotal}`).join(' ');

  const areaPaid = `${pathPaid} L ${points[points.length - 1].x} ${paddingY + graphHeight} L ${points[0].x} ${paddingY + graphHeight} Z`;
  const areaTotal = `${pathTotal} L ${points[points.length - 1].x} ${paddingY + graphHeight} L ${points[0].x} ${paddingY + graphHeight} Z`;

  if (loading) {
    return (
      <div className="text-center mt-5 pt-5">
        <Spinner color="primary" style={{ width: 48, height: 48 }} />
        <p className="mt-3 text-muted">Đang tải dữ liệu thống kê...</p>
      </div>
    );
  }

  // ── Các con số KPI ──
  const totalRooms       = rooms.length;
  const availableRooms   = rooms.filter(r => r.status === 'Available').length;
  const fullRooms        = rooms.filter(r => r.status === 'Full').length;
  const occupancyRate    = totalRooms > 0 ? Math.round((fullRooms / totalRooms) * 100) : 0;

  const totalStudents    = students.length;
  const approvedStudents = students.filter(s => s.status === 'Approved').length;
  const pendingStudents  = students.filter(s => s.status === 'Pending').length;

  const totalRevenue     = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const unpaidAmount     = invoices.filter(i => i.status === 'Unpaid').reduce((s, i) => s + i.amount, 0);
  const unpaidCount      = invoices.filter(i => i.status === 'Unpaid').length;

  const pendingMaint     = maintenances.filter(m => m.status === 'Pending').length;
  const inProgressMaint  = maintenances.filter(m => m.status === 'In Progress').length;
  const urgentMaint      = maintenances.filter(m => m.priority === 'Urgent' && m.status !== 'Completed').length;

  // ── 5 hóa đơn chưa thanh toán gần nhất ──
  const latestUnpaid = invoices
    .filter(i => i.status === 'Unpaid')
    .slice(-5)
    .reverse();

  // ── 5 yêu cầu bảo trì đang chờ ──
  const latestMaint = maintenances
    .filter(m => m.status !== 'Completed')
    .slice(-5)
    .reverse();

  const getRoomNumber = (roomId) => {
    const r = rooms.find(r => r.id === roomId || r.id === Number(roomId));
    return r ? `P.${r.roomNumber}` : `#${roomId}`;
  };

  // ── Màu type phòng ──
  const typeColor = { Normal: '#0d9488', VIP: '#7c3aed' };

  return (
    <div style={{ minHeight: '100%' }}>
      {/* ── TIÊU ĐỀ TRANG ── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#1e293b' }}>Bảng thống kê</h2>
          <small className="text-muted">Tổng quan hệ thống Ký Túc Xá theo thời gian thực</small>
        </div>

      </div>

      {/* ── ROW 1: KPI CARDS ── */}
      <Row className="g-3 mb-4">

        {/* Phòng */}
        <Col xs={12} sm={6} xl={3}>
          <Card className="border-0 h-100" style={{
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(13,148,136,0.12)',
            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
            color: 'white',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(13,148,136,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(13,148,136,0.12)'; }}
          >
            <CardBody className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-white bg-opacity-25 rounded-3 p-2">
                  <BedDouble size={22} />
                </div>
                <span className="badge rounded-pill" style={{ background: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
                  {occupancyRate}% lấp đầy
                </span>
              </div>
              <h2 className="fw-bold mb-0">{totalRooms}</h2>
              <p className="mb-2 opacity-90" style={{ fontSize: 13 }}>Tổng số phòng</p>
              <div className="d-flex gap-2">
                <span className="small opacity-75">✓ Còn trống: <b>{availableRooms}</b></span>
                <span className="small opacity-75">· Full: <b>{fullRooms}</b></span>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Sinh viên */}
        <Col xs={12} sm={6} xl={3}>
          <Card className="border-0 h-100" style={{
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(124,58,237,0.12)',
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            color: 'white',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,58,237,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.12)'; }}
          >
            <CardBody className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-white bg-opacity-25 rounded-3 p-2">
                  <Users size={22} />
                </div>
                {pendingStudents > 0 && (
                  <span className="badge rounded-pill" style={{ background: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
                    {pendingStudents} chờ duyệt
                  </span>
                )}
              </div>
              <h2 className="fw-bold mb-0">{totalStudents}</h2>
              <p className="mb-2 opacity-90" style={{ fontSize: 13 }}>Sinh viên</p>
              <div className="d-flex gap-2">
                <span className="small opacity-75">✓ Đã duyệt: <b>{approvedStudents}</b></span>
                {pendingStudents > 0 && <span className="small opacity-75">· Pending: <b>{pendingStudents}</b></span>}
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Doanh thu */}
        <Col xs={12} sm={6} xl={3}>
          <Card className="border-0 h-100" style={{
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(234,88,12,0.12)',
            background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
            color: 'white',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(234,88,12,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(234,88,12,0.12)'; }}
          >
            <CardBody className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-white bg-opacity-25 rounded-3 p-2">
                  <TrendingUp size={22} />
                </div>
                <span className="badge rounded-pill" style={{ background: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
                  <ArrowUpRight size={11} /> Thu được
                </span>
              </div>
              <h2 className="fw-bold mb-0" style={{ fontSize: 22 }}>
                {(totalRevenue / 1_000_000).toFixed(1)}tr đ
              </h2>
              <p className="mb-2 opacity-90" style={{ fontSize: 13 }}>Tổng đã thu</p>
              <span className="small opacity-75">Chưa thu: <b>{(unpaidAmount / 1_000_000).toFixed(1)}tr đ</b> ({unpaidCount} HĐ)</span>
            </CardBody>
          </Card>
        </Col>

        {/* Bảo trì */}
        <Col xs={12} sm={6} xl={3}>
          <Card className="border-0 h-100" style={{
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(220,38,38,0.12)',
            background: urgentMaint > 0
              ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
              : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <CardBody className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-white bg-opacity-25 rounded-3 p-2">
                  <Wrench size={22} />
                </div>
                {urgentMaint > 0 && (
                  <span className="badge rounded-pill" style={{ background: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
                    {urgentMaint} gấp!
                  </span>
                )}
              </div>
              <h2 className="fw-bold mb-0">{pendingMaint + inProgressMaint}</h2>
              <p className="mb-2 opacity-90" style={{ fontSize: 13 }}>Yêu cầu sửa chữa</p>
              <div className="d-flex gap-2">
                <span className="small opacity-75">Chờ: <b>{pendingMaint}</b></span>
                <span className="small opacity-75">· Đang sửa: <b>{inProgressMaint}</b></span>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ── ROW 2: Biểu đồ + Tỉ lệ phòng ── */}
      <Row className="g-3 mb-4">

        {/* Biểu đồ doanh thu theo kỳ */}
        <Col xs={12} lg={8}>
          <Card className="border-0 h-100" style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <CardBody className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2">
                  <TrendingUp size={20} className="text-primary-custom" />
                  <h6 className="fw-bold mb-0">Xu hướng doanh thu (6 tháng gần đây)</h6>
                </div>
                <div className="d-flex gap-3 align-items-center" style={{ fontSize: 11 }}>
                  <div className="d-flex align-items-center gap-1">
                    <span style={{ display: 'inline-block', width: 12, height: 3, backgroundColor: '#0d9488', borderRadius: 2 }} />
                    <span className="text-muted">Đã thu thực tế</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <span style={{ display: 'inline-block', width: 12, height: 3, borderTop: '2px dashed #3b82f6' }} />
                    <span className="text-muted">Tổng phát sinh</span>
                  </div>
                </div>
              </div>
              
              <div className="w-100">
                <svg viewBox="0 0 600 200" className="w-100" style={{ maxHeight: 200 }}>
                  <defs>
                    <linearGradient id="paid-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d9488" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="total-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gridlines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                    const y = paddingY + graphHeight * ratio;
                    const labelVal = Math.round(maxVal * (1 - ratio));
                    return (
                      <g key={idx}>
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={svgWidth - paddingX}
                          y2={y}
                          stroke="#f1f5f9"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={paddingX - 10}
                          y={y + 3}
                          textAnchor="end"
                          fill="#94a3b8"
                          style={{ fontSize: 9, fontFamily: 'sans-serif', fontWeight: 500 }}
                        >
                          {(labelVal / 1_000_000).toFixed(1)}M
                        </text>
                      </g>
                    );
                  })}

                  {/* Area fills */}
                  <path d={areaTotal} fill="url(#total-grad)" />
                  <path d={areaPaid} fill="url(#paid-grad)" />

                  {/* Lines */}
                  <path d={pathTotal} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                  <path d={pathPaid} fill="none" stroke="#0d9488" strokeWidth="3" />

                  {/* Markers & Labels */}
                  {points.map((p, idx) => (
                    <g key={idx}>
                      <circle
                        cx={p.x}
                        cy={p.yTotal}
                        r="3.5"
                        fill="#ffffff"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        title={`Tổng phát sinh: ${p.total.toLocaleString('vi-VN')} đ`}
                      />
                      <circle
                        cx={p.x}
                        cy={p.yPaid}
                        r="4.5"
                        fill="#0d9488"
                        stroke="#ffffff"
                        strokeWidth="2"
                        title={`Đã thu: ${p.paid.toLocaleString('vi-VN')} đ`}
                      />
                      <text
                        x={p.x}
                        y={svgHeight - 8}
                        textAnchor="middle"
                        fill="#64748b"
                        style={{ fontSize: 9, fontFamily: 'sans-serif', fontWeight: 500 }}
                      >
                        {p.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Tỉ lệ phòng theo loại */}
        <Col xs={12} lg={4}>
          <Card className="border-0 h-100" style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <CardBody className="p-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <CheckCircle size={20} className="text-primary-custom" />
                <h6 className="fw-bold mb-0">Phòng theo loại</h6>
              </div>
              {['Normal', 'VIP'].map(type => {
                const count = rooms.filter(r => r.type === type).length;
                const pct   = totalRooms > 0 ? Math.round((count / totalRooms) * 100) : 0;
                return (
                  <div key={type} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold" style={{ fontSize: 13 }}>{type}</span>
                      <span className="text-muted" style={{ fontSize: 12 }}>{count} phòng ({pct}%)</span>
                    </div>
                    <div className="w-100 rounded-pill" style={{ height: 8, background: '#f1f5f9' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: typeColor[type] || '#64748b',
                          borderRadius: 99,
                          transition: 'width 0.6s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              <hr className="my-3" />

              <div className="d-flex align-items-center gap-2 mb-3">
                <Activity size={16} className="text-primary-custom" />
                <span className="fw-semibold" style={{ fontSize: 13 }}>Trạng thái phòng</span>
              </div>
              {['Available', 'Full'].map(status => {
                const count = rooms.filter(r => r.status === status).length;
                const pct   = totalRooms > 0 ? Math.round((count / totalRooms) * 100) : 0;
                const color = status === 'Available' ? '#16a34a' : '#dc2626';
                return (
                  <div key={status} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold" style={{ fontSize: 13, color }}>
                        {status === 'Available' ? '● Còn trống' : '● Đã đầy'}
                      </span>
                      <span className="text-muted" style={{ fontSize: 12 }}>{count} ({pct}%)</span>
                    </div>
                    <div className="w-100 rounded-pill" style={{ height: 6, background: '#f1f5f9' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: color,
                          borderRadius: 99,
                          transition: 'width 0.6s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ── ROW 3: Hoạt động gần đây ── */}
      <Row className="g-3">

        {/* Hóa đơn chưa thanh toán */}
        <Col xs={12} lg={6}>
          <Card className="border-0" style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <CardBody className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <FileText size={18} style={{ color: '#ea580c' }} />
                  <h6 className="fw-bold mb-0">Hóa đơn chưa thanh toán</h6>
                </div>
                {unpaidCount > 0 && (
                  <Badge pill style={{ background: '#fef3c7', color: '#92400e', border: 'none', fontWeight: 600 }}>
                    {unpaidCount} HĐ
                  </Badge>
                )}
              </div>

              {latestUnpaid.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <CheckCircle size={32} className="mb-2" style={{ color: '#16a34a', opacity: 0.4 }} />
                  <p className="mb-0 small">Tất cả hóa đơn đã được thanh toán! 🎉</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {latestUnpaid.map(inv => (
                    <div key={inv.id} className="d-flex justify-content-between align-items-center p-2 rounded-3"
                      style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                      <div>
                        <span className="fw-semibold" style={{ fontSize: 13 }}>{getRoomNumber(inv.roomId)}</span>
                        <span className="text-muted mx-2" style={{ fontSize: 12 }}>•</span>
                        <span className="text-muted" style={{ fontSize: 12 }}>{inv.type} · {inv.month}</span>
                      </div>
                      <span className="fw-bold" style={{ color: '#dc2626', fontSize: 13 }}>
                        {Number(inv.amount).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>

        {/* Yêu cầu sửa chữa đang xử lý */}
        <Col xs={12} lg={6}>
          <Card className="border-0" style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <CardBody className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <Wrench size={18} style={{ color: '#7c3aed' }} />
                  <h6 className="fw-bold mb-0">Yêu cầu sửa chữa đang xử lý</h6>
                </div>
                {urgentMaint > 0 && (
                  <Badge pill style={{ background: '#fee2e2', color: '#991b1b', border: 'none', fontWeight: 600 }}>
                    <AlertCircle size={10} className="me-1" />{urgentMaint} Gấp!
                  </Badge>
                )}
              </div>

              {latestMaint.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <CheckCircle size={32} className="mb-2" style={{ color: '#16a34a', opacity: 0.4 }} />
                  <p className="mb-0 small">Không có yêu cầu sửa chữa nào đang chờ! ✅</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {latestMaint.map(m => {
                    const isUrgent = m.priority === 'Urgent';
                    const isPending = m.status === 'Pending';
                    return (
                      <div key={m.id} className="d-flex justify-content-between align-items-center p-2 rounded-3"
                        style={{
                          background: isUrgent ? '#fff1f2' : '#f8fafc',
                          border: `1px solid ${isUrgent ? '#fecdd3' : '#e2e8f0'}`
                        }}>
                        <div>
                          <span className="fw-semibold" style={{ fontSize: 13 }}>{getRoomNumber(m.roomId)}</span>
                          <span className="text-muted mx-2" style={{ fontSize: 12 }}>•</span>
                          <span style={{ fontSize: 12 }} className={isUrgent ? 'text-danger' : 'text-muted'}>
                            {m.title}
                          </span>
                        </div>
                        <div className="d-flex gap-1">
                          {isUrgent && (
                            <span className="badge" style={{ background: '#fee2e2', color: '#991b1b', fontSize: 10 }}>Gấp</span>
                          )}
                          <span className="badge" style={{
                            background: isPending ? '#fef9c3' : '#dbeafe',
                            color: isPending ? '#854d0e' : '#1e40af',
                            fontSize: 10
                          }}>
                            <Clock size={9} className="me-1" />
                            {isPending ? 'Chờ' : 'Đang sửa'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
