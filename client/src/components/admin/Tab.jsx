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
    <div className="border-b border-gray-200 sticky top-0 left-0 z-30 bg-white rounded-md">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
        <li className="mr-2 flex items-center">
          <span
            className={`cursor-pointer inline-flex items-center px-2 py-2 border-b-2 rounded-t-lg ${
              activeTab === "logs"
                ? "border-blue-500 bg-primary rounded-md text-white"
                : "border-transparent hover:text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => handleTabClick("logs")}
          >
            <BsWindowStack className="mr-1" />
            Logs
          </span>
        </li>
        <li className="mr-2 flex items-center">
          <span
            className={`cursor-pointer inline-flex items-center px-2 py-2 border-b-2 rounded-t-lg ${
              activeTab === "settings"
                ? "border-blue-500 bg-primary rounded-md text-white"
                : "border-transparent hover:text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => handleTabClick("settings")}
          >
            <IoSettingsOutline className="mr-1" />
            Settings
          </span>
        </li>
        <li className="mr-2 flex items-center">
          <span
            className={`cursor-pointer inline-flex items-center px-2 py-2 border-b-2 rounded-t-lg ${
              activeTab === "Community Management"
                ? "border-blue-500 bg-primary rounded-md text-white"
                : "border-transparent hover:text-gray-600 hover:border-gray-300"
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
        <li className="mr-2 flex items-center">
          <span
            className={`cursor-pointer inline-flex items-center px-2 py-2 border-b-2 rounded-t-lg ${
              activeTab === "Add Communities"
                ? "border-blue-500 bg-primary rounded-md text-white"
                : "border-transparent hover:text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => handleTabClick("Add Communities")}
          >
            <FaUsers className="mr-1" />
            Add Communities
          </span>
        </li>
        <li className="mr-2 flex items-center">
          <span
            className={`cursor-pointer inline-flex items-center px-2 py-2 border-b-2 rounded-t-lg ${
              activeTab === "Add Rules"
                ? "border-blue-500 bg-primary rounded-md text-white"
                : "border-transparent hover:text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => handleTabClick("Add Rules")}
          >
            <FaGavel className="mr-1" />
            Add Rules
          </span>
        </li>
        <li className="mr-2 flex items-center">
          <span
            className={`cursor-pointer inline-flex items-center px-2 py-2 border-b-2 rounded-t-lg ${
              activeTab === "Add Rules to Community"
                ? "border-blue-500 bg-primary rounded-md text-white"
                : "border-transparent hover:text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => handleTabClick("Add Rules to Community")}
          >
            <FaLink className="mr-1" />
            Add Rules to Community
          </span>
        </li>
        <li className="mr-2 flex items-center">
          <span
            className={`cursor-pointer inline-flex items-center px-2 py-2 border-b-2 rounded-t-lg ${
              activeTab === "Manage Moderators"
                ? "border-blue-500 bg-primary rounded-md text-white"
                : "border-transparent hover:text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => handleTabClick("Manage Moderators")}
          >
            <FaUserShield className="mr-1" />
            Manage Moderators
          </span>
        </li>
        <li className="mr-2 flex items-center">
          <span
            className={`cursor-pointer inline-flex items-center px-2 py-2 border-b-2 rounded-t-md ${
              activeTab === "logout"
                ? "border-blue-500 bg-primary rounded-md text-white"
                : "border-transparent hover:text-red-600 hover:border-red-600"
            }`}
            onClick={handleLogout}
          >
            <BiLogOut className="mr-1" />
            <span
              className={`${
                activeTab === "logout"
                  ? "group-hover:text-gray-500"
                  : "group-hover:text-red-600"
              }`}
            >
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
