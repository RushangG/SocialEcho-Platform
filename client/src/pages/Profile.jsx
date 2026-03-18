import { useSelector } from "react-redux";
import UserProfile from "../components/profile/UserProfile";

const Profile = () => {
  const userData = useSelector((state) => state.auth?.userData);

  return (
    <div className="flex flex-col gap-4">
      <div className="user-page-head">
        <p className="user-page-title">Your Profile</p>
        <p className="user-page-subtitle">Manage your public info, interests, devices, and activity summary.</p>
      </div>
      <UserProfile userData={userData} />
    </div>
  );
};

export default Profile;
