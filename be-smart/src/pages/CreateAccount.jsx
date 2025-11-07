import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { SiGreenhouse } from "react-icons/si";

export default function CreateAccount() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    // TODO: send form data to backend or Firebase
    alert("Account created successfully!");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center bg-gradient-to-r from-green-50 via-emerald-100 to-green-200 px-6 py-12 lg:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -right-24 -top-24 w-[360px] h-[360px] rounded-full bg-green-200 blur-3xl opacity-60 -z-10" />
        <div className="absolute -left-24 -bottom-24 w-[320px] h-[320px] rounded-full bg-emerald-100 blur-3xl opacity-50 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-green-100 blur-3xl opacity-40 -z-10" />

        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <SiGreenhouse className="h-10 w-10 text-green-600" />
            <span className="text-lg font-semibold text-gray-800">
              RE:Greensboro
            </span>
          </div>

          <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-700">
            Create Your Account
          </h2>
        </div>

        {/* Create Account Form */}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white/80 backdrop-blur-lg rounded-xl p-8 shadow-lg ring-1 ring-green-200 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="John"
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder="Doe"
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Home Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Home Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                placeholder="123 Main St, Greensboro, NC"
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className={`mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  error
                    ? "focus:ring-red-500 border-red-400"
                    : "focus:ring-green-500 focus:border-transparent"
                } text-sm`}
              />
              {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
              )}
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition"
              >
                Create Account
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-green-600 hover:text-green-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}