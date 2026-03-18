import { memo, useMemo, useEffect, useState, useCallback } from "react";
import {
  getPostsAction,
  clearPostsAction,
} from "../../redux/actions/postActions";
import { useSelector, useDispatch } from "react-redux";
import Post from "../post/Post";
import CommonLoading from "../loader/CommonLoading";
import Home from "../../assets/home.jpg";

const MemoizedPost = memo(Post);

const LoadMoreButton = ({ onClick, isLoading }) => (
  <button
    className="load-more-btn"
    onClick={onClick}
    disabled={isLoading}
  >
    {isLoading ? (
      <>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
          <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3"/>
        </svg>
        Loading posts...
      </>
    ) : (
      <>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3v10M4 9l4 4 4-4"/>
        </svg>
        Load more posts
      </>
    )}
  </button>
);

const MainSection = ({ userData }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const posts = useSelector((state) => state.posts?.posts);
  const totalPosts = useSelector((state) => state.posts?.totalPosts);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

  const LIMIT = 10;

  useEffect(() => {
    if (userData) {
      dispatch(getPostsAction(LIMIT, 0)).finally(() => {
        setIsLoading(false);
      });
    }

    return () => {
      dispatch(clearPostsAction());
    };
  }, [userData, dispatch, LIMIT]);

  const handleLoadMore = useCallback(() => {
    setIsLoadMoreLoading(true);
    dispatch(getPostsAction(LIMIT, posts.length)).finally(() => {
      setIsLoadMoreLoading(false);
    });
  }, [dispatch, LIMIT, posts.length]);

  const memoizedPosts = useMemo(() => {
    return posts.map((post) => <MemoizedPost key={post._id} post={post} />);
  }, [posts]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoading />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="welcome-banner">
        <p className="welcome-kicker">Dashboard</p>
        <h1 className="welcome-title">
          Welcome back, {userData?.name?.split(" ")[0] || "User"} 👋
        </h1>
        <p className="welcome-subtitle">
          Catch up with posts from your joined communities and keep the conversation going.
        </p>
        <div className="welcome-stats">
          <div className="welcome-stat">
            <div className="welcome-stat-val">{posts.length}</div>
            <div className="welcome-stat-label">Posts</div>
          </div>
          <div className="welcome-stat">
            <div className="welcome-stat-val">{totalPosts}</div>
            <div className="welcome-stat-label">Total</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">{memoizedPosts}</div>

      {posts.length > 0 && posts.length < totalPosts && (
        <LoadMoreButton
          onClick={handleLoadMore}
          isLoading={isLoadMoreLoading}
        />
      )}

      {posts.length === 0 && (
        <div className="feed-empty">
          <div className="feed-empty-icon">💬</div>
          <h3 className="feed-empty-title">Your feed is empty</h3>
          <p className="feed-empty-sub">
            Join a community and start posting — your feed will come alive here.
          </p>
          <img
            loading="lazy"
            src={Home}
            alt="empty feed"
            className="feed-empty-img"
          />
        </div>
      )}
    </div>
  );
};

export default MainSection;
