import ModeratorProfile from "./ModeratorProfile";

const Rightbar = () => {
  return (
    <div className="rightbar p-3">
      <div className="widget-card">
        <div className="widget-header">
          <h3 className="widget-title">Moderator</h3>
        </div>
        <div className="widget-body p-4">
          <ModeratorProfile />
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
