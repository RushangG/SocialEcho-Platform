import { useEffect, useState } from "react";
import { HiOutlineArchiveBox } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getCommunityAction } from "../../redux/actions/communityActions";
import Save from "./Save";
import Like from "./Like";
import CommentForm from "../form/CommentForm";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import DeleteModal from "../modals/DeleteModal";
import { IoIosArrowBack } from "react-icons/io";
import CommonLoading from "../loader/CommonLoading";
import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import ReportPostModal from "../modals/ReportPostModal";
import { VscReport } from "react-icons/vsc";
import Tooltip from "../shared/Tooltip";

const PostView = ({ post, userData }) => {
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    content,
    fileUrl,
    fileType,
    user,
    community,
    dateTime,
    comments,
    savedByCount,
    isReported,
  } = post;

  useEffect(() => {
    dispatch(getCommunityAction(community.name)).then(() => setLoading(false));
  }, [dispatch, community.name, loading]);

  const [showModal, setShowModal] = useState(false);
  const toggleModal = (value) => {
    setShowModal(value);
  };

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportedPost, setIsReportedPost] = useState(isReported);

  const handleReportClick = () => {
    setIsReportModalOpen(true);
  };

  const handleReportClose = () => {
    setIsReportModalOpen(false);
  };

  if (loading) {
    return (
      <div className="main-section flex justify-center items-center">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="main-section">
      <button
        type="button"
        onClick={() => navigate(location.state?.from || "/")}
        className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
        aria-label="Go back"
      >
        <IoIosArrowBack className="text-lg text-primary" />
      </button>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100"
            src={user.avatar}
            alt="user avatar"
            loading="lazy"
          />
          <div className="flex flex-col">
            {userData._id === user._id ? (
              <Link to="/profile" className="text-base font-semibold text-slate-900 hover:underline">
                {user.name}
              </Link>
            ) : (
              <Link to={`/user/${user._id}`} className="text-base font-semibold text-slate-900 hover:underline">
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

        <span className="self-center text-xs text-slate-500">{dateTime}</span>
      </div>

      <div className="mb-4">
        <p className="my-3 text-sm leading-relaxed text-slate-800">{content}</p>
        <div className="flex justify-center">
          {fileUrl && fileType === "image" ? (
            <PhotoProvider
              overlayRender={() => (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-10 text-white px-3 py-2">
                  <p className="text-xs">{user.name}</p>
                  <p className="text-xs">{community.name}</p>
                  <p className="text-xs">{dateTime}</p>
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
                  className="mx-auto block rounded-xl ring-1 ring-slate-200 focus:outline-none"
                  src={fileUrl}
                  controls
                />
              </div>
            )
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Like post={post} />
          <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            <HiOutlineChatBubbleOvalLeft className="text-xl" />
            <span className="text-sm">{comments.length}</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Save postId={post._id} />
          <Tooltip text="Saved by" className="items-center">
            <div className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-600">
              <HiOutlineArchiveBox className="text-lg" />
              <span>{savedByCount}</span>
            </div>
          </Tooltip>
          {isReportedPost ? (
            <Tooltip text="Reported" className="items-center">
              <button disabled className="inline-flex items-center justify-center rounded-lg p-2 text-emerald-600">
                <VscReport className="text-xl" />
              </button>
            </Tooltip>
          ) : (
            <Tooltip text="Report">
              <button
                onClick={handleReportClick}
                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-red-500"
              >
                <VscReport className="text-xl" />
              </button>
            </Tooltip>
          )}
          {userData?._id === post.user._id && (
            <Tooltip text="Delete">
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

      {/* Delete Modal */}
      <DeleteModal
        showModal={showModal}
        postId={post._id}
        onClose={() => toggleModal(false)}
        prevPath={location.state.from || "/"}
      />

      <ReportPostModal
        isOpen={isReportModalOpen}
        onClose={handleReportClose}
        postId={post._id}
        communityId={community._id}
        setReportedPost={setIsReportedPost}
      />

      <div>
        <CommentForm communityId={community._id} postId={post._id} />
      </div>
    </div>
  );
};

export default PostView;
