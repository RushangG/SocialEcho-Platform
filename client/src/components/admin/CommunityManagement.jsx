import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCommunitiesAction,
  getModeratorsAction,
  addModeratorAction,
  removeModeratorAction,
  getCommunityAction,
} from "../../redux/actions/adminActions";
import placeholderImage from "../../assets/placeholder.png";

const CommunityManagement = () => {
  const dispatch = useDispatch();
  const communities = useSelector((state) => state.admin?.communities);
  const moderators = useSelector((state) => state.admin?.moderators);
  const community = useSelector((state) => state.admin?.community);

  useEffect(() => {
    dispatch(getCommunitiesAction());
    dispatch(getModeratorsAction());
  }, [dispatch]);

  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedCommunityData, setSelectedCommunityData] = useState(null);
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [newModerator, setNewModerator] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingCommunity, setIsChangingCommunity] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(getCommunitiesAction());
    setRefreshing(false);
  };

  const handleCommunitySelect = async (community) => {
    setSelectedCommunity(community);
    setIsChangingCommunity(true);
    await dispatch(getCommunityAction(community._id));
    setIsChangingCommunity(false);
  };

  useEffect(() => {
    setSelectedCommunityData(community);
  }, [community]);

  const handleModeratorSelect = (moderator) => {
    setSelectedModerator(moderator);
  };

  const handleRemoveModerator = async (moderator) => {
    setIsUpdating(true);
    await dispatch(
      removeModeratorAction(selectedCommunityData._id, moderator._id)
    );
    await dispatch(getCommunityAction(selectedCommunityData._id));
    await dispatch(addModeratorAction(selectedCommunityData._id, newModerator));
    await dispatch(getModeratorsAction());
    setIsUpdating(false);
  };
  const handleAddModerator = async () => {
    setIsUpdating(true);
    await dispatch(addModeratorAction(selectedCommunityData._id, newModerator));
    await dispatch(getCommunityAction(selectedCommunityData._id));
    await dispatch(getModeratorsAction());
    setNewModerator("");
    setIsUpdating(false);
  };

  if (!communities || !moderators) {
    return <div className="admin-content-card">Loading...</div>;
  }

  return (
    <div className="admin-split">
      {/* Left column */}
      <div className="admin-pane flex flex-col w-full">
        <div className="admin-pane-head">
          <h1 className="admin-pane-title">Communities</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="admin-btn-primary"
            title="Refresh communities list"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <div className="admin-pane-body flex flex-col overflow-y-auto">
          {communities.map((community) => (
            <div
              key={community._id}
              className={`admin-entity-item cursor-pointer flex items-center ${
                selectedCommunity?._id === community._id
                  ? "admin-entity-item-selected"
                  : ""
              }`}
              onClick={() => handleCommunitySelect(community)}
            >
              <img
                src={community.banner || placeholderImage}
                alt={community.name}
                className="w-10 h-10 rounded-full mr-2 md:mr-4 object-cover border border-gray-200"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = placeholderImage;
                }}
              />
              <span className="text-gray-700 text-xs md:text-base">
                {community.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="admin-pane flex flex-col w-full">
        {isChangingCommunity ? (
          <div className="flex justify-center items-center h-screen">
            <span className="admin-loader"></span>
          </div>
        ) : selectedCommunityData ? (
          <div className="admin-pane-body">
            <h1 className="admin-pane-subtitle">
              {selectedCommunityData.name}
            </h1>

            {isUpdating && (
              <div className="admin-message admin-message-info mb-4">
                Updating...
              </div>
            )}
            <div className="admin-kpi-row">
              <span className="admin-kpi-pill">
                Moderators: {selectedCommunityData.moderatorCount}
              </span>
              <span className="admin-kpi-pill">
                Members: {selectedCommunityData.memberCount}
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-5">
              {/* Moderators list */}
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <h2 className="admin-subsection-title mb-2">Moderators</h2>
                {selectedCommunityData.moderators?.length === 0 && (
                  <span>No moderators</span>
                )}
                <div className="flex flex-col">
                  {selectedCommunityData.moderators?.map((moderator) => (
                    <div
                      key={moderator._id}
                      className={`admin-entity-item p-2 cursor-pointer flex flex-col md:flex-row gap-2 justify-between items-center ${
                        selectedModerator?._id === moderator._id ? "" : ""
                      }`}
                      onClick={() => handleModeratorSelect(moderator)}
                    >
                      <span className="font-medium">{moderator.name}</span>
                      <button
                        disabled={isUpdating}
                        className={`admin-btn-danger ${
                          isUpdating ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => handleRemoveModerator(moderator)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add moderator form */}
              <div className="flex flex-col w-full gap-2 md:w-1/2">
                <h2 className="admin-subsection-title mb-2">Add Moderator</h2>
                <div className="flex flex-col gap-2 md:flex-row">
                  <select
                    className="admin-select"
                    value={newModerator}
                    onChange={(e) => setNewModerator(e.target.value)}
                  >
                    <option value="">Select a moderator</option>
                    {moderators?.map((moderator) => (
                      <option key={moderator._id} value={moderator._id}>
                        {moderator.name}
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={
                      !newModerator ||
                      isUpdating ||
                      selectedCommunityData.moderators?.find(
                        (moderator) => moderator._id === newModerator
                      )
                    }
                    className={`admin-btn-primary ${
                      !newModerator ||
                      isUpdating ||
                      selectedCommunityData.moderators?.find(
                        (moderator) => moderator._id === newModerator
                      )
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={handleAddModerator}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="font-medium text-gray-400">
              Select a community to view details
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityManagement;
