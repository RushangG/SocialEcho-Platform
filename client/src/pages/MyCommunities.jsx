import { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getJoinedCommunitiesAction } from "../redux/actions/communityActions";
import JoinedCommunityCard from "../components/community/JoinedCommunityCard";
import CommonLoading from "../components/loader/CommonLoading";

const MyCommunities = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const joinedCommunities = useSelector(
    (state) => state.community?.joinedCommunities
  );

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getJoinedCommunitiesAction());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const communityCards = useMemo(() => {
    if (!joinedCommunities) {
      return null;
    }
    return joinedCommunities.map((community) => (
      <div key={community._id} className="flex items-center">
        <JoinedCommunityCard className="mb-5" community={community} />
      </div>
    ));
  }, [joinedCommunities]);

  if (loading) {
    return (
      <div className="col-span-2 flex h-screen items-center justify-center">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="user-page-shell">
      <div className="user-page-head">
        <p className="user-page-kicker">Membership</p>
        <h1 className="user-page-title">Your Communities</h1>
        <p className="user-page-subtitle">Quick access to the communities you are already part of.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{communityCards}</div>
    </div>
  );
};

export default MyCommunities;
