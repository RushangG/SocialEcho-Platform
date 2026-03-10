import { useEffect, useState, memo } from "react";
import {
  HiOutlineArchiveBoxArrowDown,
  HiOutlineArchiveBoxXMark,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import {
  savePostAction,
  unsavePostAction,
  getSavedPostsAction,
  increaseSavedByCount,
  decreaseSavedByCount,
} from "../../redux/actions/postActions";

const Save = ({ postId }) => {
  const dispatch = useDispatch();

  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const savedPosts = useSelector((state) => state.posts?.savedPosts);
  const savedPostsIds = savedPosts.map((post) => post._id);

  useEffect(() => {
    dispatch(getSavedPostsAction());
  }, [dispatch]);

  useEffect(() => {
    if (savedPostsIds.includes(postId)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [postId, savedPostsIds]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await dispatch(savePostAction(postId));
      dispatch(increaseSavedByCount(postId));
      setSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnsave = async () => {
    try {
      setIsSaving(true);
      await dispatch(unsavePostAction(postId));
      dispatch(decreaseSavedByCount(postId));
      setSaved(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={saved ? handleUnsave : handleSave}
      className="tooltip inline-flex items-center justify-center rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={isSaving}
    >
      {isSaving ? (
        <span className="text-xs">Saving...</span>
      ) : saved ? (
        <>
          <span className="tooltiptext">Remove from saved</span>
          <HiOutlineArchiveBoxXMark className="text-xl text-blue-600" />
        </>
      ) : (
        <>
          <span className="tooltiptext">Save post</span>
          <HiOutlineArchiveBoxArrowDown className="text-xl" />
        </>
      )}
    </button>
  );
};

export default memo(Save);
