import { useEffect, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserAction } from "../../redux/actions/userActions";
import PostOnProfile from "../post/PostOnProfile";
import OwnProfileCard from "./OwnProfileCard";
import CommonLoading from "../loader/CommonLoading";
import OwnInfoCard from "./OwnInfoCard";
import NoPost from "../../assets/nopost.jpg";

const UserProfile = ({ userData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user?.user);
  const posts = user?.posts;

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      await dispatch(getUserAction(userData._id));
    };
    fetchUser().then(() => setLoading(false));
  }, [dispatch, userData._id]);

  const MemoizedPostOnProfile = memo(PostOnProfile);

  let postToShow;

  postToShow = posts?.map((post) => (
    <MemoizedPostOnProfile key={post._id} post={post} />
  ));

  return (
    <>
      {loading || !user || !posts ? (
        <div className="flex justify-center items-center h-screen">
          <CommonLoading />
        </div>
      ) : (
        <>
          <OwnProfileCard user={user} />
          <OwnInfoCard user={user} />

          <h3 className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-base font-semibold text-gray-700 md:text-lg">
            Your most recent posts
          </h3>

          {postToShow?.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 py-8 text-center text-gray-700">
              <p className="py-4 text-sm font-semibold text-gray-500 md:text-base">
                You haven't posted anything yet
              </p>
              <img
                className="max-w-md rounded-2xl border border-slate-200 shadow-sm"
                src={NoPost}
                alt="no post"
              />
            </div>
          ) : (
            postToShow
          )}
        </>
      )}
    </>
  );
};

export default UserProfile;
