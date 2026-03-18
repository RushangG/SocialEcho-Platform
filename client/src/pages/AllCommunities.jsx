import { useEffect } from "react";
import { getNotJoinedCommunitiesAction } from "../redux/actions/communityActions";
import { useDispatch, useSelector } from "react-redux";
import CommonLoading from "../components/loader/CommonLoading";
import CommunityCard from "../components/community/CommunityCard";

const AllCommunities = () => {
  const dispatch = useDispatch();

  const notJoinedCommunities = useSelector(
    (state) => state.community?.notJoinedCommunities
  );

  useEffect(() => {
    dispatch(getNotJoinedCommunitiesAction());
  }, [dispatch]);

  if (!notJoinedCommunities) {
    return (
      <div className="user-page-shell flex items-center justify-center">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="user-page-head">
        <p className="user-page-title">Discover Communities</p>
        <p className="user-page-subtitle">Find spaces that match your interests and join new conversations.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {notJoinedCommunities?.map((community) => (
          <CommunityCard key={community._id} community={community} />
        ))}
      </div>
    </div>
  );
};

export default AllCommunities;
