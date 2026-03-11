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
    <div className="w-full max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <FaUserShield className="text-2xl text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Manage Moderators</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 font-medium ${
            activeTab === "create"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaUserPlus className="inline mr-2" />
          Create Moderator
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`px-4 py-2 font-medium ${
            activeTab === "manage"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaUserShield className="inline mr-2" />
          Manage Users
        </button>
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

      {activeTab === "create" && (
        <form onSubmit={handleCreateModerator} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter moderator name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password (min 6 characters)"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.name || !formData.email || !formData.password}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              loading || !formData.name || !formData.email || !formData.password
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
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
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === "moderator"
                                ? "bg-blue-100 text-blue-800"
                                : user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {user.role === "admin" ? (
                            <span className="text-gray-400">Cannot change</span>
                          ) : user.role === "moderator" ? (
                            <button
                              onClick={() => handleRoleUpdate(user._id, "general")}
                              disabled={loading}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Demote to General
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRoleUpdate(user._id, "moderator")}
                              disabled={loading}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
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

