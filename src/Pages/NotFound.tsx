import React from "react";
import { Link, Navigate } from "react-router";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "../atoms/auth.atom";

const NotFound: React.FC = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show 404 page only for authenticated users
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-500 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go Home
          </Link>

          <Link
            to="/about"
            className="inline-block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            About Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
