import React from "react";
import { Link } from "react-router-dom"; // Optional

const Forbidden = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-yellow-500 mb-4">403</h1>
        <p className="text-xl text-gray-800 mb-2 text-center">Access Forbidden</p>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>

        {/* If using React Router */}
        <Link
          to="/"
          className="inline-block bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
