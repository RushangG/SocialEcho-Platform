import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { PhotoProvider, PhotoView } from "react-photo-view";
import {
  HiOutlineChatBubbleOvalLeft,
  HiOutlineArchiveBox,
} from "react-icons/hi2";
import DeleteModal from "../modals/DeleteModal";
import Like from "./Like";
import "react-photo-view/dist/react-photo-view.css";
import Tooltip from "../shared/Tooltip";

const Post = ({ post }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.auth?.userData);

  const { content, fileUrl, fileType, user, community, createdAt, comments } =
    post;

  const [showModal, setShowModal] = useState(false);
  const toggleModal = (value) => {
    setShowModal(value);
  };

  return (
    <article className="post-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <img
            className="post-avatar-ring"
            src={user.avatar}
            alt={user.name}
            loading="lazy"
          />
          <div className="flex flex-col gap-0.5">
            {userData._id === user._id ? (
              <Link to="/profile" className="post-author-name capitalize">
                {user.name}
              </Link>
            ) : (
              <Link to={`/user/${user._id}`} className="post-author-name capitalize">
                {user.name}
              </Link>
            )}
            <Link to={`/community/${community.name}`} className="post-community-badge">
              <svg width="7" height="7" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="6" cy="6" r="4"/>
              </svg>
              {community.name}
            </Link>
          </div>
        </div>
        <span className="post-time">{createdAt}</span>
      </div>

      <p
        className="post-body"
        onClick={() => navigate(`/post/${post._id}`, { state: { from: location.pathname } })}
      >
        {content}
      </p>

      {fileUrl && fileType === "image" && (
        <PhotoProvider
          overlayRender={() => (
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white px-3 py-2">
              <p className="text-xs">{user.name} · {community.name} · {createdAt}</p>
            </div>
          )}
        >
          <PhotoView src={fileUrl}>
            <div className="post-img-wrap">
              <img src={fileUrl} alt={content} loading="lazy" />
            </div>
          </PhotoView>
        </PhotoProvider>
      )}

      {fileUrl && fileType !== "image" && (
        <div className="post-img-wrap">
          <video
            className="w-full rounded-none focus:outline-none"
            src={fileUrl}
            controls
          />
        </div>
      )}

      <div className="post-actions-bar">
        <div className="post-action-group">
          <Like post={post} />

          <button
            className="post-action-btn"
            onClick={() => navigate(`/post/${post._id}`, { state: { from: location.pathname } })}
          >
            <HiOutlineChatBubbleOvalLeft style={{ width: 16, height: 16 }} />
            <span className="post-action-count">{comments.length}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {userData?._id === post.user._id && (
            <Tooltip text="Delete post">
              <button
                onClick={() => toggleModal(true)}
                className="post-delete-btn"
              >
                <HiOutlineArchiveBox style={{ width: 14, height: 14 }} />
                Delete
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {showModal && (
        <DeleteModal
          showModal={showModal}
          postId={post._id}
          onClose={() => toggleModal(false)}
          prevPath={location.pathname}
        />
      )}
    </article>
  );
};

export default Post;
