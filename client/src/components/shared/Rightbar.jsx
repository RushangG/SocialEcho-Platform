import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotJoinedCommunitiesAction } from "../../redux/actions/communityActions";
import {
  getPublicUsersAction,
  followUserAndFetchData,
} from "../../redux/actions/userActions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import JoinModal from "../modals/JoinModal";
import { BsPersonPlusFill } from "react-icons/bs";
import { IoIosPeople, IoMdPeople } from "react-icons/io";
import placeholder from "../../assets/placeholder.png";

const Rightbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [joinModalVisibility, setJoinModalVisibility] = useState({});
  const [notJoinedCommunitiesFetched, setNotJoinedCommunitiesFetched] =
    useState(false);
  const [publicUsersFetched, setPublicUsersFetched] = useState(false);

  const currentUser = useSelector((state) => state.auth?.userData);

  const recommendedUsers = useSelector((state) => state.user?.publicUsers);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getNotJoinedCommunitiesAction());
      setNotJoinedCommunitiesFetched(true);
      await dispatch(getPublicUsersAction());
    };

    fetchData().then(() => {
      setPublicUsersFetched(true);
    });
  }, [dispatch]);

  const notJoinedCommunities = useSelector(
    (state) => state.community?.notJoinedCommunities
  );

  const visibleCommunities = useMemo(
    () => (notJoinedCommunities || []).slice(0, 4),
    [notJoinedCommunities]
  );

  const [followLoading, setFollowLoadingState] = useState({});

  const followUserHandler = useCallback(
    async (toFollowId) => {
      setFollowLoadingState((prevState) => ({
        ...prevState,
        [toFollowId]: true,
      }));

      await dispatch(followUserAndFetchData(toFollowId, currentUser));

      setFollowLoadingState((prevState) => ({
        ...prevState,
        [toFollowId]: false,
      }));

      navigate(`/user/${toFollowId}`);
    },
    [dispatch, currentUser, navigate]
  );

  const toggleJoinModal = useCallback((communityId, visible) => {
    setJoinModalVisibility((prev) => ({
      ...prev,
      [communityId]: visible,
    }));
  }, []);

  const currentLocation = useLocation().pathname;

  return (
    <aside className="rightbar overflow-auto" aria-label="Suggestions">
      {currentLocation !== "/communities" && (
        <section className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <div className="widget-header">
            <h5 className="widget-title">Suggested communities</h5>
            <Link className="widget-link" to="/communities">View all</Link>
          </div>

          {notJoinedCommunitiesFetched && visibleCommunities.length === 0 && (
            <div className="text-center text-xs italic text-slate-400">
              No communities to join. Check back later
            </div>
          )}
          <ul className="flex flex-col gap-3">
            {visibleCommunities?.map((community) => (
              <li
                key={community._id}
                className="rightbar-community-row"
              >
                <div className="rightbar-community-main">
                  <img
                    src={community.banner || placeholder}
                    className="rightbar-community-img"
                    alt="community"
                  />
                  <div className="flex flex-col min-w-0">
                    <p className="rightbar-community-name">{community.name}</p>
                    <div className="rightbar-community-members">
                      <IoMdPeople style={{ fontSize: 10, flexShrink: 0 }} />
                      <span>{community.members.length}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleJoinModal(community._id, true)}
                  className="rightbar-join-btn"
                >
                  <p className="flex items-center gap-1">
                    <IoIosPeople className="inline-block text-lg" />
                    Join
                  </p>
                </button>
                <JoinModal
                  show={joinModalVisibility[community._id] || false}
                  onClose={() => toggleJoinModal(community._id, false)}
                  community={community}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <hr className="my-4 border-slate-200" />
      <section className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
        <div className="widget-header">
          <h5 className="widget-title">Popular users to follow</h5>
        </div>

      {publicUsersFetched && recommendedUsers?.length === 0 && (
        <div className="text-center text-xs italic text-slate-400">
          No users to follow. Check back later
        </div>
      )}
      <ul className="flex flex-col gap-3">
        {recommendedUsers?.length > 0 &&
          recommendedUsers.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/95 px-3 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <img
                  className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                  src={user.avatar}
                  alt={user.name}
                />
                <div className="min-w-0">
                  <Link
                    to={`/user/${user._id}`}
                    className="line-clamp-1 text-sm font-medium text-slate-800"
                  >
                    {user.name}
                  </Link>
                  <div className="rightbar-user-followers">
                    <BsPersonPlusFill style={{ fontSize: 9, flexShrink: 0 }} />
                    <span>Followers: {user.followerCount}</span>
                  </div>
                </div>
              </div>
              <button
                disabled={followLoading[user._id]}
                onClick={() => followUserHandler(user._id)}
                className="group rounded-xl border border-dashed border-primary px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {followLoading[user._id] ? (
                  <div className="flex items-center justify-center gap-2 group-hover:text-white">
                    <span className="loader"></span>
                  </div>
                ) : (
                  <p className="flex items-center gap-1 group-hover:text-white">
                    <BsPersonPlusFill className="inline-block" />
                    Follow
                  </p>
                )}
              </button>
            </li>
          ))}
      </ul>
      </section>
    </aside>
  );
};

export default Rightbar;
