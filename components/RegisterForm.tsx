"use client";

import { registerUser } from "@/actions/register";
import { useState } from "react";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      await registerUser(formData);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          name="name"
          type="text"
          required
          placeholder="John Doe"
          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative mt-1">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            placeholder="••••••••"
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black pr-12"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          name="role"
          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-black"
        >
          <option value="user">Regular User</option>
          <option value="moderator">Moderator</option>
          <option value="super_admin">Super Admin</option>
          <option value="guest">Guest</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Pick a role to test permissions.
        </p>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
      >
        {isLoading ? "Signing up..." : "Sign Up"}
      </button>

      <div className="text-center mt-4 text-sm">
        <span className="text-gray-600">Already have an account? </span>
        <a
          href="/login"
          className="text-indigo-600 font-semibold hover:text-indigo-500"
        >
          Sign in
        </a>
      </div>
    </form>
  );
}
