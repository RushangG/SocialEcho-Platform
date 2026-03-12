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

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      setLoading(true);
      await dispatch(getFollowingUsersAction());
      setLoading(false);
    };

    fetchFollowingUsers();
  }, [dispatch]);

  return (
    <div className="user-page-shell">
      <div className="user-page-head">
        <p className="user-page-kicker">Connections</p>
        <h1 className="user-page-title">People You Follow</h1>
        <p className="user-page-subtitle max-w-2xl">Stay close to creators and friends you care about.</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <CommonLoading />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm md:p-5">
          {followingUsers?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {followingUsers.map((user) => (
                <PublicProfileCard key={user._id} user={user} />
              ))}
            </div>
          ) : (
           <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 py-8 text-center">
            <p className="py-4 text-sm font-medium text-slate-500 md:text-base">
             You are not following anyone yet.
            </p>
              <img src={noFollow} alt="no post" className="max-w-md rounded-xl border border-slate-200 shadow-sm" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Following;
