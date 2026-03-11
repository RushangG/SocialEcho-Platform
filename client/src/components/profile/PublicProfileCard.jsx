import { memo } from "react";
import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
const PublicProfileCard = ({ user }) => {
  const followingSince = new Date(user.followingSince).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      to={`/user/${user._id}`}
      className="w-full cursor-pointer rounded-2xl border border-slate-200 bg-white/95 px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex gap-3">
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-12 h-12 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <h2 className="text-base font-bold text-slate-900">{user.name}</h2>
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <CiLocationOn className="text-lg" />
            {user.location || "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Following Since</p>
        <p className="text-sm font-medium text-slate-700">{followingSince}</p>
      </div>
    </Link>
  );
};

export default memo(PublicProfileCard);
