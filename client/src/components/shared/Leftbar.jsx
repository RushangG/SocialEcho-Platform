import { useMemo, useEffect, memo } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getJoinedCommunitiesAction } from "../../redux/actions/communityActions";
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineRectangleStack,
  HiOutlineTag,
} from "react-icons/hi2";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { GiTeamIdea } from "react-icons/gi";

const Leftbar = ({ showLeftbar }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth?.userData);
  const joinedCommunities = useSelector(
    (state) => state.community?.joinedCommunities
  );

  useEffect(() => {
    dispatch(getJoinedCommunitiesAction());
  }, [dispatch]);

  const visibleCommunities = useMemo(() => {
    return joinedCommunities?.slice(0, 5);
  }, [joinedCommunities]);

  const communityLinks = useMemo(() => {
    return visibleCommunities?.map((community) => ({
      href: `/community/${community.name}`,
      label: community.name,
    }));
  }, [visibleCommunities]);

  return (
    <aside
      className={`${showLeftbar ? "" : "hidden"} leftbar`}
      aria-label="Primary navigation"
    >
      <div className="flex h-full flex-col justify-start">
        <div className="flex w-full flex-col gap-4 overflow-y-auto px-5 pb-5">
          <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Navigation
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2.5 font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-primary ring-1 ring-blue-100 shadow-sm"
                    : "text-slate-700 hover:bg-slate-100 hover:text-primary hover:translate-x-0.5"
                }`
              }
              to="/home"
            >
              <HiOutlineHome className="text-lg" />
              <span>Home</span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2.5 font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-primary ring-1 ring-blue-100 shadow-sm"
                    : "text-slate-700 hover:bg-slate-100 hover:text-primary hover:translate-x-0.5"
                }`
              }
              to="/profile"
            >
              <HiOutlineUserCircle className="text-lg" />
              <span>Profile</span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2.5 font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-primary ring-1 ring-blue-100 shadow-sm"
                    : "text-slate-700 hover:bg-slate-100 hover:text-primary hover:translate-x-0.5"
                }`
              }
              to="/saved"
            >
              <HiOutlineTag className="text-lg" />
              <span>Saved</span>
            </NavLink>

            {user && user.role === "general" && (
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2.5 font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-primary ring-1 ring-blue-100 shadow-sm"
                      : "text-slate-700 hover:bg-slate-100 hover:text-primary hover:translate-x-0.5"
                  }`
                }
                to="/following"
              >
                <HiOutlineRectangleStack className="text-lg" />
                <span>Following</span>
              </NavLink>
            )}
          </nav>

          <hr className="my-3 w-full border-slate-200" />

          <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Communities
          </div>

          {communityLinks && communityLinks.length > 0 ? (
            <div className="w-full rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                  <HiOutlineUserGroup className="text-lg" />
                  <span>Joined</span>
                </div>

                <Link
                  className="relative flex items-center text-xs font-medium text-primary"
                  to="/my-communities"
                >
                  See all
                  <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                    {joinedCommunities.length}
                  </span>
                </Link>
              </div>
              <ul className="mt-2 w-full space-y-1">
                {communityLinks.map((communityLink) => (
                  <li key={communityLink.href}>
                    <Link
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-primary hover:translate-x-0.5"
                      to={communityLink.href}
                    >
                      <span className="line-clamp-1">{communityLink.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-1 text-sm text-slate-400">No communities found.</div>
          )}

          {user && user.role === "general" && (
            <div className="mt-5 md:hidden">
              <hr className="my-3 w-full border-slate-200" />
              <div className="flex items-center justify-center gap-1 text-sm">
                <GiTeamIdea className="text-primary" />
                <Link to="/communities" className="font-medium text-primary">
                  Discover all communities
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default memo(Leftbar);
