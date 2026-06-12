import React from "react";
import { Container, Button } from "reactstrap";

function CreateButton(props) {
  let { onHandleCreateNewStudent } = props;
  
  let handleCreateNewStudent = () => {
    onHandleCreateNewStudent();
  };

  return (
    <Container className="px-0">
      <br />
      <Button color="primary" onClick={handleCreateNewStudent}>Thêm sinh viên mới</Button>
      <br /><br />
    </Container>
  );
}

export default CreateButton;
