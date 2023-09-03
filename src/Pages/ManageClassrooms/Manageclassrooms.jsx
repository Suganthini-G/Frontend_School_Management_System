import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../components/apiconfig";
import "../../assets/styles/Style.css";

const ManageClassrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ classroomName: "" });
  const [editingClassroomId, setEditingClassroomId] = useState(null);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = () => {
    axios
      .get(API_BASE_URL + "/Classrooms")
      .then((response) => {
        setClassrooms(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleDelete = (classroomId) => {
    axios
      .delete(API_BASE_URL + "/Classrooms/" + classroomId)
      .then(() => {
        fetchClassrooms();
      })
      .catch((error) => {
        console.error("Error deleting classroom:", error);
      });
  };

  const handleEdit = (classroom) => {
    setFormData({ ...classroom });
    setEditingClassroomId(classroom.classroomId);
  };
  
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingClassroomId) {
      axios
        .put(
            API_BASE_URL + "/Classrooms/" + editingClassroomId,
          formData
        )
        .then(() => {
          setEditingClassroomId(null);
          setFormData({ classroomName: "" });
          fetchClassrooms();
        })
        .catch((error) => {
          console.error("Error updating classroom:", error);
        });
    } else {
      axios
        .post(API_BASE_URL + "/Classrooms", formData)
        .then(() => {
          setFormData({ classroomName: "" });
          fetchClassrooms();
        })
        .catch((error) => {
          console.error("Error creating classroom:", error);
        });
    }
  };


  return (
    <div className="Container">
      <div className="form-container">
      <section class="registration-container">
    <h1>{editingClassroomId ? "Edit Classroom" : "Add Classroom"}</h1>
    <section class="details-section">
          <form onSubmit={handleSubmit} class="registration-form">
          <section class="personal-details">
          <div class="three-details-item">
          <label>
          <span className="input-label">Classroom Name </span>
            <input
              type="text"
              name="classroomName"
              placeholder="Enter Classroom Name"
              value={formData.classroomName}
              onChange={handleFormChange}
              required
            />
            </label>
            </div>
            <button type="submit" className="submit-btn ">
              {editingClassroomId ? "Update" : "Create"}
            </button>
            {editingClassroomId && (
            <button className="submit-btn "
              type="button"
              onClick={() => {
                setFormData({
                  classroomName: "",
                });
                setEditingClassroomId(null);
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
      <h1>Classroom List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Classroom Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classrooms.map((classroom, index) => (
                <tr key={classroom.classroomId}>
                  <td>{index + 1}</td>
                  <td>{classroom.classroomName}</td>
                  <td>
                    <span className="ListEdit" onClick={() => handleEdit(classroom)}>Edit</span>
                    <span className="ListDelete" onClick={() => handleDelete(classroom.classroomId)}>
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

export default ManageClassrooms;
