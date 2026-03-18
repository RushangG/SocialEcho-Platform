import { Link } from "react-router-dom";
import { CiEdit, CiLocationOn } from "react-icons/ci";
import { GrContactInfo } from "react-icons/gr";
import { useState } from "react";
import ProfileUpdateModal from "../modals/ProfileUpdateModal";
import Tooltip from "../shared/Tooltip";

const OwnProfileCard = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="profile-card">
      <div className="profile-card-banner" />
      <div className="profile-card-body">
        <div
          className="flex cursor-pointer justify-end pt-3 text-xl text-slate-600"
          onClick={handleOpenModal}
        >
          <Tooltip text="Edit profile">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 transition hover:bg-slate-100">
              <CiEdit />
            </span>
          </Tooltip>
        </div>

        <div className="profile-card-avatar-wrap flex justify-center">
          <img className="profile-card-avatar h-24 w-24" src={user.avatar} alt="Profile" />
          <ProfileUpdateModal user={user} isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>

        <div className="text-center">
          <h2 className="profile-card-name text-lg">{user.name}</h2>
          {user.bio ? (
            <p className="profile-card-role flex items-center justify-center gap-2 text-sm text-slate-600">
              <GrContactInfo className="text-slate-500" />
              {user.bio}
            </p>
          ) : (
            <p className="profile-card-role flex items-center justify-center gap-2 text-sm text-slate-400">
              <GrContactInfo className="text-slate-500" />
              Bio not added
            </p>
          )}
        </div>

        <div className="my-3 flex flex-col justify-start">
        <p className="font-semibold text-slate-800">Location</p>
        {user.location ? (
          <p className="flex items-center gap-2 text-slate-700">
            <CiLocationOn className="font-semibold" />
            {user.location}
          </p>
        ) : (
          <p className="flex items-center gap-2 text-slate-400">
            <CiLocationOn className="text-lg font-semibold" />
            Location not added
          </p>
        )}
        </div>

        <div className="mt-4 max-h-28 overflow-y-auto rounded-xl bg-slate-50 p-3">
        <h3 className="mb-2 text-lg font-bold text-slate-900">Interests</h3>
        {user.interests ? (
          <div className="flex flex-wrap gap-2">
            {user.interests.split(",").map((interest, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-sm font-medium text-gray-800 ring-1 ring-slate-200 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {interest.trim()}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-600">
            No interests have been set yet. Add some interests to let people
            know more about you.
          </p>
        )}
        </div>

        <div className="profile-stat-row">
          <div className="profile-stat-item">
            <div className="profile-stat-value">{user?.posts?.length || 0}</div>
            <div className="profile-stat-label">Posts</div>
          </div>
          <div className="profile-stat-item">
            <div className="profile-stat-value">{user?.following?.length || 0}</div>
            <div className="profile-stat-label">Following</div>
          </div>
          <div className="profile-stat-item">
            <div className="profile-stat-value">{user?.followers?.length || 0}</div>
            <div className="profile-stat-label">Followers</div>
          </div>
        </div>

        <span className="mt-4 flex flex-col items-center justify-center border-t border-slate-200 pt-2">
          <Link className="btn-primary mt-2" to="/devices-locations">
            Manage Devices and Locations
          </Link>
        </span>
      </div>
    </div>
  );
};

export default OwnProfileCard;
