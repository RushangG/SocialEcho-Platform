import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getServicePreferencesAction,
  updateServicePreferencesAction,
} from "../../redux/actions/adminActions";
import {
  IoSettingsOutline,
  IoChevronDownOutline,
  IoSyncOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";

const Settings = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toast, setToast] = useState(null);
  const servicePreferences = useSelector(
    (state) => state.admin?.servicePreferences
  );
  const [usePerspectiveAPI, setUsePerspectiveAPI] = useState(false);
  const [
    categoryFilteringServiceProvider,
    setCategoryFilteringServiceProvider,
  ] = useState("");
  const [categoryFilteringRequestTimeout, setCategoryFilteringRequestTimeout] =
    useState(0);
  const [timeoutSecondsInput, setTimeoutSecondsInput] = useState("");

  useEffect(() => {
    dispatch(getServicePreferencesAction());
  }, [dispatch]);

  useEffect(() => {
    if (servicePreferences) {
      setUsePerspectiveAPI(servicePreferences.usePerspectiveAPI);
      setCategoryFilteringServiceProvider(
        servicePreferences.categoryFilteringServiceProvider
      );
      setCategoryFilteringRequestTimeout(
        servicePreferences.categoryFilteringRequestTimeout
      );
      setTimeoutSecondsInput(
        String(
          Math.round(
            Number(servicePreferences.categoryFilteringRequestTimeout || 0) / 1000
          )
        )
      );
      setIsLoading(false);
    }
  }, [servicePreferences]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setIsSuccess(false);
    setToast(null);
    try {
      await dispatch(
        updateServicePreferencesAction({
          usePerspectiveAPI,
          categoryFilteringServiceProvider,
          categoryFilteringRequestTimeout,
        })
      );
      setIsSuccess(true);
      setToast({ type: "success", text: "Service preferences updated successfully" });
      setTimeout(() => {
        setIsSuccess(false);
        setToast(null);
      }, 3000);
    } catch (_) {
      setToast({ type: "error", text: "Failed to update service preferences" });
      setTimeout(() => {
        setToast(null);
      }, 3500);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !servicePreferences) {
    return <div className="admin-content-card">Loading...</div>;
  }

  return (
    <>
      {toast && (
        <div className={`admin-toast ${toast.type === "success" ? "admin-toast-success" : "admin-toast-error"}`}>
          {toast.type === "success" ? <IoCheckmarkCircleOutline style={{ fontSize: 16, flexShrink: 0 }} /> : <IoSyncOutline style={{ fontSize: 16, flexShrink: 0 }} />}
          {toast.text}
        </div>
      )}

      <div className="admin-content-card settings-shell" style={{ padding: 0, overflow: "hidden" }}>
      <div className="settings-card-head">
        <div className="settings-head-icon">
          <IoSettingsOutline />
        </div>
        <div>
          <h2 className="settings-head-title">Service Preferences</h2>
          <p className="settings-head-sub">Configure platform-level service integrations</p>
        </div>
        <span className="settings-head-badge">3 settings</span>
      </div>

      {isSuccess ? null : null}

      <div className="settings-body">
        <div className="settings-row">
          <div className="settings-row-info">
            <span className="settings-row-label">Perspective API</span>
            <span className="settings-row-desc">
              Use Google&apos;s Perspective API for automated content moderation and toxicity scoring
            </span>
          </div>
          <div className="settings-row-ctrl">
            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={usePerspectiveAPI}
                onChange={(e) => setUsePerspectiveAPI(e.target.checked)}
              />
              <span className="settings-toggle-track" />
              <span className="settings-toggle-thumb" />
            </label>
            <span className={usePerspectiveAPI ? "settings-status-on" : "settings-status-off"}>
              {usePerspectiveAPI ? "Enabled" : "Off"}
            </span>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-row-info">
            <span className="settings-row-label">Category Filtering Provider</span>
            <span className="settings-row-desc">
              Third-party service used to classify and filter post content by topic category
            </span>
          </div>
          <div className="settings-row-ctrl">
            <div className="settings-select-wrap">
              <select
                className="settings-select"
                value={categoryFilteringServiceProvider}
                onChange={(e) => setCategoryFilteringServiceProvider(e.target.value)}
              >
                <option value="">Select a provider</option>
                <option value="TextRazor">TextRazor</option>
                <option value="ClassifierAPI">ClassifierAPI</option>
                <option value="InterfaceAPI">InterfaceAPI</option>
                <option value="disabled">Disabled</option>
              </select>
              <IoChevronDownOutline className="settings-select-arrow" />
            </div>
            {categoryFilteringServiceProvider && categoryFilteringServiceProvider !== "disabled" && (
              <span className="settings-provider-chip">Active</span>
            )}
          </div>
        </div>

        <div className="settings-row" style={{ borderBottom: "none" }}>
          <div className="settings-row-info">
            <span className="settings-row-label">Request Timeout</span>
            <span className="settings-row-desc">
              Maximum wait time in seconds for category filtering API responses before request cancellation
            </span>
          </div>
          <div className="settings-row-ctrl">
            <div className="settings-num-wrap">
              <span className="settings-num-unit">sec</span>
              <input
                className="settings-num-input"
                type="number"
                value={timeoutSecondsInput}
                step={1}
                min={0}
                max={500}
                required
                onChange={(e) => {
                  const { value } = e.target;

                  setTimeoutSecondsInput(value);

                  if (value === "") {
                    setCategoryFilteringRequestTimeout(0);
                    return;
                  }

                  const secondsValue = Number(value);

                  if (Number.isNaN(secondsValue)) {
                    return;
                  }

                  const millisecondsValue = Math.max(0, Math.round(secondsValue * 1000));
                  setCategoryFilteringRequestTimeout(millisecondsValue);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="settings-card-foot">
        <span className="settings-foot-note">
          <span className="settings-foot-dot" />
          Changes apply immediately to all active sessions
        </span>
        <button className="settings-btn-update" onClick={handleUpdate} disabled={isUpdating}>
          {isUpdating ? (
            <ButtonLoadingSpinner loadingText="Updating..." />
          ) : (
            <>
              <IoSyncOutline style={{ fontSize: 14 }} />
              Update Preferences
            </>
          )}
        </button>
      </div>
      </div>
    </>
  );
};

export default Settings;
