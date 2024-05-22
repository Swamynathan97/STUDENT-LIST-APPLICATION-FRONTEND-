import React, { useEffect, useState } from "react";
import { Pencil, Trash } from "react-bootstrap-icons";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  enrollNumber: string;
  dateOfAdmission: string;
  avatar: File | null;
}

const StudentPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<Student>({
    _id: "",
    name: "",
    email: "",
    phone: "",
    enrollNumber: "",
    dateOfAdmission: "",
    avatar: null,
  });

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`http://localhost:8000/api/students`)
        .then((res) => {
          setStudents(res.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    fetchData();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      _id: "",
      name: "",
      email: "",
      phone: "",
      enrollNumber: "",
      dateOfAdmission: "",
      avatar: null,
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFormData({ ...formData, avatar: file });
    }
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value as string | Blob);
      });
      await axios.post("http://localhost:8000/api/student", formDataToSend);
      handleCloseModal();
      Swal.fire({
        icon: "success",
        title: "Saved successfully",
        text: "The student has been successfully added!",
      });
    } catch (error) {
      console.error("Error saving data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while saving the student!",
      });
    }
  };

  const handleDelete = (studentId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this student!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8000/api/student/${studentId}`);
          setStudents(students.filter((student) => student._id !== studentId));
          Swal.fire("Deleted!", "The student has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting student:", error);
          Swal.fire(
            "Error!",
            "Something went wrong while deleting the student.",
            "error"
          );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your student is safe :)", "error");
      }
    });
  };

  const handleEdit = (student: Student) => {
    setFormData(student);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value as string | Blob);
      });
      await axios.patch(
        `http://localhost:8000/api/student/${formData._id}`,
        formDataToSend
      );
      handleCloseModal();
      Swal.fire({
        icon: "success",
        title: "Updated successfully",
        text: "The student information has been successfully updated!",
      });
    } catch (error) {
      console.error("Error updating data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while updating the student information!",
      });
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row: Student) => row.name,
      sortable: true,
      cell: (row: Student) => (
        <div className="d-flex align-items-center">
          {row.avatar ? (
            <img
              src={`/images/${row.avatar}`}
              alt="avatar"
              style={{ width: "80px", height: "80px" }}
            />
          ) : (
            <div className="mr-2">No Avatar</div>
          )}
          <span>{row.name}</span>
        </div>
      ),
    },

    {
      name: "Email",
      selector: (row: Student) => row.email,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row: Student) => row.phone,
      sortable: true,
    },
    {
      name: "Enroll Number",
      selector: (row: Student) => row.enrollNumber,
      sortable: true,
    },
    {
      name: "Date of Admission",
      selector: (row: Student) => row.dateOfAdmission,
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row: Student) => (
        <div className="d-flex justify-content-center">
          <Pencil
            size={20}
            className="text-primary mr-3"
            onClick={() => handleEdit(row)}
          />
          <Trash
            size={20}
            className="text-danger"
            onClick={() => handleDelete(row._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <Container fluid>
      <Row>
        <Col
          id="grad1"
          md={3}
          className="bg-gradient-blue-violet d-flex flex-column align-items-center justify-content-center"
        >
          <div className="text-center">
            <h3>Yellow Owl</h3>
            <p>Admin</p>
          </div>
          <img
            src="https://via.placeholder.com/150"
            alt="Yellow Owl"
            className="img-fluid rounded-circle mb-3"
          />
        </Col>
        <Col md={9}>
          <Navbar
            className="bg-gradient-green-skyblue d-flex flex-column align-items-center justify-content-center"
            expand="lg"
          >
            <Navbar.Brand href="#">Student</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="ml-auto">{/* Your navigation links here */}</Nav>
            </Navbar.Collapse>
          </Navbar>
          <Form>
            <Form.Group>
              <Row>
                <Col></Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </Col>
                <Col>
                  <Button size="lg" variant="success" onClick={handleShowModal}>
                    Add Student
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
          <DataTable
            title="Students"
            columns={columns}
            data={filteredStudents}
            keyField="id"
            className="mt-3"
            responsive
            striped
            noHeader
            persistTableHead
            defaultSortFieldId="name"
            defaultSortAsc={true}
          />
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{formData._id ? "Edit Student" : "Add Student"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEnrollNumber">
              <Form.Label>Enroll Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter enroll number"
                name="enrollNumber"
                value={formData.enrollNumber}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicDateOfAdmission">
              <Form.Label>Date of Admission</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter date of admission"
                name="dateOfAdmission"
                value={formData.dateOfAdmission}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicAvatar">
              <Form.Label>Avatar</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {formData._id ? (
            <Button variant="primary" onClick={handleUpdate}>
              Update
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StudentPage;
