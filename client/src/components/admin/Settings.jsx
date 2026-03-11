import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getServicePreferencesAction,
  updateServicePreferencesAction,
} from "../../redux/actions/adminActions";

const Settings = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
      setIsLoading(false);
    }
  }, [servicePreferences]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setIsSuccess(false);
    try {
      await dispatch(
        updateServicePreferencesAction({
          usePerspectiveAPI,
          categoryFilteringServiceProvider,
          categoryFilteringRequestTimeout,
        })
      );
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !servicePreferences) {
    return <div className="admin-content-card">Loading...</div>;
  }

  return (
    <div className="admin-content-card">
      <h2 className="admin-page-title mb-4 border-b pb-2 text-center">
        Service Preferences
      </h2>

      {isSuccess && (
        <div className="admin-message admin-message-success mb-4">
          Service Preferences updated successfully!
        </div>
      )}

      <div className="flex items-center mb-4">
        <div className="admin-muted-copy">Use Perspective API for content moderation</div>
        <div className="ml-auto">
          <input
            className="admin-checkbox"
            type="checkbox"
            checked={usePerspectiveAPI}
            onChange={(e) => setUsePerspectiveAPI(e.target.checked)}
          />
        </div>
      </div>

      <div className="flex items-center mb-4">
        <div className="admin-muted-copy">Category filtering service provider</div>
        <div className="ml-auto">
          <select
            className="admin-select"
            value={categoryFilteringServiceProvider}
            onChange={(e) =>
              setCategoryFilteringServiceProvider(e.target.value)
            }
          >
            <option value="">Select a provider</option>
            <option value="TextRazor">TextRazor</option>
            <option value="InterfaceAPI">InterfaceAPI</option>
            <option value="ClassifierAPI">ClassifierAPI</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <div className="admin-muted-copy">Category filtering request timeout (ms)</div>
        <div className="ml-auto">
          <input
            className="admin-input"
            type="number"
            value={categoryFilteringRequestTimeout}
            min={0}
            max={500000}
            required
            onChange={(e) => {
              setCategoryFilteringRequestTimeout(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="admin-btn-primary"
          onClick={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
