import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Topbar from "./components/Topbar/Topbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./Pages/home/Home";
import ManageStudents from "./Pages/ManageStudents/Managestudents";
import ManageTeachers from "./Pages/ManageTeachers/Manageteachers";
import ManageSubjects from "./Pages/ManageSubjects/Managesubject";
import ManageClassrooms from "./Pages/ManageClassrooms/Manageclassrooms";
import AllocateSubjects from "./Pages/AllocateSubject/Allocatesubject";
import AllocateClassrooms from "./Pages/AllocateClassroom/Allocateclassroom";
import StudentReport from "./Pages/StudentReport/Studentreport";

function App() {
  return (
    <Router>
      <Topbar />
      <div className="container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Managestudents" element={<ManageStudents />} />
          <Route path="/Manageteachers" element={<ManageTeachers />} />
          <Route path="/Managesubjects" element={<ManageSubjects />} />
          <Route path="/Manageclassrooms" element={<ManageClassrooms />} />
          <Route path="/AllocateSubjects" element={<AllocateSubjects />} />
          <Route path="/AllocateClassrooms" element={<AllocateClassrooms />} />
          <Route path="/StudentReport" element={<StudentReport />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
