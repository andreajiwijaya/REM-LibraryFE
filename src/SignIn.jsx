import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import "./index.css";

export default function SignIn({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "1234") {
      onLogin();
    } else {
      alert("Username atau password salah!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* Form Section */}
        {!isSignUp ? (
          <form onSubmit={handleSignInSubmit} className="form-left">
            <h2 className="auth-title font-dancing">Sign In</h2>
            <input
              type="text"
              placeholder="Username"
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="relative w-80">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-[#3e1f0d]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <div className="auth-social">
              <FaGoogle size={25} className="text-[#3e1f0d] cursor-pointer" />
              <FaFacebookF size={25} className="text-[#3e1f0d] cursor-pointer" />
            </div>
            <button type="submit" className="auth-button">Sign In</button>
          </form>
        ) : (
          <div className="form-left">
            <h2 className="auth-title font-dancing">Sign Up</h2>
            <input type="text" placeholder="Username" className="auth-input" />
            <input type="email" placeholder="Email" className="auth-input" />
            <div className="relative w-80">
              <input
                type={showSignupPassword ? "text" : "password"}
                placeholder="Password"
                className="auth-input"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
              <div
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-[#3e1f0d]"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
              >
                {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <div className="auth-social">
              <FaGoogle size={25} className="text-[#3e1f0d] cursor-pointer" />
              <FaFacebookF size={25} className="text-[#3e1f0d] cursor-pointer" />
            </div>
            <button className="auth-button">Sign Up</button>
          </div>
        )}

        {/* Panel */}
        <div className="auth-panel right-0">
          <h2 className="text-4xl font-bold mb-4">Selamat Datang!</h2>
          <p className="text-xl mb-3">
            {isSignUp ? "Apakah anda sudah punya akun?" : "Apakah anda belum punya akun?"}
          </p>
          <button onClick={() => setIsSignUp(!isSignUp)} className="panel-button mt-4">
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
