"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function NavLinks({ role }: { role: string }) {
    const pathname = usePathname();

    const feedActive = pathname === "/posts" || pathname.startsWith("/post/");
    const usersActive = pathname === "/users";

    return (
        <div className="hidden md:flex gap-8 absolute left-1/2 -translate-x-1/2">
            <Link
                href="/posts"
                className={`font-medium transition-colors py-5 ${feedActive ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-indigo-600"}`}
            >
                Feed
            </Link>
            {role === "super_admin" && (
                <Link
                    href="/users"
                    className={`font-medium transition-colors py-5 ${usersActive ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-indigo-600"}`}
                >
                    Manage Users
                </Link>
            )}
        </div>
    );
}

export function UserDropdown({ role, name, children }: { role: string, name: string, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors select-none"
            >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                {role.toUpperCase()}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 rounded-t-xl">
                        <p className="text-xs text-gray-500 mb-0.5">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                    </div>
                    <div className="p-2">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}
