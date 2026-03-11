import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommunitiesAction, getCommunitiesAction } from "../../redux/actions/adminActions";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import { FaUsers, FaImage } from "react-icons/fa";

const AddCommunities = () => {
  const dispatch = useDispatch();
  const communities = useSelector((state) => state.admin?.communities);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    banner: null,
    useDefaultData: false,
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "banner") {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, banner: file });
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (e.target.name === "useDefaultData") {
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
      const formDataToSend = new FormData();

      if (formData.useDefaultData) {
        formDataToSend.append("useDefaultData", "true");
      } else {
        if (formData.banner) {
          formDataToSend.append("banner", formData.banner);
        }
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
      }

      const result = await dispatch(addCommunitiesAction(formDataToSend));

      if (result.success) {
        setMessage({
          type: "success",
          text: `Successfully added ${result.data.added} community/communities!`,
        });
        setFormData({ name: "", description: "", banner: null, useDefaultData: false });
        setPreview(null);
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to add communities",
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
        <FaUsers className="text-2xl text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Add Communities</h2>
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
            Use default communities from JSON file
          </label>
        </div>

        {!formData.useDefaultData && (
          <>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Community Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter community name"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter community description"
              />
            </div>

            <div>
              <label
                htmlFor="banner"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Banner Image
              </label>
              <div className="flex items-center gap-4">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaImage className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    id="banner"
                    name="banner"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
                {preview && (
                  <div className="w-32 h-32 border rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading || (!formData.useDefaultData && !formData.name)}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
            loading || (!formData.useDefaultData && !formData.name)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <ButtonLoadingSpinner loadingText="Adding communities..." />
          ) : (
            formData.useDefaultData ? "Add Default Communities" : "Add Community"
          )}
        </button>
      </form>

      {communities && communities.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Existing Communities ({communities.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {communities.slice(0, 6).map((community) => (
              <div
                key={community._id}
                className="border rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                {community.banner && (
                  <img
                    src={community.banner}
                    alt={community.name}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                )}
                <p className="text-sm font-medium truncate">{community.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCommunities;

