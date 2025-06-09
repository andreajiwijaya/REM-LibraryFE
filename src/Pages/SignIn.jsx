import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGoogle, FaFacebookF, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

function SignIn({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showPasswordSignIn, setShowPasswordSignIn] = useState(false);
  const [showPasswordSignUp, setShowPasswordSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://rem-library.up.railway.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      alert("Login berhasil!");
      localStorage.setItem("token", data.token);
      onLogin(data.user.role);

      if (data.user.role === "admin") {
        navigate("/");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://rem-library.up.railway.app/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      alert("Registrasi berhasil. Silakan login.");
      setIsSignUp(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        staggerChildren: 0.1
      } 
    },
    exit: { 
      opacity: 0, 
      y: -30, 
      scale: 0.95, 
      transition: { duration: 0.3 } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-8 text-center border-b border-white/10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <FaUser className="text-3xl text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-white/70 text-sm">
              {isSignUp 
                ? "Join our library community today" 
                : "Sign in to access your library"
              }
            </p>
          </div>

          {/* Form Container */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.form
                key={isSignUp ? "signup" : "signin"}
                onSubmit={isSignUp ? handleSignUpSubmit : handleSignInSubmit}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Username Field */}
                <motion.div variants={itemVariants} className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={isSignUp ? signupUsername : username}
                    onChange={(e) =>
                      isSignUp
                        ? setSignupUsername(e.target.value)
                        : setUsername(e.target.value)
                    }
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  />
                </motion.div>

                {/* Email Field (Sign Up only) */}
                {isSignUp && (
                  <motion.div variants={itemVariants} className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                    />
                  </motion.div>
                )}

                {/* Password Field */}
                <motion.div variants={itemVariants} className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    type={
                      isSignUp
                        ? showPasswordSignUp
                          ? "text"
                          : "password"
                        : showPasswordSignIn
                        ? "text"
                        : "password"
                    }
                    placeholder="Password"
                    value={isSignUp ? signupPassword : password}
                    onChange={(e) =>
                      isSignUp
                        ? setSignupPassword(e.target.value)
                        : setPassword(e.target.value)
                    }
                    required
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/70 transition-colors"
                    onClick={() =>
                      isSignUp
                        ? setShowPasswordSignUp(!showPasswordSignUp)
                        : setShowPasswordSignIn(!showPasswordSignIn)
                    }
                  >
                    {isSignUp
                      ? showPasswordSignUp
                        ? <FaEyeSlash className="h-5 w-5" />
                        : <FaEye className="h-5 w-5" />
                      : showPasswordSignIn
                      ? <FaEyeSlash className="h-5 w-5" />
                      : <FaEye className="h-5 w-5" />}
                  </button>
                </motion.div>

                {/* Forgot Password Link */}
                {!isSignUp && (
                  <motion.div variants={itemVariants} className="flex justify-end">
                    <a 
                      href="#" 
                      className="text-sm text-white/60 hover:text-purple-400 transition-colors duration-300"
                    >
                      Lupa Password?
                    </a>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(139, 92, 246, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 ${
                    loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    isSignUp ? "Create Account" : "Sign In"
                  )}
                </motion.button>
              </motion.form>
            </AnimatePresence>

            {/* Toggle Form */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-white/60 text-sm mb-4">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </p>
              <motion.button
                onClick={() => setIsSignUp(!isSignUp)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300 relative group"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
            </motion.div>

            {/* Social Login (Optional decoration) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 pt-8 border-t border-white/10"
            >
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2 text-white/40 text-xs">
                  <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <FaGoogle className="w-3 h-3" />
                  </div>
                  <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <FaFacebookF className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SignIn;