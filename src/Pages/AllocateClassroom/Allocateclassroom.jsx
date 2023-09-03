import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../components/apiconfig";
import "../../assets/styles/Style.css";

const AllocateClassrooms = () => {
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [allocatedClassrooms, setAllocatedClassrooms] = useState([]);
  const [allocatedClassroomDetails, setAllocatedClassroomDetails] = useState([]);

  useEffect(() => {
    axios.get(API_BASE_URL + "/Teachers")
      .then((response) => {
        setTeachers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });

    axios.get(API_BASE_URL + "/Classrooms")
      .then((response) => {
        setClassrooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching classrooms:", error);
      })
      .finally(() => {
        setLoading(false); 
      });

    fetchAllocatedClassrooms();
  }, []);

  const fetchAllocatedClassrooms = () => {
    axios
      .get(API_BASE_URL + "/AllocateClassrooms")
      .then((response) => {
        setAllocatedClassroomDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching allocated classrooms:", error);
      });
  };

  const handleTeacherChange = (event) => {
    setSelectedTeacher(event.target.value);
  };

  const handleClassroomChange = (event) => {
    setSelectedClassroom(event.target.value);
  };

  const handleAllocateClassroom = () => {
    if (selectedTeacher && selectedClassroom) {
      const allocatedClassroom = {
        teacherId: parseInt(selectedTeacher, 10),
        classroomId: parseInt(selectedClassroom, 10),
      };
      setAllocatedClassrooms([...allocatedClassrooms, allocatedClassroom]);
      setSelectedClassroom("");
    }
  };

   
  const handleDeallocate = (indexToRemove) => {
    const updatedAllocatedClassrooms = [...allocatedClassrooms];
    updatedAllocatedClassrooms.splice(indexToRemove, 1);
    setAllocatedClassrooms(updatedAllocatedClassrooms);
  }; 

  const handleDelete = (allocateclassroomId) => {
    axios
      .delete(API_BASE_URL + "/AllocateClassrooms/" + allocateclassroomId)
      .then(() => {
        fetchAllocatedClassrooms();
      })
      .catch((error) => {
        console.error("Error deleting allocate classroom:", error);
      });
  };

  const handleSaveAllocation = () => {
    if (allocatedClassrooms.length === 0) {
      console.log("No classrooms allocated to save.");
      return;
    }
  
    const requestDataArray = allocatedClassrooms.map((allocatedClassroom) => ({
        teacherId: allocatedClassroom.teacherId,
        classroomId: allocatedClassroom.classroomId,
    }));
  
    const promises = requestDataArray.map((requestData) =>
    axios.post(API_BASE_URL + "/AllocateClassrooms", requestData)
  );

    Promise.all(promises)
      .then(() => {
        setAllocatedClassrooms([]);
        fetchAllocatedClassrooms();
        setSelectedTeacher("");
      })
      .catch((error) => {
        if (error.response) {
          console.error("Server responded with an error:", error.response.data);
        } else if (error.request) {
          console.error("No response received from the server");
        } else {
          console.error("Error setting up the request:", error.message);
        }
      });
  };
  
  

  return (
    <div className="Container">
        <div className="form-container">
      <section class="registration-container">
      <h1>Allocate Classrooms</h1>
      <section class="details-section">
      <div class="registration-form">
      <section class="personal-details">
          <div class="three-details-item">
        <label>
        <span className="input-label"> Teacher </span>
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
        <span className="input-label"> Classroom </span>
          <select value={selectedClassroom} onChange={handleClassroomChange}>
            <option value="">Select a classroom</option>
            {classrooms.map((classroom) => (
              <option key={classroom.classroomId} value={classroom.classroomId}>
                {classroom.classroomName}
              </option>
            ))}
          </select>
          </label>
      </div>
      <span className="submit-btn " onClick={handleAllocateClassroom}>Allocate Classroom</span>
      </section>
      </div>
      </section>
      </section>
      </div>
        <div className="List">
          <h2>Allocated Classrooms</h2>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Teacher</th>
                <th>Classroom</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allocatedClassrooms.map((allocatedClassroom, index) => {
                const teacher = teachers.find(
                  (teacher) => teacher.teacherId === allocatedClassroom.teacherId
                );
                const classroom = classrooms.find(
                  (classroom) => classroom.classroomId === allocatedClassroom.classroomId
                );
                return (
                  <tr key={index}>
                    <td>{index +1}</td>
                    <td>
                      {teacher ? `${teacher.firstName} ${teacher.lastName}` : "Teacher not found"}
                    </td>
                    <td>
                      {classroom ? classroom.classroomName : "Classroom not found"}
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
          <h2>Allocated Classroom Details</h2>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Teacher</th>
                <th>Classroom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocatedClassroomDetails.map((allocatedClassroomDetail, index) => {
                const teacher = teachers.find(
                  (teacher) => teacher.teacherId === allocatedClassroomDetail.teacherId
                );
                const classroom = classrooms.find(
                  (classroom) => classroom.classroomId === allocatedClassroomDetail.classroomId
                );
                return (
                  <tr key={allocatedClassroomDetail.allocateClassroomId}>
                    <td>{index +1}</td>
                    <td>
                      {teacher ? `${teacher.firstName} ${teacher.lastName}` : "Teacher not found"}
                    </td>
                    <td>
                      {classroom ? classroom.classroomName : "Classroom not found"}
                    </td>
                    <td>
                  {/* <span className="AllocatedClassroomsListEdit" onClick={() => handleDeallocate(index)}>
                      Edit
                    </span> */}
                    <span className="ListDelete" onClick={() => handleDelete(allocatedClassroomDetail.allocateClassroomId)}>
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

export default AllocateClassrooms;
