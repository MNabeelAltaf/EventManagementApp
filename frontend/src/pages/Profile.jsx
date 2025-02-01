import React from "react";
import EditProfile from "../components/EditProfile";
import "../styling/Profile.css";

const Profile = ({ collapsed }) => {
  return (
    <>
      <div className={`main-container ${collapsed ? "collapsed" : ""}`}>
        <div className="main-content">
          <h1>Profile</h1>
        </div>
      </div>
      <EditProfile />
    </>
  );
};

export default Profile;
