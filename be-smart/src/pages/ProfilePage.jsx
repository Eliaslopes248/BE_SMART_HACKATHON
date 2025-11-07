import { useState } from "react";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Enrique Lockhart",
    role: "Community Reporter",
    email: "enrique.lockhart@example.com",
    profilePic: "https://i.pravatar.cc/150?img=47",
    likes: 128,
    dislikes: 24,
    comments: [
      { id: 1, text: "I really like how this project supports affordable housing!" },
      { id: 2, text: "Great feedback on the downtown transit changes." },
      { id: 3, text: "Would love to see more recycling bins in the parks!" },
    ],
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);
  const [preview, setPreview] = useState(user.profilePic);

  const total = user.likes + user.dislikes;
  const likePercent = total > 0 ? (user.likes / total) * 100 : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setPreview(imgUrl);
      setFormData((prev) => ({ ...prev, profilePic: imgUrl }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUser(formData);
    setEditMode(false);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center bg-gradient-to-r from-green-50 via-emerald-100 to-green-200 px-6 py-12 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute -right-24 -top-24 w-[360px] h-[360px] rounded-full bg-green-200 blur-3xl opacity-60 -z-10" />
        <div className="absolute -left-24 -bottom-24 w-[320px] h-[320px] rounded-full bg-emerald-100 blur-3xl opacity-50 -z-10" />

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 ring-1 ring-green-200 max-w-2xl w-full relative z-10">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center">
            <img
              src={preview}
              alt="Profile"
              className="w-32 h-32 rounded-full ring-4 ring-green-500 shadow-md object-cover"
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-green-700 font-medium">{user.role}</p>
            <p className="text-gray-600 text-sm">{user.email}</p>

            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Edit Form */}
          {editMode && (
            <form onSubmit={handleSave} className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              {/* Role (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  name="role"
                  type="text"
                  value={formData.role}
                  disabled
                  className="mt-1 block w-full rounded-md bg-gray-100 px-3 py-2 text-gray-600 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-2 block w-full text-sm text-gray-700 bg-white px-3 py-2 rounded-md cursor-pointer border border-gray-300 hover:border-green-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setPreview(user.profilePic);
                    setFormData(user);
                  }}
                  className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 text-sm font-medium hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Likes/Dislikes Ratio */}
          {!editMode && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">
                Community Feedback
              </h3>
              <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-4 bg-green-500"
                  style={{ width: `${likePercent}%` }}
                ></div>
                <div
                  className="absolute right-0 top-0 h-4 bg-red-400"
                  style={{ width: `${100 - likePercent}%` }}
                ></div>
              </div>
              <p className="text-center mt-2 text-sm text-gray-600">
                👍 {user.likes} likes — 👎 {user.dislikes} dislikes
              </p>
            </div>
          )}

          {/* Recent Comments */}
          {!editMode && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
                Recent Comments
              </h3>
              <div className="space-y-3">
                {user.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                  >
                    <p className="text-gray-700 text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
