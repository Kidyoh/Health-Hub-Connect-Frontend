"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // For displaying error messages
  const Router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Clear previous errors
    setError(null);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // Redirect to dashboard upon successful login
      Router.push('/dashboard');
    } else {
      const errorMessage = await response.json();
      setError(errorMessage.error || 'An error occurred during login.');
      console.error('Login error:', errorMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center gap-5 max-w-lg shadow-2xl shadow-gray-900 h-screen hover:shadow-gray-300 bg-white mx-auto rounded-md text-gray-900"
    >
      <h3 className="text-2xl">Please Log In!</h3>

      <label className="block">
        <span className="block text-sm font-medium text-slate-700">Email</span>
        <input
          required
          type="email"
          name="email"
          className="mt-1 px-3 py-4 w-[350px] md:w-[450px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
          placeholder="Enter your email address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="block">
        <span className="block text-sm font-medium text-slate-700">Password</span>
        <input
          required
          type="password"
          name="password"
          className="mt-1 w-[350px] md:w-[450px] px-3 py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {/* Error message */}
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <span className="block w-full mr-auto ml-7">
        Don't have an account?{" "}
        <Link className="text-blue-700 font-bold" href="/signup">
          Sign Up
        </Link>
      </span>

      <button
        className="bg-[#53c28b] text-white rounded-md p-[15px] w-[90%]"
        type="submit"
      >
        Log In
      </button>
    </form>
  );
};

export default SignIn;
