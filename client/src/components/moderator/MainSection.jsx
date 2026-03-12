import { useState } from "react";
import ReportedPosts from "../moderator/ReportedPosts";
import MembersList from "../moderator/MembersList";
import BannerMembersList from "../moderator/BannerMembersList";

const MainSection = () => {
  const [activeTab, setActiveTab] = useState("Reported Posts");

  return (
    <div className="flex flex-col p-3">
      <ul className="flex flex-col gap-2 rounded-xl bg-slate-100 p-1 md:flex-row">
        <li
          className={`${
            activeTab === "Reported Posts"
              ? "bg-primary text-white shadow-sm"
              : "text-gray-500 hover:bg-white hover:text-gray-700"
          } flex-1 cursor-pointer rounded-lg p-2 text-center text-sm font-medium transition`}
          onClick={() => setActiveTab("Reported Posts")}
        >
          Reported Posts
        </li>
        <li
          className={`${
            activeTab === "Members"
              ? "bg-primary text-white shadow-sm"
              : "text-gray-500 hover:bg-white hover:text-gray-700"
          } flex-1 cursor-pointer rounded-lg p-2 text-center text-sm font-medium transition`}
          onClick={() => setActiveTab("Members")}
        >
          Members
        </li>

        <li
          className={`${
            activeTab === "Banned Users"
              ? "bg-primary text-white shadow-sm"
              : "text-gray-500 hover:bg-white hover:text-gray-700"
          } flex-1 cursor-pointer rounded-lg p-2 text-center text-sm font-medium transition`}
          onClick={() => setActiveTab("Banned Users")}
        >
          Banned Users
        </li>
      </ul>
      <div className="mt-4 flex flex-col gap-4">
        {activeTab === "Reported Posts" && <ReportedPosts />}
        {activeTab === "Members" && <MembersList />}
        {activeTab === "Banned Users" && <BannerMembersList />}
      </div>
    </div>
  );
};

export default MainSection;
