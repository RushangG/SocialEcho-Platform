import { useState } from "react";
import { Link } from "react-router-dom";

const CommentSidebar = ({ comments }) => {
  const currentPage = 1;
  const [commentsPerPage, setCommentsPerPage] = useState(10);

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  const handleLoadMore = () => {
    setCommentsPerPage(commentsPerPage + 10);
  };

  return (
    <aside className="col-span-1 h-auto overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm md:sticky md:top-20 md:h-[85vh]" aria-label="Comments">
      {currentComments.length > 0 && (
        <div>
          <h2 className="mb-4 border-b border-slate-200 py-2 text-center text-sm font-semibold text-slate-800">
            Recent Comments
          </h2>
          {currentComments.map((comment) => (
            <div
              key={comment._id}
              className="flex w-full flex-col border-b border-slate-100 p-3"
            >
              <div className="flex gap-1">
                <img
                  src={comment.user.avatar}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100"
                />

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800 hover:underline">
                    <Link to={`/user/${comment.user._id}`}>
                      {comment.user.name}
                    </Link>
                  </span>
                  <p className="ml-1 text-xs text-slate-500">
                    {comment.createdAt}
                  </p>
                </div>
              </div>
              <p className="mt-2 break-words whitespace-normal text-sm text-slate-700">
                {comment.content}
              </p>
            </div>
          ))}

          {currentComments.length < comments.length && (
            <button
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-slate-50"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          )}
        </div>
      )}

      {currentComments.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center">
          <p className="mb-1 text-sm font-semibold text-slate-800">No comments yet</p>
          <p className="text-xs text-slate-500">Be the first to start the conversation.</p>
        </div>
      )}
    </aside>
  );
};

export default CommentSidebar;
