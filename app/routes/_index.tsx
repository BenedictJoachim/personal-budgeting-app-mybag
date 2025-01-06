

import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 shadow-lg rounded-lg max-w-md">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to MyBag</h1>
        <p className="text-gray-600 mb-6">
          Organize your finances, set goals, and achieve your dreams. Get started by logging in or signing up today.
        </p>
        <div className="space-y-4">
          <Link
            to="/login"
            className="block w-full bg-blue-500 text-white py-2 rounded-md text-lg font-semibold hover:bg-blue-600"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block w-full bg-gray-200 text-gray-800 py-2 rounded-md text-lg font-semibold hover:bg-gray-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
