import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../components/apiconfig";
import "../../assets/styles/Style.css";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createForm, setCreateForm] = useState({
    firstName: "",
    lastName: "",
    contactPerson: "",
    contactNo: "",
    emailAddress: "",
    dateOfBirth: "",
    classroomId: "",
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [age, setAge] = useState("");

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };
  

  useEffect(() => {
    axios
      .get(API_BASE_URL + "/Students")
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });

    axios
      .get(API_BASE_URL + "/Classrooms")
      .then((response) => {
        setClassrooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching classrooms:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "dateOfBirth") {
      const calculatedAge = calculateAge(value);
      setAge(calculatedAge);
    }
  
    setCreateForm({
      ...createForm,
      [name]: value,
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !createForm.firstName ||
      !createForm.lastName ||
      !createForm.contactPerson ||
      !createForm.contactNo ||
      !createForm.emailAddress ||
      !createForm.dateOfBirth ||
      !createForm.classroomId
    ) {
      alert("All fields are required.");
      return;
    }
  
    const contactNoPattern = /^[0-9]*$/;
    if (!contactNoPattern.test(createForm.contactNo) || createForm.contactNo.length !== 10) {
      alert("Contact No must be a 10-digit number.");
      return;
    }

    try {
      if (editingStudent) {
        await axios.put(
          API_BASE_URL + "/Students/" + editingStudent.studentId,
          createForm
        );
      } else {
        await axios.post(API_BASE_URL + "/Students", createForm);
      }
      const response = await axios.get(API_BASE_URL + "/Students");
      setStudents(response.data);
      setCreateForm({
        firstName: "",
        lastName: "",
        contactPerson: "",
        contactNo: "",
        emailAddress: "",
        dateOfBirth: "",
        classroomId: "",
      });
      setEditingStudent(null);
      setAge("");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const editStudent = (student) => {
    const formattedDateOfBirth = new Date(student.dateOfBirth)
      .toISOString()
      .split("T")[0];

    const calculatedAge = calculateAge(formattedDateOfBirth);

    setCreateForm({
      ...student,
      dateOfBirth: formattedDateOfBirth,
    });

    setAge(calculatedAge);

    setEditingStudent(student);
  };

  const deleteStudent = async (studentId) => {
    try {
      await axios.delete(API_BASE_URL + "/Students/" + studentId);
      const updatedStudents = students.filter(
        (student) => student.studentId !== studentId
      );
      setStudents(updatedStudents);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="Container">
      <div className="form-container">
      <section class="registration-container">
      <h1>{editingStudent ? "Edit Student" : "Add Student"}</h1>
      <section class="details-section">
      <form onSubmit={handleSubmit} class="registration-form">
        <section class="personal-details">
          <div class="three-details-item">
          <label>
          <span className="input-label">First Name </span>
            <input
              type="text"
              name="firstName"
              value={createForm.firstName}
              onChange={handleInputChange}
              required
              placeholder="Enter your First name"
            />
          </label>
          <label for="lname">
          <span className="input-label">Last Name </span>
            <input
              type="text"
              name="lastName"
              value={createForm.lastName}
              onChange={handleInputChange}
              required
              placeholder="Enter your Last name"
            />
          </label>
          <label for="cpname">
          <span className="input-label">Contact Person </span>
            <input
              type="text"
              name="contactPerson"
              value={createForm.contactPerson}
              onChange={handleInputChange}
              required
              placeholder="Enter your Contact Person"
            />
          </label>
          </div>
          <div class="three-details-item">
          <label for="cno">
          <span className="input-label"> Contact No </span>
            <input
              type="text"
              name="contactNo"
              value={createForm.contactNo}
              onChange={handleInputChange}
              required
              placeholder="Enter your Contact No"
            />
          </label>
          <label for="email">
          <span className="input-label">Email Address </span>
            <input
              type="email"
              name="emailAddress"
              value={createForm.emailAddress}
              onChange={handleInputChange}
              required
              placeholder="Enter your Email Address"
            />
          </label>
          </div>
          <div class="three-details-item">
          <label>
          <span className="input-label">Date of Birth </span>
            <input
              type="date"
              name="dateOfBirth"
              value={createForm.dateOfBirth}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
          <span className="input-label">Age </span>
            <input type="number" name="age" value={age} disabled />
          </label>
        <div className="formColumn">
          <label>
          <span className="input-label">Classroom </span>
            <select
              name="classroomId"
              value={createForm.classroomId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Classroom</option>
              {classrooms.map((classroom) => (
                <option
                  key={classroom.classroomId}
                  value={classroom.classroomId}
                >
                  {classroom.classroomName}
                </option>
              ))}
            </select>
          </label>
          </div>
          </div> 
          <button type="submit" className="submit-btn ">
            {editingStudent ? "Update Student" : "Add Student"}
          </button>
          {editingStudent && (
            <button className="submit-btn "
              type="button"
              onClick={() => {
                setCreateForm({
                  firstName: "",
                  lastName: "",
                  contactPerson: "",
                  contactNo: "",
                  emailAddress: "",
                  dateOfBirth: "",
                  classroomId: "",
                });
                setEditingStudent(null);
                setAge("");
              }}
            >
              Cancel
            </button>
          )}
        </section>
      </form>
      </section>
      </section>
      </div>
    <div className="List">
    <h1>Students List</h1>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <div>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Student Name</th>
              <th>Contact Person</th>
              <th>Contact No</th>
              <th>Email Address</th>
              <th>DOB</th>
              <th>Classroom</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.studentId}>
                <td>{index + 1}</td>
                <td className="ListItem">
                  {student.firstName} {student.lastName}
                </td>
                <td>{student.contactPerson}</td>
                <td>{student.contactNo}</td>
                <td>{student.emailAddress}</td>
                <td>{formatDate(student.dateOfBirth)}</td>
                <td>
                  {
                    classrooms.find(
                      (classroom) => classroom.classroomId === student.classroomId
                    )?.classroomName
                  }
                </td>
                <td>
                <span className="ListEdit" onClick={() => editStudent(student)}>Edit</span>
                  <span
                    className="ListDelete"
                    onClick={() => deleteStudent(student.studentId)}
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  </div>
  );
}
