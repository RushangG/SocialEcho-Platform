import { useState } from "react";
import JoinModal from "../modals/JoinModal";
import placeholder from "../../assets/placeholder.png";
import { MdOutlineGroupAdd } from "react-icons/md";
const CommunityCard = ({ community }) => {
  const [joinModalVisibility, setJoinModalVisibility] = useState({});

  const toggleJoinModal = (communityId, visible) => {
    setJoinModalVisibility((prev) => ({
      ...prev,
      [communityId]: visible,
    }));
  };
  return (
    <div className="community-card flex h-full flex-col">
      <img
        className="community-card-banner"
        src={community.banner || placeholder}
        alt="community banner"
        loading="lazy"
      />

      <div className="community-card-body flex flex-1 flex-col">
        <div className="flex min-w-0 items-start gap-3">
        <img
          className="community-avatar-md"
          src={community.banner || placeholder}
          alt="community banner"
          loading="lazy"
        />
        <div className="min-w-0">
          <h4 className="community-card-name line-clamp-2 break-words">
            {community.name}
          </h4>
          <p className="community-card-desc mb-0">
            {community.members?.length || 0} members
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => toggleJoinModal(community._id, true)}
          className="btn-follow"
        >
          <MdOutlineGroupAdd className="text-lg" />
          <span>Join</span>
        </button>
      </div>
      </div>

      <JoinModal
        show={joinModalVisibility[community._id] || false}
        onClose={() => toggleJoinModal(community._id, false)}
        community={community}
      />
    </div>
  );
};

export default CommunityCard;
