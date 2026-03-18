import { memo } from "react";
import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";

const PublicProfileCard = ({ user }) => {
  const hasLocation = typeof user?.location === "string" && user.location.trim().length > 0;
  const displayName = typeof user?.name === "string" && user.name.trim() ? user.name.trim() : "User";
  const hasAvatar = typeof user?.avatar === "string" && user.avatar.trim().length > 0;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  const isFollowingSinceValid =
    user?.followingSince && !Number.isNaN(new Date(user.followingSince).getTime());
  const followingSince = isFollowingSinceValid
    ? new Date(user.followingSince).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  return (
    <Link
      to={`/user/${user._id}`}
      className="group block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >
      <div className="relative h-11 bg-gradient-to-r from-slate-900 via-blue-800 to-blue-600">
        <div className="absolute right-3 top-2 inline-flex items-center rounded-full border border-white/40 bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          Following
        </div>
      </div>

      <div className="px-4 pb-4 pt-3.5">
        <div className="mb-3 flex items-start gap-3">
          {hasAvatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="h-14 w-14 rounded-full border-2 border-slate-200 object-cover shadow-sm"
              loading="lazy"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-200 bg-blue-100 text-base font-bold text-blue-700 shadow-sm">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-slate-900 md:text-lg">{displayName}</h2>
            {hasLocation && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                <CiLocationOn className="text-base" />
                <span className="truncate">{user.location.trim()}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Following Since</p>
            <p className="truncate text-sm font-semibold text-slate-800">{followingSince}</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            Active
          </span>
        </div>
      </div>
    </Link>
  );
};

export default memo(PublicProfileCard);
