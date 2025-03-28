import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import placeholder from "../assets/placeholder.png";
import API from "../utils/axiosInstance";


const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    trailer_number: user?.trailer_number || "",
    truck_number: user?.truck_number || "",
    profile_picture: null,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const data = new FormData();
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    data.append("trailer_number", formData.trailer_number);
    data.append("truck_number", formData.truck_number);
    if (formData.profile_picture) {
      data.append("profile_picture", formData.profile_picture);
    }

    try {
      const response = await API.put("/profile/", data);

      if (response.status === 200) {
        setSuccess("Profile updated successfully!");
        setUser(response.data);
      }

    } catch (error) {
      console.log(`Failed to update user data. Refresh page. ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-primary">Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
        <div className="flex items-center mb-6 flex-col sm:flex-row">
          <img
            src={user?.profile_picture || placeholder}
            alt="Profile"
            className="w-20 h-20 rounded-full mb-4 sm:mb-0 sm:mr-4"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold">{user?.first_name} {user?.last_name}</h2>
            <p className="text-gray-600">Driver Number: {user?.driver_number}</p>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Trailer Number</label>
            <input
              type="text"
              value={formData.trailer_number}
              onChange={(e) => setFormData({ ...formData, trailer_number: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Truck Number</label>
            <input
              type="text"
              value={formData.truck_number}
              onChange={(e) => setFormData({ ...formData, truck_number: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, profile_picture: e.target.files[0] })}
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="w-full bg-primary text-white p-2 rounded hover:bg-opacity-90">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;