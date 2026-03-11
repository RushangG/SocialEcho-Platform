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
    <div className="flex justify-between rounded-2xl border border-slate-200 bg-white/95 px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="w-full flex items-start">
        <img
          className="mr-4 h-11 w-11 rounded-full object-cover ring-2 ring-slate-100"
          src={community.banner || placeholder}
          alt="community banner"
          loading="lazy"
        />
        <div className="">
          <h4 className="line-clamp-1 text-base font-semibold text-slate-900">{community.name}</h4>
          <p className="text-sm text-slate-600">
            {community.members.length} members
          </p>
        </div>
      </div>

      <div className="">
        <button
          onClick={() => toggleJoinModal(community._id, true)}
          className="group rounded-xl border border-primary bg-primary px-2.5 py-2.5 transition duration-300 hover:bg-transparent"
        >
          <MdOutlineGroupAdd className="text-lg text-white group-hover:text-primary" />
        </button>
        <JoinModal
          show={joinModalVisibility[community._id] || false}
          onClose={() => toggleJoinModal(community._id, false)}
          community={community}
        />
      </div>
    </div>
  );
};

export default CommunityCard;
