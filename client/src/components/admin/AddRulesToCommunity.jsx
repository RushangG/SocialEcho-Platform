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
      <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <FaLink className="text-2xl text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Add Rules to Community</h2>
      </div>

      {message.text && (
        <div
          className={`p-4 mb-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="communityId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Community *
          </label>
          <select
            id="communityId"
            name="communityId"
            value={formData.communityId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a community</option>
            {communities?.map((community) => (
              <option key={community._id} value={community._id}>
                {community.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="useAllRules"
            name="useAllRules"
            checked={formData.useAllRules}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="useAllRules" className="text-sm font-medium text-gray-700">
            Add all existing rules to this community
          </label>
        </div>

        {!formData.useAllRules && rules && rules.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Rules *
            </label>
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
              {rules.map((rule) => (
                <label
                  key={rule._id}
                  className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.ruleIds.includes(rule._id)}
                    onChange={() => handleRuleToggle(rule._id)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800">{rule.rule}</p>
                    <p className="text-xs text-gray-600 mt-1">{rule.description}</p>
                  </div>
                </label>
              ))}
            </div>
            {formData.ruleIds.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {formData.ruleIds.length} rule(s) selected
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.communityId}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
            loading || !formData.communityId
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
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

