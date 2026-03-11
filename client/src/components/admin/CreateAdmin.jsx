import { useState } from "react";
import { useDispatch } from "react-redux";
import { createAdminAction } from "../../redux/actions/adminActions";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import { FaUserPlus } from "react-icons/fa";

const CreateAdmin = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const result = await dispatch(createAdminAction(formData));

    if (result.success) {
      setMessage({
        type: "success",
        text: `Admin user "${formData.username}" created successfully!`,
      });
      setFormData({ username: "", password: "" });
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to create admin user",
      });
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <FaUserPlus className="text-2xl text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Create Admin User</h2>
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
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={20}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter username (3-20 characters)"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
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
          disabled={loading || !formData.username || !formData.password}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
            loading || !formData.username || !formData.password
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <ButtonLoadingSpinner loadingText="Creating admin..." />
          ) : (
            "Create Admin"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateAdmin;

