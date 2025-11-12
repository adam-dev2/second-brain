import axios from "axios";
import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleError } from "../utils/handleError";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface UserProfile {
  avatar: string | null;
  username: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    avatar: null,
    username: "",
    email: "",
    password: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("No token found. Please log in again.");
      navigate("/auth");
      return;
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setShowModal(true);
  };
  const handleConfirmAndSave = async () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("No token found. Please log in again.");
      navigate("/auth");
      return;
    }

    if (!currentPassword.trim()) {
      toast.error("Please enter your current password.");
      return;
    }

    try {
      setLoading(true);
      const verifyRes = await axios.post(
        `${backendUrl}/api/v1/user/userconfirmation`,
        { password: currentPassword },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (verifyRes.status === 200) {
        const res = await axios.put(
          `${backendUrl}/api/v1/user/profile`,
          {
            username: user.username,
            email: user.email,
            password: user.password,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const userProfile = res.data.userProfile;
        setUser((prevUser) => ({
          ...prevUser,
          ...userProfile,
        }));

        toast.success("Profile updated successfully!");
        setShowModal(false);
        setCurrentPassword("");
      }
    } catch (err: unknown) {
      handleError(err, "Incorrect current password or update failed");
      console.error("Error verifying or updating:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      try {
        const res = await axios.get(`${backendUrl}/api/v1/user`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const userProfile = res.data.userProfile;
        setUser((prevUser) => ({
          ...prevUser,
          ...userProfile,
        }));
      } catch (err: unknown) {
        handleError(err, "Error while Fetching Profile");
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-md bg-white shadow-sm border border-gray-300 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-800">Profile</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your personal information</p>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user.username.toLowerCase()}&background=E0E7FF&color=312E81`
                }
                alt="avatar"
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-200 shadow-sm"
              />
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={user?.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-100 focus:border-gray-400 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={user?.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-100 focus:border-gray-400 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={toggle ? "text" : "password"}
                  name="password"
                  value={user?.password}
                  placeholder="Enter new password"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-100 focus:border-gray-400 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setToggle((t) => !t)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {toggle ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full mt-8 bg-gray-600 text-white py-2.5 rounded-lg font-medium hover:bg-gray-700 transition active:scale-[0.98]"
          >
            Save Changes
          </button>
        </div>
        <p className="text-gray-500 items-end">Last updated: 10-10-2025</p>
      </div>

      {/* ✅ Password Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-md w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Confirm Current Password</h2>
            <p className="text-sm text-gray-500 mb-4">
              Enter your current password to confirm profile changes.
            </p>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-gray-100 focus:border-gray-400 outline-none transition placeholder:opacity-55"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAndSave}
                disabled={loading}
                className={`cursor-pointer px-4 py-2 rounded-lg text-white font-medium ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-800"
                }`}
              >
                {loading ? "Verifying..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
