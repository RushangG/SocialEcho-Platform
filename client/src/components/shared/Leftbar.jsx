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
      className={`${showLeftbar ? "" : "hidden md:block"} leftbar`}
      aria-label="Primary navigation"
    >
      <div className="flex h-full flex-col justify-start">
        <div className="flex w-full flex-col gap-3 overflow-y-auto px-3 pb-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar}
                alt={user?.name || "User"}
                className="avatar-md"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Welcome back
                </p>
                <p className="truncate text-sm font-bold text-slate-800">
                  {user?.name || "User"}
                </p>
              </div>
            </div>
            <hr className="my-3 border-slate-200" />
            <Link className="text-xs font-semibold text-primary hover:underline" to="/profile">
              View profile
            </Link>
          </div>

          <div className="sidebar-section-label">
            Navigation
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            <NavLink
              className={({ isActive }) =>
                `leftbar-nav-item ${isActive ? "active" : ""}`
              }
              to="/home"
            >
              <HiOutlineHome className="leftbar-nav-icon" />
              <span>Home</span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `leftbar-nav-item ${isActive ? "active" : ""}`
              }
              to="/profile"
            >
              <HiOutlineUserCircle className="leftbar-nav-icon" />
              <span>Profile</span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `leftbar-nav-item ${isActive ? "active" : ""}`
              }
              to="/saved"
            >
              <HiOutlineTag className="leftbar-nav-icon" />
              <span>Saved</span>
            </NavLink>

            {user && user.role === "general" && (
              <NavLink
                className={({ isActive }) =>
                  `leftbar-nav-item ${isActive ? "active" : ""}`
                }
                to="/following"
              >
                <HiOutlineRectangleStack className="leftbar-nav-icon" />
                <span>Following</span>
              </NavLink>
            )}
          </nav>

          <hr className="my-2 w-full border-slate-200" />

          <div className="sidebar-section-label">
            Communities
          </div>

          {communityLinks && communityLinks.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-3 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <div className="flex items-center gap-1">
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
              <ul className="w-full space-y-1">
                {communityLinks.map((communityLink, index) => (
                  <li key={communityLink.href}>
                    <Link
                      className="leftbar-community-item"
                      to={communityLink.href}
                    >
                      <span className={`leftbar-community-dot leftbar-community-dot-${index % 5}`} />
                      <span className="line-clamp-1">{communityLink.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
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
