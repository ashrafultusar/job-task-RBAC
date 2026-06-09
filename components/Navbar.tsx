"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const role = session?.user?.role;
  const name = session?.user?.name || "";

  const handleLogOut = async () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
    await signOut({ callbackUrl: "/login" });
  };

  // Click outside to close desktop dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link href="/" className="text-xl font-black text-indigo-800 hover:text-indigo-600 transition-colors shrink-0 flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-base shadow-sm shadow-indigo-200">R</div>
            RBAC Platform
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/posts"
              className={`transition-colors ${isActive("/") || isActive("/posts") ? "text-indigo-600 font-bold" : "text-gray-600 hover:text-indigo-600"}`}
            >
              Feed
            </Link>
            {role === "super_admin" && (
              <Link
                href="/admin"
                className={`transition-colors ${isActive("/admin") ? "text-indigo-600 font-bold" : "text-gray-600 hover:text-indigo-600"}`}
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Right Side (Auth) */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100 focus:outline-none"
                >
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-wide shadow-2xs">
                    {role?.replace("_", " ")}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 bg-gray-50/50 rounded-xl border border-gray-50">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Logged in as</p>
                      <p className="font-bold text-gray-800 text-sm truncate">{name}</p>
                    </div>

                    <hr className="border-gray-100 my-1" />

                    <button
                      onClick={handleLogOut}
                      className="w-full text-left text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                      </svg>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-xl transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-semibold bg-indigo-600 text-white rounded-xl px-4 py-2 hover:bg-indigo-700 shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors"
              aria-label="Open Menu"
            >
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================
          SMOOTH SLIDING MOBILE SIDEBAR WITH ACTIVE LINKS
         ======================================================== */}
      <div className={`fixed inset-0 h-screen w-screen z-[9999] md:hidden transition-all duration-300 ${isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"}`}>

        {/* Smooth Backdrop Fade */}
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"}`}
        />

        {/* Smooth Sliding Panel */}
        <div className={`absolute top-0 right-0 h-full w-80 bg-white shadow-2xl flex flex-col justify-between border-l border-gray-100 transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

          {/* Content Top Wrap */}
          <div className="p-6 flex flex-col gap-6 overflow-y-auto">

            {/* Sidebar Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-sm">R</div>
                <span className="font-bold text-slate-800 tracking-tight text-base">RBAC Menu</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors border border-gray-100"
                aria-label="Close Menu"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Account Info Profile */}
            {session && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-2">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">User Account</p>
                  <p className="font-bold text-slate-800 text-base truncate leading-snug mt-0.5">{name}</p>
                </div>
                <div className="flex">
                  <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100/60 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                    {role?.replace("_", " ")}
                  </span>
                </div>
              </div>
            )}

            {/* Navigation Section (Active Route Logic Applied Here) */}
            <div className="flex flex-col gap-1.5 mt-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">Navigation</p>

              {/* Feed Link */}
              <Link
                onClick={() => setIsOpen(false)}
                href="/posts"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive("/") || isActive("/posts")
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100/50"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Feed
              </Link>

              {/* Admin Dashboard Link */}
              {role === "super_admin" && (
                <Link
                  onClick={() => setIsOpen(false)}
                  href="/admin"
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive("/admin")
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100/50"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                  </svg>
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Bottom Sticky Action Footer */}
          <div className="p-6 border-t border-gray-100 bg-slate-50/50">
            {session ? (
              <button
                onClick={handleLogOut}
                className="w-full text-sm font-bold text-red-600 bg-white hover:bg-red-50 hover:text-red-700 px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200/80 hover:border-red-200 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
                Sign Out
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link onClick={() => setIsOpen(false)} href="/login" className="w-full text-center text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 py-2.5 rounded-xl transition border border-gray-200 shadow-sm">
                  Log in
                </Link>
                <Link onClick={() => setIsOpen(false)} href="/register" className="w-full text-center text-sm font-bold bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 transition">
                  Sign up
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}