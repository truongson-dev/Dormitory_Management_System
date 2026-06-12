import React, { useEffect, useState } from "react";
import CreateButton from "../components/Student/CreateButton";
import ResultForm from "../components/Student/ResultForm";
import ModalCreateNewStudent from "../components/Student/ModalCreateNewStudent";
import api from "../api";
import { Spinner } from "reactstrap";

function StudentContainer(props) {
  let [showForm, setShowForm] = useState(false);
  let [listStudent, setListStudent] = useState([]);
  let [rooms, setRooms] = useState([]);
  let [loading, setLoading] = useState(true);

  let onHandleCreateNewStudent = () => {
    setShowForm(true);
  };

  let onHandleCloseModal = () => {
    setShowForm(false);
  };

  let onhandleCreateNewStudent = (student_new) => {
    api
      .post("/students", student_new)
      .then((response) => {
        setListStudent([...listStudent, response.data]);
        setShowForm(false);
      })
      .catch((error) => console.error(error));
  };

  // Cập nhật trạng thái duyệt sinh viên
  let onHandleStatusChange = (student, newStatus) => {
    const updatedStudent = { ...student, status: newStatus };
    api
      .put(`/students/${student.id}`, updatedStudent)
      .then((res) => {
        setListStudent(
          listStudent.map((s) => (s.id === student.id ? res.data : s)),
        );

        if (newStatus === "Approved") {
          alert(`Đã duyệt sinh viên ${student.name} vào phòng!`);
        }
      })
      .catch((error) => console.error(error));
  };

  let onHandleDelete = (id) => {
    api
      .delete(`/students/${id}`)
      .then(() => {
        setListStudent(listStudent.filter((s) => s.id !== id));
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studRes, roomRes] = await Promise.all([
          api.get("/students"),
          api.get("/rooms"),
        ]);
        setListStudent(studRes.data);
        setRooms(roomRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    );

  return (
    <div>
      <h2 className="text-dark fw-bold mb-0">Quản lý sinh viên</h2>
      <CreateButton onHandleCreateNewStudent={onHandleCreateNewStudent} />
      <ModalCreateNewStudent
        showForm={showForm}
        onHandleCloseModal={onHandleCloseModal}
        onhandleCreateNewStudent={onhandleCreateNewStudent}
        rooms={rooms}
      />
      <ResultForm
        listStudent={listStudent}
        rooms={rooms}
        onHandleDelete={onHandleDelete}
        onHandleStatusChange={onHandleStatusChange}
      />
    </div>
  );
}

export default StudentContainer;
