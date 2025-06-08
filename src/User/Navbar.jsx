import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="bg-[#2D1E17] text-white w-full py-3 px-6 shadow-md sticky top-0 z-[1000]">
      <div className="flex justify-between items-center max-w-9xl mx-auto">
        <h3 className="text-7xl ">📖 One IT Library</h3>

        <div
          className="md:hidden cursor-pointer text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars size={22} />
        </div>

        <ul className="hidden md:flex gap-8 list-none">
          <li
            className="cursor-pointer text-base  hover:text-[#fefae0]"
            onClick={() => handleNavigate("/")}
          >
            Dashboard
          </li>
          <li
            className="cursor-pointer text-base hover:text-[#fefae0]"
            onClick={() => handleNavigate("/user/buku")}
          >
            Daftar Buku
          </li>
          <li
            className="cursor-pointer text-base hover:text-[#fefae0]"
            onClick={() => handleNavigate("/user/profil")}
          >
            Profil
          </li>
        </ul>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-[#eee] animate-fadeIn z-[999]">
          <ul className="list-none text-[#2D1E17] font-serif">
            <li
              className="py-4 px-6 border-b border-[#f0eada] text-base cursor-pointer hover:bg-[#fefae0]"
              onClick={() => handleNavigate("/")}
            >
              Dashboard
            </li>
            <li
              className="py-4 px-6 border-b border-[#f0eada] text-30xl cursor-pointer hover:bg-[#fefae0]"
              onClick={() => handleNavigate("/user/buku")}
            >
              Daftar Buku
            </li>
            <li
              className="py-4 px-6 border-b border-[#f0eada] text-base cursor-pointer hover:bg-[#fefae0]"
              onClick={() => handleNavigate("/user/profil")}
            >
              Profil
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
