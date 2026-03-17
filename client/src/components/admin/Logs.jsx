import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getLogsAction,
  deleteLogsAction,
} from "../../redux/actions/adminActions";
import CurrentTime from "../shared/CurrentTime";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import { FcRefresh } from "react-icons/fc";
import { MdOutlineMonitorHeart, MdErrorOutline } from "react-icons/md";
import {
  IoInformationCircleOutline,
  IoWarningOutline,
  IoTrashOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { LuClock, LuActivity } from "react-icons/lu";

const FILTERS = ["all", "info", "warn", "error"];

const filterActiveClass = {
  all: "log-filter-active-all",
  info: "log-filter-active-info",
  warn: "log-filter-active-warn",
  error: "log-filter-active-error",
};

const levelClass = {
  info: "admin-tag-info",
  warn: "admin-tag-warn",
  error: "admin-tag-error",
};

const messageClass = {
  info: "log-msg-info",
  warn: "log-msg-warn",
  error: "log-msg-error",
};

const Logs = () => {
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [isRefreshSpinning, setIsRefreshSpinning] = useState(false);
  const [toast, setToast] = useState(null);

  const dispatch = useDispatch();
  const logs = useSelector((state) => state.admin?.logs);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      await dispatch(getLogsAction());
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    try {
      setClearing(true);
      await dispatch(deleteLogsAction());
      setToast({ type: "success", text: "Logs cleared successfully" });
      setTimeout(() => setToast(null), 2600);
    } catch (_) {
      setToast({ type: "error", text: "Failed to clear logs" });
      setTimeout(() => setToast(null), 3200);
    } finally {
      setClearing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshSpinning(true);
    try {
      setLoading(true);
      await fetchLogs();
    } catch (_) {
      setToast({ type: "error", text: "Failed to refresh logs" });
      setTimeout(() => setToast(null), 3200);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs?.length]);

  const allLogs = logs ?? [];
  const infoCount = allLogs.filter((l) => l.level === "info").length;
  const errorCount = allLogs.filter((l) => l.level === "error").length;
  const warnCount = allLogs.filter((l) => l.level === "warn").length;
  const filteredLogs = filter === "all" ? allLogs : allLogs.filter((l) => l.level === filter);

  if (loading || !logs) {
    return (
      <>
        {toast && (
          <div className={`admin-toast ${toast.type === "success" ? "admin-toast-success" : "admin-toast-error"}`}>
            {toast.type === "success" ? <IoCheckmarkCircleOutline style={{ fontSize: 16, flexShrink: 0 }} /> : <MdErrorOutline style={{ fontSize: 16, flexShrink: 0 }} />}
            {toast.text}
          </div>
        )}
        <div className="admin-content-card logs-shell">
          <div style={{ marginBottom: "1.5rem" }}>
            <div className="log-skeleton-row" style={{ width: "35%", height: 28 }} />
            <div className="log-skeleton-row" style={{ width: "20%", height: 18, marginTop: 8 }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[120, 90, 90].map((w, i) => (
              <div key={i} className="log-skeleton-row" style={{ width: w, height: 30, borderRadius: 999 }} />
            ))}
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="log-skeleton-row" style={{ height: 44, animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {toast && (
        <div className={`admin-toast ${toast.type === "success" ? "admin-toast-success" : "admin-toast-error"}`}>
          {toast.type === "success" ? <IoCheckmarkCircleOutline style={{ fontSize: 16, flexShrink: 0 }} /> : <MdErrorOutline style={{ fontSize: 16, flexShrink: 0 }} />}
          {toast.text}
        </div>
      )}
      <div className="admin-content-card logs-shell">
        <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MdOutlineMonitorHeart className="log-header-icon" />
            <h1 className="admin-section-title log-heading">User Activity Logs</h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="log-live-badge">
              <span className="log-live-dot" />
              LIVE
            </span>
            <span className="log-range-pill">
              <LuClock style={{ fontSize: 12 }} />
              Last 7 days
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CurrentTime />
          <button
            className="admin-btn-neutral log-refresh-btn"
            onClick={handleRefresh}
            onAnimationEnd={() => setIsRefreshSpinning(false)}
            title="Refresh"
          >
            <FcRefresh className={isRefreshSpinning ? "log-btn-spinning" : ""} size={20} />
          </button>
          {allLogs.length > 0 && (
            <button className="admin-btn-danger log-clear-btn" onClick={handleCleanup} disabled={clearing}>
              {clearing ? (
                <ButtonLoadingSpinner loadingText="Clearing..." />
              ) : (
                <>
                  <IoTrashOutline size={14} />
                  Clear Logs
                </>
              )}
            </button>
          )}
        </div>
        </div>
        <div className="log-divider" />

        <div className="admin-kpi-row mb-3" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "0.75rem" }}>
        <span className="log-stat-pill log-stat-pill-total" style={{ animationDelay: "0.1s" }}>
          <span className="log-stat-dot log-stat-dot-total" />
          <LuActivity size={13} className="log-stat-icon-total" />
          <span className="log-stat-count">{allLogs.length}</span>
          <span className="log-stat-label">total events</span>
        </span>

        <span className="log-stat-pill log-stat-pill-error" style={{ animationDelay: "0.2s" }}>
          <span className="log-stat-dot log-stat-dot-error" />
          <MdErrorOutline size={13} className="log-stat-icon-error" />
          <span className="log-stat-count">{errorCount}</span>
          <span className="log-stat-label log-stat-label-error">errors</span>
        </span>

        <span className="log-stat-pill log-stat-pill-warn" style={{ animationDelay: "0.3s" }}>
          <span className="log-stat-dot log-stat-dot-warn" />
          <IoWarningOutline size={13} className="log-stat-icon-warn" />
          <span className="log-stat-count">{warnCount}</span>
          <span className="log-stat-label log-stat-label-warn">warnings</span>
        </span>
        </div>

        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map((level) => (
            <button
              key={level}
              className={`log-filter-pill ${filter === level ? filterActiveClass[level] : ""}`}
              onClick={() => setFilter(level)}
            >
              {level === "all" ? "All" : `${level.charAt(0).toUpperCase()}${level.slice(1)}`}
              {level !== "all" && (
                <span className="log-filter-count">
                  ({level === "info" ? infoCount : level === "warn" ? warnCount : errorCount})
                </span>
              )}
            </button>
          ))}
        </div>
        <span className="log-showing-copy">
          Showing {filteredLogs.length} of {allLogs.length} events
        </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="log-empty-state">
          <div className="log-empty-icon-wrap">
            <MdOutlineMonitorHeart className="log-empty-icon" />
          </div>
          <div className="log-empty-copy">
            <p className="log-empty-title">
              {filter === "all" ? "No activity logs" : `No ${filter} events`}
            </p>
            <p className="log-empty-subtitle">
              {filter === "all"
                ? "All clear — no events recorded in the last 7 days"
                : `No ${filter}-level events match the current filter`}
            </p>
          </div>
          {filter !== "all" && (
            <button className="admin-btn-neutral log-empty-btn" onClick={() => setFilter("all")}>
              Clear filter
            </button>
          )}
          </div>
        ) : (
          <div className="admin-table-wrap">
            <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 128 }}>
                    <span className="log-th-with-hint">Timestamp <span className="log-th-hint">⌃</span></span>
                  </th>
                  <th>Message</th>
                  <th style={{ minWidth: 160 }}>Email Used</th>
                  <th style={{ minWidth: 108 }}>Level</th>
                  <th style={{ minWidth: 260 }}>Context Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={log._id} className={index % 2 ? "log-row-odd" : "log-row-even"}>
                    <td>
                      <span className="log-time-cell">
                        <span className="log-time-relative">{log.relativeTimestamp}</span>
                        <span className="log-time-formatted">{log.formattedTimestamp}</span>
                      </span>
                    </td>

                    <td>
                      <span className="log-type-tag">{log.type}</span>
                      <span className={`log-message-text ${messageClass[log.level] || ""}`}>{log.message}</span>
                    </td>

                    <td>
                      {log.email ? <span className="log-email-pill">{log.email}</span> : <span className="log-muted">—</span>}
                    </td>

                    <td>
                      <span className={`admin-tag log-level-tag ${levelClass[log.level] || "admin-tag-info"}`}>
                        {log.level === "info" && <IoInformationCircleOutline size={12} />}
                        {log.level === "warn" && <IoWarningOutline size={12} />}
                        {log.level === "error" && <MdErrorOutline size={12} />}
                        {log.level}
                      </span>
                    </td>

                    <td>
                      {log.contextData && Object.keys(log.contextData).length > 0 ? (
                        <div className="log-context-wrap">
                          {Object.entries(log.contextData).map(([key, value]) => (
                            <span key={key} className="log-context-chip">
                              <span className="log-context-key">{key}</span>
                              <span className="log-context-val">{String(value)}</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="log-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}

        <div className="log-footer">
          <LuClock style={{ fontSize: 12 }} />
          <span>Activity logs are automatically purged after 7 days</span>
        </div>
      </div>
    </>
  );
};

export default Logs;
