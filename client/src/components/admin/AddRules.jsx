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
    <div className="admin-content-card add-rules-shell">
      <div className="add-rules-head">
        <div className="add-rules-head-icon">
          <FaGavel className="admin-header-icon" />
        </div>
        <div>
          <h2 className="add-rules-title">Add Moderation Rules</h2>
          <p className="add-rules-sub">Create custom moderation rules or import defaults</p>
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
        <div className="add-rules-default-row">
          <input
            type="checkbox"
            id="useDefaultData"
            name="useDefaultData"
            checked={formData.useDefaultData}
            onChange={handleChange}
            className="admin-checkbox"
          />
          <label htmlFor="useDefaultData" className="admin-field-label mb-0">
            Use default rules from JSON file
          </label>
        </div>

        {!formData.useDefaultData && (
          <>
            <div>
              <label
                htmlFor="rule"
                className="admin-field-label"
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
                className="admin-input"
                placeholder="e.g., No hate speech or discrimination"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="admin-field-label"
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
                className="admin-textarea"
                placeholder="Enter detailed description of the rule"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading || (!formData.useDefaultData && (!formData.rule || !formData.description))}
          className="admin-btn-primary w-full py-3"
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
        <div className="mt-8 add-rules-existing-wrap">
          <h3 className="admin-subsection-title mb-4">Existing Rules ({rules.length})</h3>
          <div
            className="space-y-2 add-rules-list"
            style={{
              maxHeight: rules.length > 8 ? "420px" : "none",
              overflowY: rules.length > 8 ? "auto" : "visible",
              paddingRight: rules.length > 8 ? "0.25rem" : "0"
            }}
          >
            {rules.map((rule) => (
              <div
                key={rule._id}
                className="admin-entity-item add-rules-card"
              >
                <h4 className="font-semibold text-gray-800 add-rules-card-title">{rule.rule}</h4>
                <p className="text-sm text-gray-600 mt-1 add-rules-card-desc">{rule.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRules;

