import { useSelector } from "react-redux";

import MainSection from "../components/home/MainSection";
const Home = () => {
  const userData = useSelector((state) => state.auth?.userData);

  return (
    <div className="user-page-shell">
      <div className="user-page-head">
        <p className="user-page-kicker">Dashboard</p>
        <h1 className="user-page-title">Welcome back, {userData?.name?.split(" ")[0] || "User"}</h1>
        <p className="user-page-subtitle">Catch up with posts from your joined communities and keep the conversation going.</p>
      </div>
      <MainSection userData={userData} />
    </div>
  );
};

export default Home;
