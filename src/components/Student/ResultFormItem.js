import React from "react";
import { Button, Badge } from "reactstrap";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

function ResultFormItem({ listStudent, rooms, onHandleDelete, onHandleStatusChange }) {
  const getRoomNumber = (roomId) => {
    if (!rooms) return roomId;
    const room = rooms.find(r => r.id === roomId || r.id === Number(roomId));
    return room ? `Phòng ${room.roomNumber}` : `Chưa xếp phòng`;
  };

  let items = listStudent.map((student, index) => {
    return (
      <tr key={student.id || index}>
        <td className="ps-4 fw-bold">{student.studentCode || `SV${student.id}`}</td>
        <td className="fw-semibold">{student.name}</td>
        <td>{getRoomNumber(student.roomId)}</td>
        <td>
            {student.status === 'Pending' && <Badge color="warning" className="text-dark">Chờ duyệt</Badge>}
            {student.status === 'Approved' && <Badge color="success">Đã duyệt</Badge>}
            {student.status === 'Rejected' && <Badge color="danger">Đã từ chối</Badge>}
        </td>
        <td>{student.joinDate}</td>
        <td className="text-center">
          {student.status === 'Pending' && (
            <>
              <Button color="success" size="sm" outline className="me-1" onClick={() => onHandleStatusChange(student, 'Approved')} title="Duyệt">
                <CheckCircle size={15} />
              </Button>
              <Button color="danger" size="sm" outline className="me-2" onClick={() => onHandleStatusChange(student, 'Rejected')} title="Từ chối">
                <XCircle size={15} />
              </Button>
            </>
          )}
          <Button color="warning" size="sm" outline className="me-1" title="Sửa">
            <Pencil size={15} />
          </Button>
          <Button color="danger" size="sm" outline onClick={() => onHandleDelete(student.id)} title="Xóa">
            <Trash2 size={15} />
          </Button>
        </td>
      </tr>
    );
  });
  
  if(items.length === 0) {
    return <tr><td colSpan="6" className="text-center py-4">Chưa có dữ liệu sinh viên</td></tr>;
  }
  return items;
}

export default ResultFormItem;
