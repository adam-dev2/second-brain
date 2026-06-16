import { useState, type FormEvent } from "react";
import { Lock, Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import LoadingOverlay from "../components/Loading";
import { handleError } from "../utils/handleError";
import { motion } from "motion/react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ResetPassword = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [toggleConfirm, setToggleConfirm] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleToggle = () => setToggle((prev) => !prev);
  const handleToggleConfirm = () => setToggleConfirm((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/v1/auth/reset-password`,
        {
          token: params.token,
          newPassword: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      toast.success("Password reset successful!");

      navigate("/");
    } catch (err: unknown) {
      handleError(err, "Failed to reset password");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Ambient glow orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/[0.04] blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/80 bg-neutral-950">
          <div className="p-8 md:p-10">

            {/* Icon */}
            <div className="w-12 h-12 rounded-[14px] bg-white/[0.06] border border-white/10 flex items-center justify-center mb-6">
              <Lock className="w-5 h-5 text-neutral-500" />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-black text-white tracking-tight mb-1">
              Reset password
            </h1>
            <p className="text-neutral-500 text-sm mb-7">
              Enter your new password below
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">

              {/* New Password */}
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-neutral-300 transition-colors duration-200" />
                <input
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  type={toggle ? "text" : "password"}
                  placeholder="New password"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-neutral-900 border border-white/[0.08] rounded-xl text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-white/25 focus:bg-neutral-800/80 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={handleToggle}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors duration-200"
                >
                  {toggle ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <CheckCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-neutral-300 transition-colors duration-200" />
                <input
                  value={formData.confirmPassword}
                  name="confirmPassword"
                  onChange={handleChange}
                  type={toggleConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-neutral-900 border border-white/[0.08] rounded-xl text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-white/25 focus:bg-neutral-800/80 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={handleToggleConfirm}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors duration-200"
                >
                  {toggleConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Requirements */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 space-y-2">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-neutral-600 uppercase">
                  Password requirements
                </p>
                {[
                  "At least 6 characters",
                  "Passwords must match",
                ].map((rule) => (
                  <div key={rule} className="flex items-center gap-3 group/rule cursor-default">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                    <span className="text-xs text-neutral-600">{rule}</span>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-black text-sm tracking-tight hover:bg-neutral-200 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Resetting..." : "Reset password"}
                {!loading && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="h-px bg-white/[0.06] my-5" />

            {/* Back link */}
            <p className="text-center text-xs text-neutral-600">
              <button
                onClick={() => navigate("/")}
                className="hover:text-neutral-300 transition-colors duration-200 cursor-pointer"
              >
                ← Back to sign in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>

    {loading && <LoadingOverlay />}
  </>
);
};

export default ResetPassword;
