import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import ArticleIcon from '@mui/icons-material/Article';
import "./sidebar.css"
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <ul className="sidebarList">
            <Link to="/" className="link">
            <li className="sidebarListItem">
              <HomeIcon className="sidebarIcon" />
              Home
            </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <ul className="sidebarList">
          <Link to="/Managestudents" className="link">
            <li className="sidebarListItem">
              <PersonIcon className="sidebarIcon" />
             Manage students
            </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <ul className="sidebarList">
            <Link to="/Manageteachers" className="link">
            <li className="sidebarListItem">
              <PersonIcon className="sidebarIcon" />
              Manage Teachers
            </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <ul className="sidebarList">
            <Link to="/Manageclassrooms" className="link">
            <li className="sidebarListItem">
              <SubjectIcon className="sidebarIcon" />
              Manage Classrooms
            </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <ul className="sidebarList">
            <Link to="/Managesubjects" className="link">
            <li className="sidebarListItem">
              <SubjectIcon className="sidebarIcon" />
              Manage Subjects
            </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <ul className="sidebarList">
            <Link to="/AllocateSubjects" className="link">
            <li className="sidebarListItem">
              <SubjectIcon className="sidebarIcon" />
              Allocate Subjects
            </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <ul className="sidebarList">
            <Link to="/AllocateClassrooms" className="link">
            <li className="sidebarListItem">
              <SubjectIcon className="sidebarIcon" />
              Allocate Classrooms
            </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <ul className="sidebarList">
            <Link to="/StudentReport" className="link">
            <li className="sidebarListItem">
              <ArticleIcon  className="sidebarIcon" />
              Student Report
            </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
