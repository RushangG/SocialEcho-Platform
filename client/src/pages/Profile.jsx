import { useSelector } from "react-redux";

import UserProfile from "../components/profile/UserProfile";
const Profile = () => {
  const userData = useSelector((state) => state.auth?.userData);

  return (
    <div className="user-page-shell">
      <div className="user-page-head">
        <p className="user-page-kicker">Account</p>
        <h1 className="user-page-title">Your Profile</h1>
        <p className="user-page-subtitle">Manage your public info, interests, devices, and activity summary.</p>
      </div>
      <UserProfile userData={userData} />
    </div>
  );
};

export default Profile;
