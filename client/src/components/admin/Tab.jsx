import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/actions/adminActions";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import { BiLogOut } from "react-icons/bi";
import { BsPeople, BsWindowStack } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
// import { FaUserPlus } from "react-icons/fa"; // Hidden - admin is pre-configured
import { FaUsers, FaGavel, FaLink, FaUserShield } from "react-icons/fa";

const Tab = ({ activeTab, handleTabClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await dispatch(logoutAction()).then(() => {
      navigate("/admin/signin");
    });
    setLoggingOut(false);
  };

  return (
    <div className="admin-panel-card admin-tab-wrap">
      <ul className="admin-tab-list">
        <li>
          <span
            className={`admin-tab-item ${
              activeTab === "logs"
                ? "admin-tab-item-active"
                : ""
            }`}
            onClick={() => handleTabClick("logs")}
          >
            <BsWindowStack className="mr-1" />
            Logs
          </span>
        </li>
        <li>
          <span
            className={`admin-tab-item ${
              activeTab === "settings"
                ? "admin-tab-item-active"
                : ""
            }`}
            onClick={() => handleTabClick("settings")}
          >
            <IoSettingsOutline className="mr-1" />
            Settings
          </span>
        </li>
        <li>
          <span
            className={`admin-tab-item ${
              activeTab === "Community Management"
                ? "admin-tab-item-active"
                : ""
            }`}
            onClick={() => handleTabClick("Community Management")}
          >
            <BsPeople className="mr-1" />
            Community Management
          </span>
        </li>
        {/* Create Admin tab hidden - admin is pre-configured */}
        {/* <li className="mr-2 flex items-center">
          <span
            className={`cursor-pointer inline-flex items-center px-2 py-2 border-b-2 rounded-t-lg ${
              activeTab === "Create Admin"
                ? "border-blue-500 bg-primary rounded-md text-white"
                : "border-transparent hover:text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => handleTabClick("Create Admin")}
          >
            <FaUserPlus className="mr-1" />
            Create Admin
          </span>
        </li> */}
        <li>
          <span
            className={`admin-tab-item ${
              activeTab === "Add Communities"
                ? "admin-tab-item-active"
                : ""
            }`}
            onClick={() => handleTabClick("Add Communities")}
          >
            <FaUsers className="mr-1" />
            Add Communities
          </span>
        </li>
        <li>
          <span
            className={`admin-tab-item ${
              activeTab === "Add Rules"
                ? "admin-tab-item-active"
                : ""
            }`}
            onClick={() => handleTabClick("Add Rules")}
          >
            <FaGavel className="mr-1" />
            Add Rules
          </span>
        </li>
        <li>
          <span
            className={`admin-tab-item ${
              activeTab === "Add Rules to Community"
                ? "admin-tab-item-active"
                : ""
            }`}
            onClick={() => handleTabClick("Add Rules to Community")}
          >
            <FaLink className="mr-1" />
            Add Rules to Community
          </span>
        </li>
        <li>
          <span
            className={`admin-tab-item ${
              activeTab === "Manage Moderators"
                ? "admin-tab-item-active"
                : ""
            }`}
            onClick={() => handleTabClick("Manage Moderators")}
          >
            <FaUserShield className="mr-1" />
            Manage Moderators
          </span>
        </li>
        <li>
          <span
            className="admin-tab-item admin-tab-item-logout"
            onClick={handleLogout}
          >
            <BiLogOut className="mr-1" />
            <span>
              {loggingOut ? (
                <ButtonLoadingSpinner loadingText={"Logging out..."} />
              ) : (
                "Logout"
              )}
            </span>
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Tab;
