import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
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
      onLogin("admin");          // Kirim role admin ke parent
      navigate("/");             // Redirect ke home admin
    } else if (username === "user" && password === "user123") {
      alert("Login User berhasil!");
      onLogin("user");           // Kirim role user ke parent
      navigate("/user/dashboard"); // Redirect ke dashboard user
    } else {
      alert("Username atau password salah!");
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    alert("Akun berhasil dibuat (simulasi). Silakan login.");
    setIsSignUp(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#fefae0] font-serif px-4 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://png.pngtree.com/background/20230527/original/pngtree-an-old-bookcase-in-a-library-picture-image_2760144.jpg')",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-3xl bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center relative min-h-[350px]">
          <AnimatePresence mode="wait">
            {!isSignUp ? (
              <motion.form
                key="signin"
                onSubmit={handleSignInSubmit}
                className="w-full max-w-xs flex flex-col items-center absolute"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-[#2D1E17] mb-4">Sign In</h2>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 mb-3 rounded-lg bg-[#bcbcbc] text-[#333] text-sm outline-none"
                />
                <div className="w-full relative mb-3">
                  <input
                    type={showPasswordSignIn ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#bcbcbc] text-[#333] text-sm outline-none pr-10"
                  />
                  <div
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-[#2D1E17]"
                    onClick={() => setShowPasswordSignIn(!showPasswordSignIn)}
                  >
                    {showPasswordSignIn ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                <div className="flex gap-3 my-3">
                  <div className="bg-[#2D1E17] text-white w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-pointer hover:scale-110 transition-transform">
                    <FaGoogle />
                  </div>
                  <div className="bg-[#2D1E17] text-white w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-pointer hover:scale-110 transition-transform">
                    <FaFacebookF />
                  </div>
                </div>
                <p className="text-xs text-[#2D1E17] mb-3">
                  Lupa akun? <a href="#" className="text-[#646464] hover:underline">Klik di sini</a>
                </p>
                <button
                  type="submit"
                  className="bg-[#2D1E17] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#1e140e] w-full"
                >
                  Masuk
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                onSubmit={handleSignUpSubmit}
                className="w-full max-w-xs flex flex-col items-center absolute"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-[#2D1E17] mb-4">Sign Up</h2>
                <input
                  type="text"
                  placeholder="Username"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 mb-3 rounded-lg bg-[#bcbcbc] text-[#333] text-sm outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 mb-3 rounded-lg bg-[#bcbcbc] text-[#333] text-sm outline-none"
                />
                <div className="w-full relative mb-3">
                  <input
                    type={showPasswordSignUp ? "text" : "password"}
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#bcbcbc] text-[#333] text-sm outline-none pr-10"
                  />
                  <div
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-[#2D1E17]"
                    onClick={() => setShowPasswordSignUp(!showPasswordSignUp)}
                  >
                    {showPasswordSignUp ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-[#2D1E17] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#1e140e] w-full"
                >
                  Daftar
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 bg-[#2D1E17] text-white flex flex-col items-center justify-center p-8 rounded-tr-xl rounded-br-xl shadow-lg select-none">
          {!isSignUp ? (
            <>
              <h2 className="text-3xl font-semibold mb-4">Halo, Sobat!</h2>
              <p className="text-sm text-[#bfbfbf] mb-8 max-w-xs text-center">
                Belum punya akun? Daftar sekarang, gratis!
              </p>
              <button
                onClick={() => setIsSignUp(true)}
                className="bg-[#fefae0] text-[#2D1E17] px-6 py-2 rounded-full font-semibold hover:bg-[#fff7d1] transition-colors"
              >
                Buat Akun
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-semibold mb-4">Selamat Datang!</h2>
              <p className="text-sm text-[#bfbfbf] mb-8 max-w-xs text-center">
                Sudah punya akun? Yuk masuk.
              </p>
              <button
                onClick={() => setIsSignUp(false)}
                className="bg-[#fefae0] text-[#2D1E17] px-6 py-2 rounded-full font-semibold hover:bg-[#fff7d1] transition-colors"
              >
                Masuk
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
