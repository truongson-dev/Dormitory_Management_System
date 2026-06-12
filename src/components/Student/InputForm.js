import React, { useState } from "react";
import { Container, Form, FormGroup, Input, Label, Button } from "reactstrap";

function InputForm(props) {
    let { onhandleCreateNewStudent, rooms } = props;

    let [name, setName] = useState("");
    let [studentCode, setStudentCode] = useState("");
    let [phone, setPhone] = useState("");
    let [email, setEmail] = useState("");
    let [roomId, setRoomId] = useState("");

    let handlecreate = () => {
        let student_new = {
            name: name,
            studentCode: studentCode,
            phone: phone,
            email: email,
            joinDate: new Date().toISOString().split('T')[0],
            roomId: roomId ? Number(roomId) : null
        }
        onhandleCreateNewStudent(student_new);
    }

    let handleReset = () => {
        setName("");
        setStudentCode("");
        setPhone("");
        setEmail("");
        setRoomId("");
    }

    return (
        <Container>
            <Form>
                <FormGroup>
                    <Label for="Name">Họ và Tên: </Label>
                    <Input id="Name" name="Name" placeholder="Nhập họ tên" type="text" value={name} onChange={(event) => setName(event.target.value)} />
                </FormGroup>

                <FormGroup>
                    <Label for="StudentCode">Mã sinh viên: </Label>
                    <Input id="StudentCode" name="StudentCode" placeholder="Nhập mã sinh viên" type="text" value={studentCode} onChange={(event) => setStudentCode(event.target.value)} />
                </FormGroup>

                <FormGroup>
                    <Label for="Phone">Số điện thoại: </Label>
                    <Input id="Phone" name="Phone" placeholder="Nhập số điện thoại" type="text" value={phone} onChange={(event) => setPhone(event.target.value)} />
                </FormGroup>

                <FormGroup>
                    <Label for="Email">Email: </Label>
                    <Input id="Email" name="Email" placeholder="Nhập email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </FormGroup>

                <FormGroup>
                    <Label for="RoomId">Phòng: </Label>
                    <Input id="RoomId" name="RoomId" type="select" value={roomId} onChange={(event) => setRoomId(event.target.value)}>
                        <option value="">-- Chọn phòng --</option>
                        {rooms && rooms.map(room => (
                            <option key={room.id} value={room.id}>
                                Phòng {room.roomNumber} ({room.type})
                            </option>
                        ))}
                    </Input>
                </FormGroup>
            </Form>
            
            <Button color="primary" onClick={handlecreate} className="me-2">
                Create
            </Button>
            <Button color="danger" onClick={handleReset}>Reset</Button>

        </Container>
    );
}

export default InputForm;
