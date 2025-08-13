import React from "react";
import { Link } from "react-router-dom"; // Optional: if using React Router

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-xl text-gray-800 mb-2 text-center">Page not found</p>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* If using React Router */}
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Go Home
        </Link>

        {/* If not using React Router, use <a href="/">Go Home</a> instead */}
      </div>
    </div>
  );
};

export default NotFound;
