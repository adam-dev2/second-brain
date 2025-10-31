import { useState, type FormEvent } from 'react';
import { Mail, Lock, User, ArrowRight,EyeOff,Eye } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loadingAtom } from "../store/atoms/loading";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AuthPages = () => {
  const navigate = useNavigate();
  const [toggle,setToggle] = useState(false)
  const [isLogin, setIsLogin] = useState(false);
  const loading = useRecoilValue(loadingAtom)
  const setLoading = useSetRecoilState(loadingAtom)
    const [formData,setFormData] = useState({
        username: "",
        email: "",
        password: ""
    })
    const handleToggle = () => {
      setToggle(toggle => !toggle)
    }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
const handleSignup = async(e: FormEvent<HTMLFormElement>) =>{
      e.preventDefault();
    if(!isLogin) {
      setLoading(true)
        try{
            const response:any = await axios.post(`${backendUrl}/api/v1/signup`,
            {
                username: formData.username,
                email:formData.email,
                password:formData.password
            },
            {
                headers:{
                    'Content-Type':'application/json'
                }
            },
            );
            toast.success('Signed in Successfull')
            setIsLogin(true)
        }catch(err:any) {
            console.log(err);
            toast.error(err?.response?.data?.message)
        } finally{
          setLoading(false)
        }
        
    } else {
        try{
            const response = await axios.post(`${backendUrl}/api/v1/login`,
            {
                email:formData.email,
                password:formData.password
            },
            {
              withCredentials:true,
                headers:{
                    'Content-Type':'application/json'
                }
            }
            );
            console.log(response.data);
            toast.success('Login Successfull')
            setTimeout(()=>{
              navigate('/home/dashboard')
            },1000)
        }catch(err:any) {
            console.log(err);
            toast.error(err?.response?.data?.message)
        } finally{
          setLoading(false)
        }
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-600 via-zinc-600 to-gray-700 flex items-center justify-center p-4 w-full overflow-hidden m-auto scroll-m-0">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[500px]">
          {/* Left Side - Form */}
          <div className="hidden md:flex bg-linear-to-br from-gray-600 via-zinc-600 to-gray-700 p-5 flex-col justify-center items-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="mb-8">
                <h2 className="text-4xl font-bold mb-4">
                  {isLogin ? 'Hello, Friend!' : 'Welcome !!!!'}
                </h2>
                <p className="text-lg text-white/90 max-w-md mx-auto leading-relaxed">
                  {isLogin 
                    ? 'Reconnect with your thoughts, bookmarks, and ideas.' 
                    : 'Stop DM’ing yourself links. I got you this.. heheh'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-12">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all">
                    <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-3"></div>
                    <div className="h-2 bg-white/30 rounded w-3/4 mx-auto"></div>
                  </div>
                ))}
              </div>

              <div className="mt-12 space-y-3">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Bookmark your tweet,yt links etc...</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">Clean Ui Minimalistic vibes</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">Implemented Elastic search</span>
                </div>
              </div>
            </div>
          </div>


          <div className="p-6 md:p-6 flex flex-col justify-center">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {isLogin ? 'Welcome Back' : 'Get Started'}
                </h1>
              </div>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Enter your credentials to access your account' 
                  : 'Create an account to get started with us'}
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={formData.username}
                    name='username'
                    onChange={handleChange}
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    value={formData.email}
                    name='email'
                    onChange={handleChange}
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    value={formData.password}
                    name='password'
                    onChange={handleChange}
                    type={toggle?'text':'password'}
                    placeholder="Password"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={handleToggle}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {toggle ? <EyeOff className="w-5 h-5 cursor-pointer" /> : <Eye className="w-5 h-5 cursor-pointer" />}
                </button>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500 accent-gray-900" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-gray-600 hover:text-gray-700 font-medium">
                    Forgot Password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="cursor-pointer w-full bg-linear-to-r from-gray-600 via-zinc-600 to-gray-700 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
              >
                {isLogin ? 'LogIn' : 'Create Account'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-gray-600 font-semibold underline cursor-pointer hover:text-gray-700 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </p>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-medium text-gray-700">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  <span className="font-medium text-gray-700">GitHub</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPages