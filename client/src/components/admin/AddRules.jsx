import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRulesAction, addRulesAction } from "../../redux/actions/adminActions";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import { FaGavel } from "react-icons/fa";

const AddRules = () => {
  const dispatch = useDispatch();
  const rules = useSelector((state) => state.admin?.rules);
  const [loading, setLoading] = useState(false);
  const [loadingRules, setLoadingRules] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    rule: "",
    description: "",
    useDefaultData: false,
  });

  useEffect(() => {
    setLoadingRules(true);
    dispatch(getRulesAction()).finally(() => setLoadingRules(false));
  }, [dispatch]);

  const handleChange = (e) => {
    if (e.target.name === "useDefaultData") {
      setFormData({ ...formData, useDefaultData: e.target.checked });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      let rulesData;
      if (formData.useDefaultData) {
        rulesData = { useDefaultData: true };
      } else {
        rulesData = {
          rules: {
            rule: formData.rule,
            description: formData.description,
          },
        };
      }

      const result = await dispatch(addRulesAction(rulesData));

      if (result.success) {
        setMessage({
          type: "success",
          text: `Successfully added ${result.data.added || 1} rule(s)!`,
        });
        setFormData({ rule: "", description: "", useDefaultData: false });
        dispatch(getRulesAction());
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to add rules",
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

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <FaGavel className="text-2xl text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Add Moderation Rules</h2>
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
        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="useDefaultData"
            name="useDefaultData"
            checked={formData.useDefaultData}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="useDefaultData" className="text-sm font-medium text-gray-700">
            Use default rules from JSON file
          </label>
        </div>

        {!formData.useDefaultData && (
          <>
            <div>
              <label
                htmlFor="rule"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rule Name *
              </label>
              <input
                type="text"
                id="rule"
                name="rule"
                value={formData.rule}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., No hate speech or discrimination"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter detailed description of the rule"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading || (!formData.useDefaultData && (!formData.rule || !formData.description))}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
            loading || (!formData.useDefaultData && (!formData.rule || !formData.description))
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <ButtonLoadingSpinner loadingText="Adding rules..." />
          ) : (
            formData.useDefaultData ? "Add Default Rules" : "Add Rule"
          )}
        </button>
      </form>

      {loadingRules ? (
        <div className="mt-8 text-center">Loading rules...</div>
      ) : rules && rules.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Existing Rules ({rules.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {rules.map((rule) => (
              <div
                key={rule._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-gray-800">{rule.rule}</h4>
                <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRules;

