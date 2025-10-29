import axios from "axios";
import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface UserProfile {
  avatar: string | null;
  username: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {


  const [user, setUser] = useState<UserProfile>({
    avatar: null,
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async() => {
    console.log("Saving user profile:", user);
    const token = Cookies.get("token");
    console.log(token);
    
    try {
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }
      const res = await axios.put(
        `http://localhost:5000/api/v1/profile`,
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
      console.log(res);
      
      const userProfile = res.data.userProfile; 
      console.log("Fetched user profile:", userProfile);

      setUser((prevUser: any) => ({
        ...prevUser,
        ...userProfile,
      }));

      toast.success("User details updated successfully");
    } catch (err: any) {
      console.error("Error while updating user profile:", err);
      toast.error(
        err?.response?.data?.message ||
          "Error while updating user profile"
      );
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
      const res = await axios.get("http://localhost:5000/api/v1/user", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const userProfile = res.data.userProfile; 
      console.log("Fetched user profile:", userProfile);

      setUser((prevUser: any) => ({
        ...prevUser,
        ...userProfile,
      }));

      toast.success("User details fetched successfully");
    } catch (err: any) {
      console.error("Error fetching user profile:", err);
      toast.error(
        err?.response?.data?.message ||
          "Error while fetching user profile"
      );
    }
  };

  fetchUser();
}, [setUser]); 


  return (
    <>
        <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md bg-white shadow-sm border border-gray-300 rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your personal information
          </p>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${user.username.toLowerCase()}&background=E0E7FF&color=312E81`              }
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={user?.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-100 focus:border-gray-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user?.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-100 focus:border-gray-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={user?.password}
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-100 focus:border-gray-400 outline-none transition"
            />
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
      <p className="text-gray-500 items-end">Last udpated: 10-10-2025</p>
    </div>
    </>
  );
};

export default Profile;
