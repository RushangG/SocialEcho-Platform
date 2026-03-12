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
    <div className="user-page-shell">
      <div className="user-page-head">
        <p className="user-page-kicker">Library</p>
        <h1 className="user-page-title">Saved Posts</h1>
        <p className="user-page-subtitle max-w-2xl">Revisit posts you bookmarked for later.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm md:p-5">

        {savedPosts && savedPosts.length > 0 ? (
          <div className="flex flex-col items-center gap-3 py-2">
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
    </div>
  );
};

export default Saved;
