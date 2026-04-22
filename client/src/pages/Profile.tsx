import axios from "axios";
import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { handleError } from "../utils/handleError";
import { loadingAtom } from "../store/atoms/loading";
import LoadingOverlay from "../components/Loading";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Layout from "../layouts/Layout";



const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface UserProfile {
  avatar: string | null;
  username: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
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
  const Loading = useRecoilValue(loadingAtom);
  const setloading = useSetRecoilState(loadingAtom);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setShowModal(true);
  };
  const handleConfirmAndSave = async () => {
    const token = Cookies.get("token");

    if (!currentPassword.trim()) {
      toast.error("Please enter your current password.");
      return;
    }
    setloading(true);
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
      setloading(false)
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");
      setloading(true);
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
      }finally {
        setloading(false);
      }
    };

    fetchUser();
  },[]);

  return (
  <Layout>
    <div className="flex flex-col items-center">

      {/* CARD */}
      <div className="w-full max-w-md bg-neutral-900 border border-white/[0.08] rounded-2xl p-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white">Profile</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Manage your personal information
          </p>
        </div>

        {/* AVATAR */}
        <div className="flex justify-center mb-6">
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${user.username.toLowerCase()}&background=111827&color=ffffff`
            }
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border border-white/[0.08]"
          />
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-5">

          {/* USERNAME */}
          <div>
            <label className="block text-xs text-neutral-400 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={user?.username}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/20"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs text-neutral-400 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user?.email}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/20"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs text-neutral-400 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={toggle ? "text" : "password"}
                name="password"
                value={user?.password}
                placeholder="Enter new password"
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/20"
              />
              <button
                type="button"
                onClick={() => setToggle((t) => !t)}
                className="absolute right-3 top-2 text-neutral-400 hover:text-white"
              >
                {toggle ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="w-full mt-8 bg-white text-black py-2 rounded-lg text-sm font-medium hover:scale-[1.02] transition"
        >
          Save Changes
        </button>
      </div>

      {/* FOOTER TEXT */}
      <p className="text-neutral-500 text-xs mt-4">
        Last updated: 10-10-2025
      </p>
    </div>

    {/* MODAL */}
    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="bg-neutral-900 border border-white/[0.08] rounded-xl w-full max-w-sm p-6">

          <h2 className="text-sm font-medium text-white mb-2">
            Confirm Current Password
          </h2>

          <p className="text-xs text-neutral-500 mb-4">
            Enter your current password to confirm changes.
          </p>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className="w-full bg-neutral-950 border border-white/[0.08] rounded-lg px-3 py-2 mb-4 text-sm text-white outline-none"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-3 py-1.5 text-xs rounded bg-white/[0.06] text-white hover:bg-white/[0.1]"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmAndSave}
              disabled={loading}
              className={`px-3 py-1.5 text-xs rounded ${
                loading
                  ? "bg-white/[0.2] text-white/50"
                  : "bg-white text-black hover:scale-[1.03]"
              }`}
            >
              {loading ? "Verifying..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    )}

    {Loading && <LoadingOverlay />}
  </Layout>
);
};

export default Profile;
