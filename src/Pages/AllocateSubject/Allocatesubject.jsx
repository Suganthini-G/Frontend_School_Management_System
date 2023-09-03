import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../components/apiconfig";
import "../../assets/styles/Style.css";

const AllocateSubjects = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [allocatedSubjects, setAllocatedSubjects] = useState([]);
  const [allocatedSubjectdetails, setallocatedSubjectdetails] = useState([]);

  useEffect(() => {
    axios.get(API_BASE_URL + "/Teachers")
      .then((response) => {
        setTeachers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });

      axios.get(API_BASE_URL + "/Subjects")
      .then((response) => {
        setSubjects(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
        setLoading(false);
      });

      fetchAllocatesubjects();
  }, []);

  const fetchAllocatesubjects = () => {
    axios
    .get(API_BASE_URL + "/AllocateSubjects")
    .then((response) => {
      setallocatedSubjectdetails(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });
  };

  const handleTeacherChange = (event) => {
    setSelectedTeacher(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleAddSubject = () => {
    if (selectedTeacher && selectedSubject) {
      const allocatedSubject = {
        teacherId: parseInt(selectedTeacher, 10),
        subjectId: parseInt(selectedSubject, 10),
      };
      setAllocatedSubjects([...allocatedSubjects, allocatedSubject]);
      setSelectedSubject("");
    }
  };

  
  const handleDeallocate = (indexToRemove) => {
    const updatedAllocatedSubjects = [...allocatedSubjects];
    updatedAllocatedSubjects.splice(indexToRemove, 1);
    setAllocatedSubjects(updatedAllocatedSubjects);
  };  

  const handleDelete = (allocatesubjectId) => {
    axios
      .delete(API_BASE_URL + "/AllocateSubjects/" + allocatesubjectId)
      .then(() => {
        fetchAllocatesubjects();
      })
      .catch((error) => {
        console.error("Error deleting allocate subjects:", error);
      });
  };

  const handleSaveAllocation = () => {
    if (allocatedSubjects.length > 0) {
      const requestDataArray = allocatedSubjects.map((allocatedSubject) => ({
        subjectId: allocatedSubject.subjectId,
        teacherId: allocatedSubject.teacherId,
      }));
  
      const promises = requestDataArray.map((requestData) =>
        axios.post(API_BASE_URL + "/AllocateSubjects", requestData)
      );
  
      Promise.all(promises)
        .then(() => {
          setAllocatedSubjects([]);
          fetchAllocatesubjects();
          setSelectedTeacher("");
        })
        .catch((error) => {
          if (error.response) {
            console.error("Server responded with an error:", error.response.data);
            if (error.response.data.errors && error.response.data.errors.allocateSubject) {
              const validationErrors = error.response.data.errors.allocateSubject;
              console.error("Validation errors:", validationErrors);
            }
          } else if (error.request) {
            console.error("No response received from the server");
          } else {
            console.error("Error setting up the request:", error.message);
          }
        });
    } else {
      console.warn("No subjects to save.");
    }
  };
  

  return (
    <div className="Container">
        <div className="form-container">
      <section class="registration-container">
      <h1>Allocate Subjects</h1>
      <section class="details-section">
      <div class="registration-form">
      <section class="personal-details">
          <div class="three-details-item">
        <label>
        <span className="input-label">Teacher </span>
          <select value={selectedTeacher} onChange={handleTeacherChange}>
            <option value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.teacherId} value={teacher.teacherId}>
                {teacher.firstName} {teacher.lastName}
              </option>
            ))}
          </select>
        </label>
        <label>
        <span className="input-label">Subject </span>
          <select value={selectedSubject} onChange={handleSubjectChange}>
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject.subjectId} value={subject.subjectId}>
                {subject.subjectName}
              </option>
            ))}
          </select>
        </label> 
      </div>
      <span className="submit-btn " onClick={handleAddSubject}>Allocate Subject</span>
      </section>
      </div>
      </section>
      </section>
      </div>
      <div className="List">
        <h2>Allocated Subjects</h2>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Teacher</th>
              <th>Subject</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allocatedSubjects.map((allocatedSubject, index) => {
              const teacher = teachers.find(
                (teacher) => teacher.teacherId === allocatedSubject.teacherId
              );
              const subject = subjects.find(
                (subject) => subject.subjectId === allocatedSubject.subjectId
              );
              return (
                <tr key={index}>
                  <td>{index +1}</td>
                  <td>
                    {teacher
                      ? `${teacher.firstName} ${teacher.lastName}`
                      : "Teacher not found"}
                  </td>
                  <td>
                    {subject ? subject.subjectName : "Subject not found"}
                  </td>
                  <td>
                  <span className="ListDelete" onClick={() => handleDeallocate(index)}>
                      Deallocate
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="submitbutton">
        <button className="submit-btn2" onClick={handleSaveAllocation}>Save</button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="List">
        <h2>Allocated Subject Details</h2>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Teacher</th>
              <th>Subject</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
             {allocatedSubjectdetails.map((allocatedSubjectdetail, index) => {
              const teacher = teachers.find(
                (teacher) => teacher.teacherId === allocatedSubjectdetail.teacherId
              );
              const subject = subjects.find(
                (subject) => subject.subjectId === allocatedSubjectdetail.subjectId
              );
              return (
                <tr key={allocatedSubjectdetail.allocateSubjectId}>
                  <td>{index +1}</td>
                  <td>
                    {teacher
                      ? `${teacher.firstName} ${teacher.lastName}`
                      : "Teacher not found"}
                  </td>
                  <td>
                    {subject ? subject.subjectName : "Subject not found"}
                  </td>
                  <td>
                  {/* <span className="AllocatedSubjectsListEdit" onClick={() => handleDeallocate(index)}>
                      Edit
                    </span> */}
                    <span className="Delete" onClick={() => handleDelete(allocatedSubjectdetail.allocateSubjectId)}>
                      Delete
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default AllocateSubjects;
  