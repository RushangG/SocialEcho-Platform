import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getLogsAction,
  deleteLogsAction,
} from "../../redux/actions/adminActions";
import CurrentTime from "../shared/CurrentTime";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import CommonLoading from "../loader/CommonLoading";
import { FcRefresh } from "react-icons/fc";

const Logs = () => {
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

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
    } finally {
      setClearing(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await fetchLogs();
    } catch (error) {}
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs?.length]);

  if (loading || !logs) {
    return (
      <div className="admin-content-card flex items-center justify-center">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="admin-content-card">
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h1 className="admin-section-title">
            User Activity Logs
          </h1>
          <CurrentTime />
        </div>

        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
          <div className="admin-inline-note">{`Showing ${logs.length} items from the last 7 days`}</div>

          <div className="flex items-center space-x-2">
            <button className="admin-btn-neutral" onClick={handleRefresh}>
              <FcRefresh />
            </button>
            <button
              className={`admin-btn-danger ${logs.length === 0 ? "hidden" : ""}`}
              onClick={handleCleanup}
              disabled={clearing || logs.length === 0}
            >
              {clearing ? (
                <ButtonLoadingSpinner loadingText="Clearing..." />
              ) : (
                "Clear Logs"
              )}
            </button>
          </div>
        </div>

        {!loading ? (
          logs.length === 0 ? (
            <div className="admin-text-muted text-lg">No logs found</div>
          ) : (
            <>
              <div className="admin-table-wrap">
                <div className="admin-table-scroll h-[430px]">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Message</th>
                        <th>Email Used</th>
                        <th>Level</th>
                        <th>Context Data</th>
                      </tr>
                    </thead>
                    <tbody>
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td>
                        <span className="flex flex-col justify-center items-center text-center font-mono">
                          <span>{log.relativeTimestamp}</span>
                          <span className="text-xs">{log.formattedTimestamp}</span>
                        </span>
                      </td>
                      <td
                        className={`${
                          log.level === "info"
                            ? "text-blue-500"
                            : log.level === "warn"
                            ? "text-orange-500"
                            : log.level === "error"
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        <span className="capitalize">{log.type}: </span>
                        <span>{log.message}</span>
                      </td>
                      <td>{log.email}</td>
                      <td>
                        <span
                          className={`admin-tag ${
                            log.level === "error"
                              ? "admin-tag-error"
                              : log.level === "warn"
                              ? "admin-tag-warn"
                              : "admin-tag-info"
                          }`}
                        >
                          {log.level}
                        </span>
                      </td>
                      <td>
                        <ul className="list-disc list-inside">
                          {log.contextData &&
                            Object.entries(log.contextData).map(
                              ([key, value]) => (
                                <li key={key}>
                                  <span className="font-medium text-blue-500">
                                    {key}:{" "}
                                  </span>
                                  {value}
                                </li>
                              )
                            )}
                        </ul>
                      </td>
                    </tr>
                  ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-center text-sm italic text-gray-600 mt-3">
                logs are automatically deleted after 7 days
              </div>
            </>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Logs;
