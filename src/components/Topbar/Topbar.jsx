import React from "react";
import "./topbar.css";
import logo from "../../assets/images/logo.png";
import LogoutIcon from '@mui/icons-material/Logout';

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <div>
          <span className="logo"><img src={logo} alt=""></img></span>
            </div>
        </div>
        <div className="topLeft">
          <div>
          <h2 className="logo">J/Methodist Girls' High School</h2>
            </div>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <LogoutIcon />
          </div>
          <div className="topbarIconContainer">
          <h5>Logout</h5>
          </div>
          </div>
      </div>
    </div>
  );
}
