import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
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

  const navigate = useNavigate();

  const handleSignInSubmit = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      alert("Login Admin berhasil!");
      onLogin("admin");
      navigate("/");
    } else if (username === "user" && password === "user123") {
      alert("Login User berhasil!");
      onLogin("user");
      navigate("/user/dashboard");
    } else {
      alert("Username atau password salah!");
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    alert("Akun berhasil dibuat (simulasi). Silakan login.");
    setIsSignUp(false);
  };

  const formVariants = {
    hidden: { opacity: 0, x: isSignUp ? 50 : -50, scale: 0.9 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, x: isSignUp ? -50 : 50, scale: 0.9, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const panelVariants = {
    hidden: { opacity: 0, x: isSignUp ? -50 : 50, scale: 0.9 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, x: isSignUp ? 50 : -50, scale: 0.9, transition: { duration: 0.6, ease: "easeOut" } },
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#fefae0] font-serif px-4 bg-cover bg-center overflow-hidden relative"
      style={{
        backgroundImage:
          "url('https://png.pngtree.com/background/20230527/original/pngtree-an-old-bookcase-in-a-library-picture-image_2760144.jpg')",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay */}

      <div className="flex flex-col md:flex-row w-full max-w-3xl bg-[#fff9e6]/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden z-10">
        {/* Left Section (Sign In/Sign Up Form) */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center relative min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.form
              key={isSignUp ? "signup" : "signin"}
              onSubmit={isSignUp ? handleSignUpSubmit : handleSignInSubmit}
              className="w-full max-w-xs flex flex-col items-center absolute"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-9xl md:text-4xl font-bold text-[#2D1E17] mb-4">
                {isSignUp ? "Sign Up" : "Sign In"}
              </h2>

              {/* Username */}
              <div className="w-full relative mb-3">
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
                  className="w-full px-10 py-2 rounded-lg bg-[#bcbcbc] text-[#333] text-sm outline-none focus:ring-2 focus:ring-[#2D1E17]/50"
                />
                <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#2D1E17]" />
              </div>

              {/* Email (Sign Up only) */}
              {isSignUp && (
                <div className="w-full relative mb-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="w-full px-10 py-2 rounded-lg bg-[#bcbcbc] text-[#333] text-sm outline-none focus:ring-2 focus:ring-[#2D1E17]/50"
                  />
                  <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#2D1E17]" />
                </div>
              )}

              {/* Password */}
              <div className="w-full relative mb-3">
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
                  className="w-full px-10 py-2 rounded-lg bg-[#bcbcbc] text-[#333] text-sm outline-none pr-10 focus:ring-2 focus:ring-[#2D1E17]/50"
                />
                <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#2D1E17]" />
                <div
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-[#2D1E17] hover:text-[#555]"
                  onClick={() =>
                    isSignUp
                      ? setShowPasswordSignUp(!showPasswordSignUp)
                      : setShowPasswordSignIn(!showPasswordSignIn)
                  }
                >
                  {isSignUp
                    ? showPasswordSignUp
                      ? <FaEyeSlash />
                      : <FaEye />
                    : showPasswordSignIn
                    ? <FaEyeSlash />
                    : <FaEye />}
                </div>
              </div>

              {/* Social Media Icons */}
              {!isSignUp && (
                <div className="flex gap-3 my-3">
                  <motion.div
                    whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(0,0,0,0.2)" }}
                    className="bg-[#2D1E17] text-[#fff9e6] w-9 h-9 flex items-center justify-center rounded-full text-sm cursor-pointer"
                  >
                    <FaGoogle />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(0,0,0,0.2)" }}
                    className="bg-[#2D1E17] text-[#fff9e6] w-9 h-9 flex items-center justify-center rounded-full text-sm cursor-pointer"
                  >
                    <FaFacebookF />
                  </motion.div>
                </div>
              )}

              {/* Lupa akun */}
              {!isSignUp && (
                <p className="text-xs text-[#2D1E17] mb-3">
                  Lupa akun?{" "}
                  <a href="#" className="text-[#646464] hover:underline hover:text-[#2D1E17] transition-colors">
                    Klik di sini
                  </a>
                </p>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#2D1E17] text-[#fff9e6] px-8 py-2 rounded-full text-base font-semibold hover:bg-[#1e140e] w-full transition-all duration-300"
              >
                {isSignUp ? "Sing Up" : "Sign In"}
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </div>

        {/* Right Section (Toggle Panel) */}
        <div className="w-full md:w-1/2 bg-[#2D1E17] text-[#fff9e6] flex flex-col items-center justify-center p-8 rounded-tr-xl rounded-br-xl shadow-lg select-none">
          <AnimatePresence mode="wait">
            {!isSignUp ? (
              <motion.div
                key="welcome-back"
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-center text-center"
              >
                <h2 className="text-3xl font-bold mb-4">Selamat Datang !</h2>
                <p className="text-sm text-[#fff9e6] mb-8 max-w-xs">
                  Apakah anda Sudah punya akun ?
                </p>
                <motion.button
                  onClick={() => setIsSignUp(true)}
                  whileHover={{ scale: 1.05, backgroundColor: "#fff7d1", color: "#2D1E17" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#fefae0] text-[#2D1E17] px-8 py-2 rounded-full font-semibold transition-all duration-300 shadow-md"
                >
                  Sign Up
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="create-account"
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-center text-center"
              >
                <h2 className="text-3xl font-bold mb-4">Selamat Datang !</h2>
                <p className="text-sm text-[#fefae0] mb-8 max-w-xs">
                  Apakah anda Belum punya akun ?
                </p>
                <motion.button
                  onClick={() => setIsSignUp(false)}
                  whileHover={{ scale: 1.05, backgroundColor: "#fff7d1", color: "#2D1E17" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#fefae0] text-[#2D1E17] px-8 py-2 rounded-full font-semibold transition-all duration-300 shadow-md"
                >
                  Sign In
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default SignIn;