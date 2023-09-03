import "./home.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../components/apiconfig";

export default function Home() {
  const [classroomCount, setClassroomCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(API_BASE_URL + "/Classrooms")
      .then((response) => {
        setClassroomCount(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching classrooms:", error);
      });

    axios
      .get(API_BASE_URL + "/Subjects")
      .then((response) => {
        setSubjectCount(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });

    axios
      .get(API_BASE_URL + "/Teachers")
      .then((response) => {
        setTeacherCount(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });

    axios
      .get(API_BASE_URL + "/Students")
      .then((response) => {
        setStudentCount(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });

  };

  return (
    <div className="dashboardContainer">
      <div className="topCard">
        <h2>Dashboard</h2>
      </div>
      <div className="dashboardStats">
        <div className="statCard statCardClassrooms">
          <div className="statDetails">
            <h2>No of Classrooms</h2>
            <h3>{classroomCount}</h3>
          </div>
        </div>
        <div className="statCard statCardSubjects">
          <div className="statDetails">
            <h2>No of Subjects</h2>
            <h3>{subjectCount}</h3>
          </div>
        </div>
        <div className="statCard statCardTeachers">
          <div className="statDetails">
            <h2>No of Teachers</h2>
            <h3>{teacherCount}</h3>
          </div>
        </div>
        <div className="statCard statCardStudents">
          <div className="statDetails">
            <h2>No of Students</h2>
            <h3>{studentCount}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

