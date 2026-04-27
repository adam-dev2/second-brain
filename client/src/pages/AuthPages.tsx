import React, { useState, type FormEvent } from "react";
import { Mail, Lock, User, ArrowRight, EyeOff, Eye } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loadingAtom } from "../store/atoms/loading";
import { SignupFormAtom } from "../store/atoms/signupform";
import LoadingOverlay from "../components/Loading";
import { handleError } from "../utils/handleError";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AuthPages = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const formData = useRecoilValue(SignupFormAtom);
  const setFormData = useSetRecoilState(SignupFormAtom);
  const loading = useRecoilValue(loadingAtom);
  const setLoading = useSetRecoilState(loadingAtom);

  const handleToggle = () => setToggle((t) => !t);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogle = () => {
    window.location.href = `${backendUrl}/api/v1/auth/google`;
  };

  const handleGithub = () => {
    window.location.href = `${backendUrl}/api/v1/auth/github`;
  };

  const handleForgetPassword = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${backendUrl}/api/v1/auth/forgot-password`,
        { email: formData.email },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Reset link sent to your mail");
    } catch (err: unknown) {
      handleError(err, "Error while sending reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!isLogin) {
        await axios.post(
          `${backendUrl}/api/v1/auth/signup`,
          { username: formData.username, email: formData.email, password: formData.password },
          { headers: { "Content-Type": "application/json" } }
        );
        toast.success("Signup successful! Please log in.");
        setIsLogin(true);
      } else {
        await login({ email: formData.email, password: formData.password });
        // toast.success("Login successful!");
        navigate("/home/dashboard");
      }
    } catch (err) {
      handleError(err, !isLogin ? "Error while signing up" : "Error while logging in");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Bookmark tweets, YouTube links & more",
    "Minimal & clean — zero clutter",
    "Elastic search across everything",
  ];

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
          className="relative w-full max-w-5xl"
        >
          <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/80">

            {/* ── LEFT PANEL ── */}
            <div className="hidden md:flex relative bg-neutral-900 p-10 flex-col justify-between overflow-hidden">
              {/* Corner accents */}
              <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-white/10 rounded-bl-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-white/10 rounded-tr-2xl" />

              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isLogin ? "lc" : "sc"}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35 }}
                  >
                    <p className="text-[10px] font-semibold tracking-[0.22em] text-neutral-500 uppercase mb-3">
                      {isLogin ? "Back again" : "Starting fresh"}
                    </p>
                    <h2 className="text-4xl font-black text-white leading-[1.05] tracking-tight mb-4 whitespace-pre-line">
                      {isLogin ? "Welcome\nback." : "Your second\nbrain."}
                    </h2>
                    <p className="text-neutral-400 text-sm leading-relaxed max-w-[260px]">
                      {isLogin
                        ? "Everything you saved is right where you left it."
                        : "One space for everything your mind wants to remember."}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Feature list */}
                <div className="mt-10 space-y-2.5">
                  {features.map((f, i) => (
                    <motion.div
                      key={f}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + i * 0.1, duration: 0.4 }}
                      className="flex items-center gap-3 group cursor-default"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white transition-colors duration-300 shrink-0" />
                      <span className="text-sm text-neutral-500 group-hover:text-neutral-200 transition-colors duration-300">
                        {f}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
                className="text-neutral-700 text-xs"
              >
                Trusted by 1,200+ knowledge workers
              </motion.p>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="bg-neutral-950 p-8 md:p-10 flex flex-col justify-center">

              {/* Heading */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "lh" : "sh"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-7"
                >
                  <h1 className="text-2xl font-black text-white tracking-tight">
                    {isLogin ? "Sign in" : "Create account"}
                  </h1>
                  <p className="text-neutral-500 text-sm mt-1">
                    {isLogin
                      ? "Enter your credentials to continue"
                      : "Join thousands building their second brain"}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  {
                    label: "Google",
                    handler: handleGoogle,
                    icon: (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    ),
                  },
                  {
                    label: "GitHub",
                    handler: handleGithub,
                    icon: (
                      <svg className="w-4 h-4 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                    ),
                  },
                ].map(({ label, handler, icon }) => (
                  <motion.button
                    key={label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handler}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/[0.08] hover:border-white/20 hover:bg-neutral-800 transition-all duration-200 cursor-pointer"
                  >
                    {icon}
                    <span className="text-sm font-medium text-neutral-300">{label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Divider */}
              <div className="relative flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-[10px] text-neutral-700 tracking-widest uppercase">or</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              {/* Form */}
              <div className="flex flex-col gap-3">

                {/* Username — animated in/out */}
                <AnimatePresence initial={false}>
                  {!isLogin && (
                    <motion.div
                      key="uname"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-neutral-300 transition-all duration-200" />
                        <input
                          value={formData.username}
                          name="username"
                          onChange={handleChange}
                          type="text"
                          placeholder="Full name"
                          className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-white/[0.08] rounded-xl text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-white/25 focus:bg-neutral-800/80 transition-all duration-200"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-neutral-300 transition-colors duration-200" />
                  <input
                    value={formData.email}
                    name="email"
                    onChange={handleChange}
                    type="email"
                    placeholder="Email address"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-white/[0.08] rounded-xl text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-white/25 focus:bg-neutral-800/80 transition-all duration-200"
                  />
                </div>

                {/* Password */}
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-neutral-300 transition-colors duration-200" />
                  <input
                    value={formData.password}
                    name="password"
                    onChange={handleChange}
                    type={toggle ? "text" : "password"}
                    placeholder="Password"
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

                {/* Forgot password */}
                <AnimatePresence>
                  {isLogin && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-end"
                    >
                      <button
                        type="button"
                        onClick={handleForgetPassword}
                        className="text-xs text-neutral-600 hover:text-neutral-300 transition-colors duration-200"
                      >
                        Forgot password?
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <form onSubmit={handleSignup}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-bold text-sm tracking-tight hover:bg-neutral-200 transition-all duration-200 group cursor-pointer"
                  >
                    {isLogin ? "Sign in" : "Create account"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </motion.button>
                </form>
              </div>

              {/* Toggle auth mode */}
              <p className="text-center text-xs text-neutral-600 mt-6">
                {isLogin ? "No account?" : "Already a member?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-neutral-300 font-semibold hover:text-white underline underline-offset-2 transition-colors duration-200 cursor-pointer"
                >
                  {isLogin ? "Sign up free" : "Sign in"}
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

export default AuthPages;