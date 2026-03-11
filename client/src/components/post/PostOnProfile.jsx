import { useNavigate, useLocation } from "react-router";
import { useMemo } from "react";

const PostOnProfile = ({ post }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { content, fileUrl, community, createdAt, comments, likes, isMember } =
    post;

  const isImageFile = useMemo(() => {
    const validExtensions = [".jpg", ".png", ".jpeg", ".gif", ".webp", ".svg"];
    const fileExtension = fileUrl?.slice(fileUrl.lastIndexOf("."));
    return validExtensions.includes(fileExtension);
  }, [fileUrl]);

  return (
    <div
      className={`my-2 cursor-pointer rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm transition-all duration-300 ${
        isMember ? "hover:shadow-md" : "opacity-50 pointer-events-none"
      }`}
      onClick={() => {
        if (isMember) {
          navigate(`/my/post/${post._id}`, {
            state: { from: location.pathname },
          });
        }
      }}
    >
      <div className="flex items-center">
        <p className="text-sm text-slate-500">
          Posted in {community.name} on {createdAt}
        </p>
      </div>
      <div className="my-3">
        {content && <p className="mb-4 text-slate-800">{content}</p>}
        {fileUrl && isImageFile ? (
          <div className="w-full aspect-w-1 aspect-h-1">
            <img
              className="h-full w-full cursor-pointer rounded-xl object-cover ring-1 ring-slate-200"
              src={fileUrl}
              alt={content}
              loading="lazy"
            />
          </div>
        ) : (
          fileUrl && (
            <div className="w-full aspect-w-16 aspect-h-9">
              <video
                className="h-full w-full cursor-pointer rounded-xl object-cover ring-1 ring-slate-200"
                src={fileUrl}
                controls
              />
            </div>
          )
        )}
        <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500">
              {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
            </span>
            <span className="text-sm text-slate-500">
              {likes.length} {likes.length === 1 ? "Like" : "Likes"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostOnProfile;
