import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../components/apiconfig";
import "../../assets/styles/Style.css";

const ManageSubjects = () => {
  const [Subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ subjectName: "" });
  const [editingSubjectId, setEditingSubjectId] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = () => {
    axios
      .get(API_BASE_URL + "/Subjects")
      .then((response) => {
        setSubjects(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleDelete = (subjectId) => {
    axios
      .delete(API_BASE_URL + "/Subjects/" + subjectId)
      .then(() => {
        fetchSubjects();
      })
      .catch((error) => {
        console.error("Error deleting subject:", error);
      });
  };

  const handleEdit = (subject) => {
    setFormData({ ...subject });
    setEditingSubjectId(subject.subjectId);
  };
  
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingSubjectId) {
      axios
        .put(
            API_BASE_URL + "/Subjects/" + editingSubjectId,
          formData
        )
        .then(() => {
          setEditingSubjectId(null);
          setFormData({ subjectName: "" });
          fetchSubjects();
        })
        .catch((error) => {
          console.error("Error updating subject:", error);
        });
    } else {
      axios
        .post(API_BASE_URL + "/Subjects", formData)
        .then(() => {
          setFormData({ subjectName: "" });
          fetchSubjects();
        })
        .catch((error) => {
          console.error("Error creating subject:", error);
        });
    }
  };


  return (
    <div className="Container">
      <div className="form-container">
      <section class="registration-container">
    <h1>{editingSubjectId ? "Edit Subject" : "Add Subject"}</h1>
    <section class="details-section">
          <form onSubmit={handleSubmit} class="registration-form">
          <section class="personal-details">
          <div class="three-details-item">
          <label>
          <span className="input-label">Subject Name </span>
            <input
              type="text"
              name="subjectName"
              placeholder="Enter Subject Name"
              value={formData.subjectName}
              onChange={handleFormChange}
              required
            />
            </label>
            </div>
            <button type="submit" className="submit-btn ">
              {editingSubjectId ? "Update" : "Create"}
            </button>
            {editingSubjectId && (
            <button className="submit-btn "
              type="button"
              onClick={() => {
                setFormData({
                  subjectName: "",
                });
                setEditingSubjectId(null);
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
      <h1>Subject List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Subject Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Subjects.map((subject, index) => (
                <tr key={subject.subjectId}>
                  <td>{index + 1}</td>
                  <td>{subject.subjectName}</td>
                  <td>
                    <span className="ListEdit" onClick={() => handleEdit(subject)}>Edit</span>
                    <span className="ListDelete" onClick={() => handleDelete(subject.subjectId)}>
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

export default ManageSubjects;
