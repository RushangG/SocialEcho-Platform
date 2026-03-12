import { useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import Like from "./Like";
import { IoIosArrowBack } from "react-icons/io";
const SavedPost = ({ post }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { content, fileUrl, user, community, createdAt, comments } = post;

  const isImageFile = useMemo(() => {
    const validExtensions = [".jpg", ".png", ".jpeg", ".gif", ".webp", ".svg"];
    const fileExtension = fileUrl?.slice(fileUrl.lastIndexOf("."));
    return validExtensions.includes(fileExtension);
  }, [fileUrl]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="mb-4 w-full rounded-2xl border border-slate-200 bg-white/95 px-5 py-5 shadow-sm md:px-6 md:py-6">
      <p className="mb-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-dashed border-primary px-2 py-2 transition hover:bg-blue-50">
        <IoIosArrowBack
          className="text-primary text-xl font-semibold"
          onClick={handleBack}
        />
      </p>
      <div className="flex items-start justify-between">
        <div className="flex gap-2">
          <img
            className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100"
            src={user.avatar}
            alt="user avatar"
            loading="lazy"
          />
          <div className="">
            <p className="text-base font-semibold text-slate-900 md:text-lg">{user.name}</p>
            <p className="text-xs text-slate-500">{community.name}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500">{createdAt}</p>
      </div>
      <div
        className="cursor-pointer"
        onClick={() => {
          navigate(`/post/${post._id}`, {
            state: { from: location.pathname },
          });
        }}
      >
        <p className="mt-4 text-[15px] leading-relaxed text-slate-800">{content}</p>
        <div className="flex justify-center">
          {fileUrl && isImageFile ? (
            <img
              className="mt-4 h-auto w-[800px] rounded-xl ring-1 ring-slate-200"
              src={fileUrl}
              alt={content}
              loading="lazy"
            />
          ) : (
            fileUrl && (
              <video
                className="mt-4 h-auto w-[800px] rounded-xl ring-1 ring-slate-200"
                src={fileUrl}
                controls
              />
            )
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2">
          <Like post={post} />
          <Link to={`/post/${post._id}`}>
            <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xl text-slate-700 transition hover:bg-slate-100">
              {" "}
              <HiOutlineChatBubbleOvalLeft />
              {comments.length}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SavedPost;
