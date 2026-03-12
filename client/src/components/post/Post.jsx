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
    <article className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100"
            src={user.avatar}
            alt="user avatar"
            loading="lazy"
          />
          <div className="flex flex-col">
            {userData._id === user._id ? (
              <Link to="/profile" className="text-base font-semibold capitalize text-slate-900 hover:underline md:text-lg">
                {user.name}
              </Link>
            ) : (
              <Link
                to={`/user/${user._id}`}
                className="text-base font-semibold capitalize text-slate-900 hover:underline md:text-lg"
              >
                {user.name}
              </Link>
            )}
            <Link
              to={`/community/${community.name}`}
              className="text-xs text-slate-500 hover:text-primary"
            >
              {community.name}
            </Link>
          </div>
        </div>
        <p className="text-xs text-slate-500">{createdAt}</p>
      </div>
      <div>
        <p
          onClick={() => {
            navigate(`/post/${post._id}`, {
              state: { from: location.pathname },
            });
          }}
          className="my-4 cursor-pointer break-words text-[15px] leading-relaxed text-slate-800"
        >
          {content}
        </p>
        <div className="mt-4">
          {fileUrl && fileType === "image" ? (
            <PhotoProvider
              overlayRender={() => (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-10 text-white px-3 py-2">
                  <p className="text-xs">{user.name}</p>
                  <p className="text-xs">{community.name}</p>
                  <p className="text-xs">{createdAt}</p>
                </div>
              )}
            >
              <PhotoView src={fileUrl}>
                <div className="w-full aspect-w-1 aspect-h-1">
                  <img
                    src={fileUrl}
                    alt={content}
                    loading="lazy"
                    className="cursor-pointer rounded-xl object-cover ring-1 ring-slate-200"
                  />
                </div>
              </PhotoView>
            </PhotoProvider>
          ) : (
            fileUrl && (
              <div className="w-full aspect-w-16 aspect-h-9">
                <video
                  className="block mx-auto rounded-xl ring-1 ring-slate-200 focus:outline-none"
                  src={fileUrl}
                  controls
                />
              </div>
            )
          )}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-4">
          <Like post={post} />

          <button
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            onClick={() => {
              navigate(`/post/${post._id}`, {
                state: { from: location.pathname },
              });
            }}
          >
            <HiOutlineChatBubbleOvalLeft className="text-xl" />
            <span className="text-sm">{comments.length}</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {userData?._id === post.user._id && (
            <Tooltip text="Delete post">
              <button
                onClick={() => toggleModal(true)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-red-500 transition hover:bg-red-50"
              >
                <HiOutlineArchiveBox className="text-xl" />
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
