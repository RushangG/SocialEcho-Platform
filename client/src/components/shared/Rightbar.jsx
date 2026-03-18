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
        <section className="widget-card mb-3">
          <div className="widget-header">
            <h5 className="widget-title">Communities to Join</h5>
            <Link className="widget-link" to="/communities">View all</Link>
          </div>
          <div className="widget-body">

          {notJoinedCommunitiesFetched && visibleCommunities.length === 0 && (
            <div className="text-center text-xs italic text-slate-400">
              No communities to join. Check back later
            </div>
          )}
          <ul className="flex flex-col gap-3">
            {visibleCommunities?.map((community) => (
              <li
                key={community._id}
                className="sidebar-row justify-between"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <img
                    src={community.banner || placeholder}
                    className="community-avatar-sm"
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
                  className="btn-follow"
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
          </div>
        </section>
      )}

      <section className="widget-card">
        <div className="widget-header">
          <h5 className="widget-title">People You May Know</h5>
        </div>
      <div className="widget-body">

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
              className="sidebar-row justify-between"
            >
              <div className="flex min-w-0 items-center gap-2">
                <img
                  className="avatar-sm"
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
                className="btn-follow"
              >
                {followLoading[user._id] ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="loader"></span>
                  </div>
                ) : (
                  <p className="flex items-center gap-1">
                    <BsPersonPlusFill className="inline-block" />
                    Follow
                  </p>
                )}
              </button>
            </li>
          ))}
      </ul>
      </div>
      </section>
    </aside>
  );
};

export default Rightbar;
