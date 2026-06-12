import React from 'react';
import { Container, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import InputForm from './InputForm.js';

function ModalCreateNewStudent(props) {
    let { showForm, onHandleCloseModal, onhandleCreateNewStudent, rooms } = props;

    let handleCloseForm = () => {
        onHandleCloseModal();
    }

    return (
        <Container>
            <Modal isOpen={showForm} >
                <ModalHeader> <h3>Thêm sinh viên mới</h3></ModalHeader>
                <ModalBody>
                    <InputForm onhandleCreateNewStudent={onhandleCreateNewStudent} rooms={rooms} />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleCloseForm} >
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    )
}

export default ModalCreateNewStudent;
