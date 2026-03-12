import { useState, useEffect } from "react";
import Tab from "../components/admin/Tab";
import Logs from "../components/admin/Logs";
import Settings from "../components/admin/Settings";
import CommunityManagement from "../components/admin/CommunityManagement";
// CreateAdmin component hidden - admin is pre-configured
// import CreateAdmin from "../components/admin/CreateAdmin";
import AddCommunities from "../components/admin/AddCommunities";
import AddRules from "../components/admin/AddRules";
import AddRulesToCommunity from "../components/admin/AddRulesToCommunity";
import ManageModerators from "../components/admin/ManageModerators";
import { useSelector, useDispatch } from "react-redux";
import { logoutAction } from "../redux/actions/adminActions";
import { useNavigate } from "react-router-dom";
const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("logs");
  const adminPanelError = useSelector((state) => state.admin?.adminPanelError);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (adminPanelError === "Unauthorized") {
      dispatch(logoutAction()).then(() => {
        navigate("/admin/signin");
      });
    }
  }, [adminPanelError, dispatch, navigate]);

  return (
    <div className="admin-panel-root">
      <Tab activeTab={activeTab} handleTabClick={handleTabClick} />

      {activeTab === "logs" && <Logs />}
      {activeTab === "settings" && <Settings />}
      {activeTab === "Community Management" && <CommunityManagement />}
      {/* Create Admin component hidden - admin is pre-configured */}
      {/* {activeTab === "Create Admin" && <CreateAdmin />} */}
      {activeTab === "Add Communities" && <AddCommunities />}
      {activeTab === "Add Rules" && <AddRules />}
      {activeTab === "Add Rules to Community" && <AddRulesToCommunity />}
      {activeTab === "Manage Moderators" && <ManageModerators />}
    </div>
  );
};

export default AdminPanel;
