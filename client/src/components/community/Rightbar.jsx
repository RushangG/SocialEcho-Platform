
import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LeaveModal from "../modals/LeaveModal";
import { getCommunityAction } from "../../redux/actions/communityActions";
import placeholder from "../../assets/placeholder.png";
import CommonLoading from "../loader/CommonLoading";

import {
  useBannerLoading,
  useIsModeratorUpdated,
} from "../../hooks/useCommunityData";
import { HiUserGroup, HiOutlineCheckBadge } from "react-icons/hi2";

const Rightbar = () => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const dispatch = useDispatch();
  const { communityName } = useParams();

  const toggleLeaveModal = useCallback(() => {
    setShowLeaveModal((prevState) => !prevState);
  }, []);

  useEffect(() => {
    dispatch(getCommunityAction(communityName));
  }, [dispatch, communityName]);

  const communityData = useSelector((state) => state.community?.communityData);

  const isModeratorOfThisCommunity = useSelector(
    (state) => state.auth?.isModeratorOfThisCommunity
  );

  const { name, description, members, rules, banner } = useMemo(
    () => communityData || {},
    [communityData]
  );

  const bannerLoaded = useBannerLoading(banner);
  const isModeratorUpdated = useIsModeratorUpdated(isModeratorOfThisCommunity);

  if (!communityData) {
    return (
      <div className="flex justify-center">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <section className="widget-card mb-3">
        <div className="widget-header">
          <h2 className="widget-title">{name}</h2>
          <div className="badge-pill badge-primary">
            <HiUserGroup />
            <span>
              {members?.length || 0} {members?.length === 1 ? "member" : "members"}
            </span>
          </div>
        </div>
        <div className="widget-body p-3">
          {bannerLoaded ? (
            <img
              src={banner}
              alt="community banner"
              className="mb-3 h-40 w-full rounded-xl object-cover"
              onError={(e) => {
                e.target.src = placeholder;
              }}
            />
          ) : (
            <img
              src={placeholder}
              alt="community banner placeholder"
              className="mb-3 h-40 w-full rounded-xl object-cover"
            />
          )}

          <h3 className="text-sm text-slate-700">{description}</h3>

          <div className="my-4">
        {isModeratorOfThisCommunity && (
          <Link
            to={`/community/${communityName}/moderator`}
            className="btn-primary w-full"
          >
            Moderation Panel
          </Link>
        )}

        {isModeratorUpdated && !isModeratorOfThisCommunity && (
          <button
            onClick={toggleLeaveModal}
            className="btn-joined w-full"
          >
            Leave Community
          </button>
        )}
        {
          <LeaveModal
            show={showLeaveModal}
            toggle={toggleLeaveModal}
            communityName={communityName}
          />
        }
          </div>
        </div>
      </section>
      {rules && rules.length > 0 && (
        <section className="widget-card mb-3">
          <div className="widget-header">
            <span className="widget-title">Community Guidelines</span>
          </div>
          <ul className="widget-body flex list-decimal flex-col gap-2 pl-7 text-sm text-slate-700">
            {rules.map((rule) => (
              <li key={rule._id} className="flex items-start gap-2 ">
                <HiOutlineCheckBadge className="text-lg flex-shrink-0 mt-1" />
                {rule.rule}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default Rightbar;
