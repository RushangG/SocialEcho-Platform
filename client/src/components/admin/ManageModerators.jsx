import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createModeratorAction,
  getAllUsersAction,
  updateUserRoleAction,
} from "../../redux/actions/adminActions";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import { FaUserShield, FaUserPlus, FaSearch } from "react-icons/fa";

const ManageModerators = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.admin?.users);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Debounce search to avoid too many API calls
  useEffect(() => {
    setLoadingUsers(true);
    const timer = setTimeout(() => {
      const params = {};
      if (roleFilter !== "all") params.role = roleFilter;
      if (searchTerm) params.search = searchTerm;
      dispatch(getAllUsersAction(params)).finally(() => setLoadingUsers(false));
    }, searchTerm ? 500 : 0); // Wait 500ms after user stops typing, but immediate for role filter

    return () => clearTimeout(timer);
  }, [searchTerm, roleFilter, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: "", text: "" });
  };

  const handleCreateModerator = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await dispatch(createModeratorAction(formData));

      if (result.success) {
        setMessage({
          type: "success",
          text: `Moderator "${formData.name}" created successfully!`,
        });
        setFormData({ name: "", email: "", password: "" });
        dispatch(getAllUsersAction());
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to create moderator",
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

  const handleRoleUpdate = async (userId, newRole) => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await dispatch(updateUserRoleAction(userId, newRole));

      if (result.success) {
        setMessage({
          type: "success",
          text: result.data.message || "User role updated successfully!",
        });
        dispatch(getAllUsersAction({ role: roleFilter, search: searchTerm }));
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to update user role",
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

  // Users are already filtered by the API, just use them directly
  const filteredUsers = users;

  return (
    <div className="admin-content-card">
      <div className="admin-header-row">
        <FaUserShield className="admin-header-icon" />
        <h2 className="admin-page-title">Manage Moderators</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6 gap-2">
        <button
          onClick={() => setActiveTab("create")}
          className={`admin-btn-neutral ${
            activeTab === "create"
              ? "admin-tab-item-active"
              : ""
          }`}
        >
          <FaUserPlus className="inline mr-2" />
          Create Moderator
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`admin-btn-neutral ${
            activeTab === "manage"
              ? "admin-tab-item-active"
              : ""
          }`}
        >
          <FaUserShield className="inline mr-2" />
          Manage Users
        </button>
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

      {activeTab === "create" && (
        <form onSubmit={handleCreateModerator} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="admin-field-label"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={20}
              className="admin-input"
              placeholder="Enter moderator name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="admin-field-label"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="admin-input"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="admin-field-label"
            >
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="admin-input"
              placeholder="Enter password (min 6 characters)"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.name || !formData.email || !formData.password}
            className="admin-btn-primary w-full py-3"
          >
            {loading ? (
              <ButtonLoadingSpinner loadingText="Creating moderator..." />
            ) : (
              "Create Moderator"
            )}
          </button>
        </form>
      )}

      {activeTab === "manage" && (
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-input pl-10 pr-4"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="admin-select"
            >
              <option value="all">All Roles</option>
              <option value="general">General Users</option>
              <option value="moderator">Moderators</option>
            </select>
          </div>

          {/* Users List */}
          {loadingUsers ? (
            <div className="text-center py-8">Loading users...</div>
          ) : filteredUsers && filteredUsers.length > 0 ? (
            <div className="admin-table-wrap">
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>
                        User
                      </th>
                      <th>
                        Email
                      </th>
                      <th>
                        Role
                      </th>
                      <th>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="flex items-center">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full mr-3 object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg";
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full mr-3 bg-gray-300 flex items-center justify-center">
                                <span className="text-xs text-gray-600">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="font-medium text-gray-900">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td>
                          <span
                            className={`admin-tag ${
                              user.role === "moderator"
                                ? "admin-tag-info"
                                : user.role === "admin"
                                ? "admin-tag-warn"
                                : "admin-tag-muted"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="text-sm">
                          {user.role === "admin" ? (
                            <span className="text-gray-400">Cannot change</span>
                          ) : user.role === "moderator" ? (
                            <button
                              onClick={() => handleRoleUpdate(user._id, "general")}
                              disabled={loading}
                              className="admin-btn-danger"
                            >
                              Demote to General
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRoleUpdate(user._id, "moderator")}
                              disabled={loading}
                              className="admin-btn-primary"
                            >
                              Promote to Moderator
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageModerators;

