import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCommunitiesAction,
  getRulesAction,
  addRulesToCommunityAction,
} from "../../redux/actions/adminActions";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import { FaLink } from "react-icons/fa";

const AddRulesToCommunity = () => {
  const dispatch = useDispatch();
  const communities = useSelector((state) => state.admin?.communities);
  const rules = useSelector((state) => state.admin?.rules);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    communityId: "",
    ruleIds: [],
    useAllRules: false,
  });

  useEffect(() => {
    setLoadingData(true);
    Promise.all([
      dispatch(getCommunitiesAction()),
      dispatch(getRulesAction()),
    ]).finally(() => setLoadingData(false));
  }, [dispatch]);

  const handleChange = (e) => {
    if (e.target.name === "communityId") {
      setFormData({ ...formData, communityId: e.target.value });
    } else if (e.target.name === "useAllRules") {
      setFormData({ ...formData, useAllRules: e.target.checked, ruleIds: [] });
    }
    setMessage({ type: "", text: "" });
  };

  const handleRuleToggle = (ruleId) => {
    if (formData.useAllRules) return;
    
    setFormData((prev) => {
      if (prev.ruleIds.includes(ruleId)) {
        return {
          ...prev,
          ruleIds: prev.ruleIds.filter((id) => id !== ruleId),
        };
      } else {
        return {
          ...prev,
          ruleIds: [...prev.ruleIds, ruleId],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      let rulesData;
      if (formData.useAllRules) {
        rulesData = { useAllRules: true };
      } else {
        if (formData.ruleIds.length === 0) {
          setMessage({
            type: "error",
            text: "Please select at least one rule",
          });
          setLoading(false);
          return;
        }
        rulesData = { ruleIds: formData.ruleIds };
      }

      const result = await dispatch(
        addRulesToCommunityAction(formData.communityId, rulesData)
      );

      if (result.success) {
        setMessage({
          type: "success",
          text: result.data.message || "Rules added successfully!",
        });
        setFormData({ communityId: "", ruleIds: [], useAllRules: false });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to add rules to community",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "An error occurred",
      });
    }
    setLoading(false);
  };

  if (loadingData) {
    return (
      <div className="admin-content-card text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="admin-content-card add-rules-community-shell">
      <div className="add-rules-community-head">
        <div className="add-rules-community-head-icon">
          <FaLink className="admin-header-icon" />
        </div>
        <div>
          <h2 className="add-rules-community-title">Add Rules to Community</h2>
          <p className="add-rules-community-sub">Assign selected moderation rules to a target community</p>
        </div>
      </div>

      {message.text && (
        <div
          className={`admin-message mb-4 ${
            message.type === "success"
              ? "admin-message-success"
              : "admin-message-error"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="communityId"
            className="admin-field-label"
          >
            Select Community *
          </label>
          <select
            id="communityId"
            name="communityId"
            value={formData.communityId}
            onChange={handleChange}
            required
            className="admin-select"
          >
            <option value="">Choose a community</option>
            {communities?.map((community) => (
              <option key={community._id} value={community._id}>
                {community.name}
              </option>
            ))}
          </select>
        </div>

        <div className="add-rules-community-toggle-row">
          <input
            type="checkbox"
            id="useAllRules"
            name="useAllRules"
            checked={formData.useAllRules}
            onChange={handleChange}
            className="admin-checkbox"
          />
          <label htmlFor="useAllRules" className="admin-field-label mb-0">
            Add all existing rules to this community
          </label>
        </div>

        {!formData.useAllRules && rules && rules.length > 0 && (
          <div>
            <label className="admin-field-label mb-2">
              Select Rules *
            </label>
            <div
              className="add-rules-community-rules-wrap"
              style={{
                maxHeight: rules.length > 8 ? "420px" : "none",
                overflowY: rules.length > 8 ? "auto" : "visible"
              }}
            >
              {rules.map((rule) => (
                <label
                  key={rule._id}
                  className="admin-entity-item add-rules-community-rule-item"
                >
                  <input
                    type="checkbox"
                    checked={formData.ruleIds.includes(rule._id)}
                    onChange={() => handleRuleToggle(rule._id)}
                    className="mt-1 admin-checkbox"
                  />
                  <div className="flex-1">
                    <p className="add-rules-community-rule-title">{rule.rule}</p>
                    <p className="add-rules-community-rule-desc">{rule.description}</p>
                  </div>
                </label>
              ))}
            </div>
            {formData.ruleIds.length > 0 && (
              <p className="add-rules-community-count">
                {formData.ruleIds.length} rule(s) selected
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.communityId}
          className="admin-btn-primary w-full py-3"
        >
          {loading ? (
            <ButtonLoadingSpinner loadingText="Adding rules..." />
          ) : (
            "Add Rules to Community"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddRulesToCommunity;

