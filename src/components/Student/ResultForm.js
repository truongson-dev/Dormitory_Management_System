import React from "react";
import { Table, Container, Card, CardBody } from "reactstrap";
import ResultFormItem from "./ResultFormItem";

function ResultForm({ listStudent, rooms, onHandleDelete, onHandleStatusChange }) {
  return (
    <Container className="px-0">
      <Card className="border-0 shadow-sm rounded-3">
        <CardBody className="p-0">
          <Table hover className="table-custom mb-0">
            <thead>
              <tr>
                <th className="ps-4">Mã SV</th>
                <th>Họ và Tên</th>
                <th>Phòng</th>
                <th>Trạng thái</th>
                <th>Ngày đăng ký</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <ResultFormItem listStudent={listStudent} rooms={rooms} onHandleDelete={onHandleDelete} onHandleStatusChange={onHandleStatusChange} />
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Container>
  );
}

export default ResultForm;
