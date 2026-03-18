import { Link } from "react-router-dom";

const JoinedCommunityCard = ({ community }) => {
  return (
    <Link to={`/community/${community.name}`} className="community-card flex w-full flex-col">
      <img className="community-card-banner" src={community.banner} alt={community.name} loading="lazy" />
      <div className="community-card-body">
        <h3 className="community-card-name">{community.name}</h3>
        <p className="community-card-desc mb-0">{community.members.length} members</p>
      </div>
    </Link>
  );
};

export default JoinedCommunityCard;
