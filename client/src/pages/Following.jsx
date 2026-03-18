import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFollowingUsersAction } from "../redux/actions/userActions";
import PublicProfileCard from "../components/profile/PublicProfileCard";
import CommonLoading from "../components/loader/CommonLoading";
import noFollow from "../assets/nofollow.jpg";

const Following = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const followingUsers = useSelector((state) => state.user?.followingUsers);
  const totalFollowing = followingUsers?.length || 0;

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      setLoading(true);
      await dispatch(getFollowingUsersAction());
      setLoading(false);
    };

    fetchFollowingUsers();
  }, [dispatch]);

  return (
    <div className="following-page-wrap flex flex-col gap-4">
      <div className="following-page-head rounded-2xl border border-slate-200 bg-white px-4 py-1 shadow-sm md:px-5 md:py-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-[#0b1f4d] md:text-xl">
              Following Feed
            </p>
            <p className="mt-0.5 text-sm font-medium text-[#1e3a8a] md:text-sm">
              Stay close to creators and friends you care about.
            </p>
          </div>
          <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 md:text-sm">
            {totalFollowing} Following
          </div>
        </div>
      </div>

      {loading ? (
        <div className="following-loading-box flex min-h-[40vh] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <CommonLoading />
        </div>
      ) : followingUsers?.length > 0 ? (
        <div className="following-grid grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {followingUsers.map((user) => (
            <PublicProfileCard key={user._id} user={user} />
          ))}
        </div>
      ) : (
        <div className="following-empty-box flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center md:py-10">
          <p className="py-3 text-sm font-medium text-slate-600 md:text-base">
            You are not following anyone yet.
          </p>
          <p className="mb-4 max-w-md text-xs text-slate-500 md:text-sm">
            Follow people to personalize your feed and see their latest posts here.
          </p>
          <img
            src={noFollow}
            alt="No following users"
            className="w-full max-w-md rounded-xl border border-slate-200 shadow-sm"
          />
        </div>
      )}
    </div>
  );
};

export default Following;
