import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../components/apiconfig";
import "./StudentReport.css";

function StudentReport() {
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [teacherSubjects, setTeacherSubjects] = useState([]);

  useEffect(() => {
    axios
      .get(API_BASE_URL + "/Students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });

    axios
      .get(API_BASE_URL + "/Classrooms")
      .then((response) => {
        setClassrooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching classroom data:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      axios
        .get(API_BASE_URL + `/AllocateClassrooms?classroomId=${selectedStudent.classroomId}`)
        .then((response) => {
          const classroomData = response.data;
          const matchingTeachers = classroomData.filter(
            (item) => item.classroomId === selectedStudent.classroomId
          );
  
          const teacherIds = matchingTeachers.map((item) => item.teacherId);
  
          axios
            .get(API_BASE_URL + `/Teachers?teacherIds=${teacherIds.join(",")}`)
            .then((teacherResponse) => {
              const teachers = teacherResponse.data;
  
              axios
                .get(API_BASE_URL + "/AllocateSubjects")
                .then((subjectResponse) => {
                  const subjectData = subjectResponse.data;
  
                  const teacherSubjectsData = teacherIds.map((teacherId) => {
                    const subjects = subjectData.filter(
                      (subject) => subject.teacherId === teacherId
                    );
                    const teacher = teachers.find(
                      (teacher) => teacher.teacherId === teacherId
                    );
  
                    const subjectPromises = subjects.map((subject) => {
                      return axios
                        .get(API_BASE_URL + `/Subjects?subjectId=${subject.subjectId}`)
                        .then((subjectResponse) => {
                          const subjectData = subjectResponse.data;

                          if (Array.isArray(subjectData)) {
                            const matchingSubject = subjectData.find((s) => s.subjectId === subject.subjectId);

                            if (matchingSubject) {
                              return matchingSubject.subjectName;
                            } else {
                              console.error("Subject with subjectId not found:", subject.subjectId);
                              return "";
                            }
                          } else if (subjectData && subjectData.hasOwnProperty('subjectName')) {
                            return subjectData.subjectName;
                          } else {
                            console.error("Invalid subject data or missing subjectName:", subjectData);
                            return "";
                          }
                        })
                        .catch((error) => {
                          console.error("Error fetching subject data:", error);
                          return "";
                        });
                    });

                    return Promise.all(subjectPromises).then((subjectNames) => ({
                      teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : "",
                      subjectName: subjectNames,
                    }));
                  });
  
                  Promise.all(teacherSubjectsData)
                    .then((teacherSubjects) => {
                      setTeacherSubjects(teacherSubjects);
                    })
                    .catch((error) => {
                      console.error("Error resolving teacherSubjectsData promises:", error);
                    });
                })
                .catch((error) => {
                  console.error("Error fetching subject data:", error);
                });
            })
            .catch((error) => {
              console.error("Error fetching teacher data:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching classroom data:", error);
        });
    }
  }, [selectedStudent]);  
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="StudentreportContainer">
      <div className="form-container">
        <section className="registration-container">
          <h1>Student Details</h1>
          <section className="details-section">
            <form className="registration-form">
            <div className="two-column-grid">
                <div className="column">
                  <label>
                    <span className="input-label">Select Student</span>
                    <select
                      id="studentSelect"
                      onChange={(event) => {
                        const selectedStudentId = parseInt(
                          event.target.value,
                          10
                        );
                        const student = students.find(
                          (s) => s.studentId === selectedStudentId
                        );
                        setSelectedStudent(student);
                      }}
                    >
                      <option value="">Select Student</option>
                      {students.map((student) => (
                        <option
                          key={student.studentId}
                          value={student.studentId}
                        >
                          {student.firstName} {student.lastName}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="column">
                  <label>
                    <span className="input-label">Classroom</span>
                    <input
                      type="text"
                      value={
                        selectedStudent
                          ? classrooms.find(
                              (c) =>
                                c.classroomId === selectedStudent.classroomId
                            )?.classroomName
                          : ""
                      }
                      readOnly
                    />
                  </label>
                </div>
              </div>
              <div className="two-column-grid">
                <div className="column">
                  <label>
                    <span className="input-label">Contact Person</span>
                    <input
                      type="text"
                      value={selectedStudent ? selectedStudent.contactPerson : ""}
                      readOnly
                    />
                  </label>
                </div>
                <div className="column">
                  <label>
                    <span className="input-label">Email Address</span>
                    <input
                      type="email"
                      value={selectedStudent ? selectedStudent.emailAddress : ""}
                      readOnly
                    />
                  </label>
                </div>
              </div>
              <div className="two-column-grid">
                <div className="column">
                  <label>
                    <span className="input-label">Contact No</span>
                    <input
                      type="text"
                      value={selectedStudent ? selectedStudent.contactNo : ""}
                      readOnly
                    />
                  </label>
                </div>
                <div className="column">
                  <label>
                    <span className="input-label">Date of Birth</span>
                    <input
                      type="text"
                      value={
                        selectedStudent
                          ? formatDate(selectedStudent.dateOfBirth)
                          : ""
                      }
                      readOnly
                    />
                  </label>
                </div>
              </div>
            </form>
          </section>
        </section>
      </div>
      <div className="StudentReportList">
          <h2>Teacher & Subject Details</h2>
          {teacherSubjects.length === 0 ? (
            <h3>No Data</h3>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Teacher</th>
                </tr>
              </thead>
              <tbody>
                {teacherSubjects.map((item, index) => (
                  <tr key={index}>
                    <td>{item.subjectName}</td>
                    <td>{item.teacherName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
    </div>
  );
}

export default StudentReport;
