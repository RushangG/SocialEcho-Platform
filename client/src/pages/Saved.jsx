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
        <p className="user-page-subtitle">Revisit posts you bookmarked for later.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 md:p-5">

        {savedPosts && savedPosts.length > 0 ? (
          <div className="flex flex-col items-center gap-3 py-2">
            {savedPosts.reverse().map((post) => (
              <SavedPost key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center flex justify-center items-center flex-col rounded-xl bg-slate-50 py-6">
            <p className="text-slate-500 py-5">
              You haven't saved any post yet.
            </p>
            <img loading="lazy" src={NoSavedPost} alt="no post" className="rounded-xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
