"use client";

import { registerUser } from "@/actions/register";
import { useState } from "react";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="••••••••"
          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
        />
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
