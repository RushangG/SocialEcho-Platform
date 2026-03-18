import { getSavedPostsAction } from "../redux/actions/postActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import SavedPost from "../components/post/SavedPost";
import NoSavedPost from "../assets/nopost.jpg";

const Saved = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSavedPostsAction());
  }, [dispatch]);

  const savedPosts = useSelector((state) => state.posts?.savedPosts);

  return (
    <div className="flex flex-col gap-4">
      <div className="user-page-head">
        <p className="user-page-title">Saved Posts</p>
        <p className="user-page-subtitle">Revisit posts you bookmarked for later.</p>
      </div>
      {savedPosts && savedPosts.length > 0 ? (
        <div className="flex flex-col gap-3">
          {savedPosts.reverse().map((post) => (
            <SavedPost key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 py-8 text-center">
          <p className="py-4 text-sm font-medium text-slate-500 md:text-base">
            You haven't saved any post yet.
          </p>
          <img loading="lazy" src={NoSavedPost} alt="no post" className="rounded-xl border border-slate-200 shadow-sm" />
        </div>
      )}
    </div>
  );
};

export default Saved;
