import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCommunitiesAction,
  getRulesAction,
  addRulesToCommunityAction,
  getCommunityRulesAction,
  removeRuleFromCommunityAction,
} from "../../redux/actions/adminActions";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import { FaLink, FaTrash, FaPlus, FaListUl, FaCheckSquare } from "react-icons/fa";

const AddRulesToCommunity = () => {
  const dispatch = useDispatch();
  const communities = useSelector((state) => state.admin?.communities);
  const allRules = useSelector((state) => state.admin?.rules);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  // Currently selected community id
  const [selectedCommunityId, setSelectedCommunityId] = useState("");

  // Rules already assigned to the selected community
  const [communityRules, setCommunityRules] = useState([]);
  const [loadingCommunityRules, setLoadingCommunityRules] = useState(false);

  // Rules checked to add (from part-1)
  const [selectedRuleIds, setSelectedRuleIds] = useState([]);

  const [message, setMessage] = useState({ type: "", text: "" });

  // ── Initial data fetch ──────────────────────────────────────────────
  useEffect(() => {
    setLoadingData(true);
    Promise.all([
      dispatch(getCommunitiesAction()),
      dispatch(getRulesAction()),
    ]).finally(() => setLoadingData(false));
  }, [dispatch]);

  // ── Fetch community rules whenever selection changes ─────────────────
  const fetchCommunityRules = useCallback(
    async (communityId) => {
      if (!communityId) {
        setCommunityRules([]);
        return;
      }
      setLoadingCommunityRules(true);
      const result = await dispatch(getCommunityRulesAction(communityId));
      if (result.success) {
        setCommunityRules(result.data || []);
      } else {
        setCommunityRules([]);
      }
      setLoadingCommunityRules(false);
    },
    [dispatch]
  );

  const handleCommunityChange = (e) => {
    const id = e.target.value;
    setSelectedCommunityId(id);
    setSelectedRuleIds([]);
    setMessage({ type: "", text: "" });
    fetchCommunityRules(id);
  };

  // ── Available rules = all rules NOT already in community ─────────────
  const communityRuleIds = communityRules.map((r) => r._id);
  const availableRules = (allRules || []).filter(
    (r) => !communityRuleIds.includes(r._id)
  );

  // ── Toggle a rule in the "to add" selection ───────────────────────
  const handleRuleToggle = (ruleId) => {
    setSelectedRuleIds((prev) =>
      prev.includes(ruleId)
        ? prev.filter((id) => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  // ── Add selected rules ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCommunityId) return;

    if (selectedRuleIds.length === 0) {
      setMessage({ type: "error", text: "Please select at least one rule to add." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    const result = await dispatch(
      addRulesToCommunityAction(selectedCommunityId, { ruleIds: selectedRuleIds })
    );

    if (result.success) {
      setMessage({ type: "success", text: "Rules added to community successfully!" });
      setSelectedRuleIds([]);
      // Refresh community rules panel
      await fetchCommunityRules(selectedCommunityId);
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to add rules to community.",
      });
    }
    setLoading(false);
  };

  // ── Remove a rule from the community ─────────────────────────────
  const handleRemove = async (ruleId) => {
    setRemovingId(ruleId);
    setMessage({ type: "", text: "" });

    const result = await dispatch(
      removeRuleFromCommunityAction(selectedCommunityId, ruleId)
    );

    if (result.success) {
      setCommunityRules((prev) => prev.filter((r) => r._id !== ruleId));
      setMessage({ type: "success", text: "Rule removed from community." });
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to remove rule.",
      });
    }
    setRemovingId(null);
  };

  // ── Loading skeleton ─────────────────────────────────────────────
  if (loadingData) {
    return (
      <div className="admin-content-card add-rules-community-shell text-center">
        <div className="admin-loader" />
      </div>
    );
  }

  const selectedCommunityName =
    communities?.find((c) => c._id === selectedCommunityId)?.name || "";

  return (
    <div className="admin-content-card add-rules-community-shell">
      {/* ── Header ── */}
      <div className="add-rules-community-head">
        <div className="add-rules-community-head-icon">
          <FaLink className="admin-header-icon" />
        </div>
        <div>
          <h2 className="add-rules-community-title">Manage Community Rules</h2>
          <p className="add-rules-community-sub">
            Add or remove moderation rules for a community
          </p>
        </div>
      </div>

      {/* ── Message banner ── */}
      {message.text && (
        <div
          className={`admin-message mb-4 ${message.type === "success"
              ? "admin-message-success"
              : "admin-message-error"
            }`}
        >
          {message.text}
        </div>
      )}

      {/* ── Community selector ── */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label htmlFor="communityId" className="admin-field-label">
          Select Community *
        </label>
        <select
          id="communityId"
          value={selectedCommunityId}
          onChange={handleCommunityChange}
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

      {/* ── Two-panel layout (shown only when a community is selected) ── */}
      {selectedCommunityId && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.25rem",
            alignItems: "start",
          }}
        >
          {/* ════════════════ PART 1 — Available rules ════════════════ */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {/* Panel header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                paddingBottom: "0.6rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <FaPlus style={{ color: "var(--primary)", fontSize: "0.85rem" }} />
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                Available Rules
              </span>
              {availableRules.length > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                    borderRadius: "999px",
                    padding: "0.1rem 0.55rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {availableRules.length}
                </span>
              )}
            </div>

            {availableRules.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  background: "var(--surface-2)",
                  borderRadius: "10px",
                  border: "1px dashed var(--border)",
                }}
              >
                {allRules?.length === 0
                  ? "No rules exist yet. Create rules first."
                  : "All rules are already added to this community."}
              </div>
            ) : (
              <div
                className="add-rules-community-rules-wrap"
                style={{
                  maxHeight: "380px",
                  overflowY: "auto",
                }}
              >
                {availableRules.map((rule) => {
                  const checked = selectedRuleIds.includes(rule._id);
                  return (
                    <label
                      key={rule._id}
                      className="admin-entity-item add-rules-community-rule-item"
                      style={{
                        cursor: "pointer",
                        background: checked ? "var(--primary-light)" : undefined,
                        borderRadius: "8px",
                        transition: "background 0.15s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleRuleToggle(rule._id)}
                        className="mt-1 admin-checkbox"
                      />
                      <div className="flex-1">
                        <p className="add-rules-community-rule-title">{rule.rule}</p>
                        <p className="add-rules-community-rule-desc">{rule.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {selectedRuleIds.length > 0 && (
              <p className="add-rules-community-count">
                <FaCheckSquare style={{ marginRight: "0.3rem", color: "var(--primary)" }} />
                {selectedRuleIds.length} rule(s) selected
              </p>
            )}

            <button
              type="submit"
              disabled={loading || selectedRuleIds.length === 0}
              className="admin-btn-primary w-full py-3"
              style={{ marginTop: "0.25rem" }}
            >
              {loading ? (
                <ButtonLoadingSpinner loadingText="Adding..." />
              ) : (
                `Add ${selectedRuleIds.length > 0 ? `${selectedRuleIds.length} ` : ""}Rule${selectedRuleIds.length !== 1 ? "s" : ""} to Community`
              )}
            </button>
          </form>

          {/* ════════════════ PART 2 — Community's current rules ════════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {/* Panel header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                paddingBottom: "0.6rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <FaListUl style={{ color: "var(--primary)", fontSize: "0.85rem" }} />
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                {selectedCommunityName}&rsquo;s Rules
              </span>
              {communityRules.length > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "#f0fdf4",
                    color: "#15803d",
                    border: "1px solid #bbf7d0",
                    borderRadius: "999px",
                    padding: "0.1rem 0.55rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {communityRules.length}
                </span>
              )}
            </div>

            {loadingCommunityRules ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                }}
              >
                Loading rules…
              </div>
            ) : communityRules.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  background: "var(--surface-2)",
                  borderRadius: "10px",
                  border: "1px dashed var(--border)",
                }}
              >
                No rules assigned to this community yet.
              </div>
            ) : (
              <div
                className="add-rules-community-rules-wrap"
                style={{
                  maxHeight: "420px",
                  overflowY: "auto",
                }}
              >
                {communityRules.map((rule) => (
                  <div
                    key={rule._id}
                    className="admin-entity-item add-rules-community-rule-item"
                    style={{ justifyContent: "space-between", alignItems: "flex-start" }}
                  >
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <p className="add-rules-community-rule-title">{rule.rule}</p>
                      <p className="add-rules-community-rule-desc">{rule.description}</p>
                    </div>
                    <button
                      type="button"
                      title="Remove from community"
                      disabled={removingId === rule._id}
                      onClick={() => handleRemove(rule._id)}
                      style={{
                        flexShrink: 0,
                        marginLeft: "0.6rem",
                        marginTop: "0.15rem",
                        background: removingId === rule._id ? "#fecaca" : "#fee2e2",
                        border: "1px solid #fca5a5",
                        color: "#dc2626",
                        borderRadius: "7px",
                        padding: "0.3rem 0.55rem",
                        cursor: removingId === rule._id ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        transition: "background 0.15s, transform 0.1s",
                      }}
                    >
                      <FaTrash style={{ fontSize: "0.7rem" }} />
                      {removingId === rule._id ? "Removing…" : "Remove"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prompt if no community selected */}
      {!selectedCommunityId && (
        <div
          style={{
            textAlign: "center",
            padding: "2.5rem",
            color: "var(--text-muted)",
            fontSize: "0.88rem",
            background: "var(--surface-2)",
            borderRadius: "12px",
            border: "1px dashed var(--border)",
          }}
        >
          Select a community above to manage its rules.
        </div>
      )}
    </div>
  );
};

export default AddRulesToCommunity;
