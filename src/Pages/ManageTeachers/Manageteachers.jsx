import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../components/apiconfig";
import "../../assets/styles/Style.css";

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createForm, setCreateForm] = useState({
    firstName: "",
    lastName: "",
    contactNo: "",
    emailAddress: "",
  });
  const [editingTeacher, setEditingTeacher] = useState(null);

  useEffect(() => {
    axios
      .get(API_BASE_URL + "/Teachers")
      .then((response) => {
        setTeachers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

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
      !createForm.contactNo ||
      !createForm.emailAddress
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
      if (editingTeacher) {
        await axios.put(
            API_BASE_URL + "/Teachers/" + editingTeacher.teacherId,
          createForm
        );
      } else {
        await axios.post(API_BASE_URL + "/Teachers", createForm);
      }
      const response = await axios.get(API_BASE_URL + "/Teachers");
      setTeachers(response.data);
      setCreateForm({
        firstName: "",
        lastName: "",
        contactNo: "",
        emailAddress: "",
      });
      setEditingTeacher(null);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const editTeacher = (teacher) => {
    setCreateForm({ ...teacher });
    setEditingTeacher(teacher);
  };

  const deleteTeacher = async (teacherId) => {
    try {
      await axios.delete(API_BASE_URL + "/Teachers/" + teacherId);
      const updatedTeachers = teachers.filter(
        (teacher) => teacher.teacherId !== teacherId
      );
      setTeachers(updatedTeachers);
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  return (
    <div className="Container">
      <div className="form-container">
      <section class="registration-container">
    <h1>{editingTeacher ? "Edit Teacher" : "Add Teacher"}</h1>
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
            <label>
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
            </div>
            <div class="three-details-item">
            <label>
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
            <br />
            <label>
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
            <button type="submit" className="submit-btn ">
              {editingTeacher ? "Update Teacher" : "Add Teacher"}
            </button>
            {editingTeacher && (
              <button className="submit-btn "
                type="button"
                onClick={() => {
                  setCreateForm({
                    firstName: "",
                    lastName: "",
                    contactNo: "",
                    emailAddress: "",
                  });
                  setEditingTeacher(null);
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
      <h1>Teacher List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Teacher Name</th>
                <th>Contact No</th>
                <th>Email Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr key={teacher.teacherId}>
                  <td>{index + 1}</td>
                  <td className="ListItem">
                  {teacher.firstName} {teacher.lastName}
                </td>
                  <td>{teacher.contactNo}</td>
                  <td>{teacher.emailAddress}</td>
                  <td>
                    <span className="ListEdit" onClick={() => editTeacher(teacher)}>Edit</span>
                    <span
                    className="ListDelete" onClick={() => deleteTeacher(teacher.teacherId)}>
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
};

export default ManageTeachers;
