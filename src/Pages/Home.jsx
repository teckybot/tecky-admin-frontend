import React from "react";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px">
      {/* Hero Section */}
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
          Welcome to Admin Panel
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Manage your applications efficiently with an easy-to-use interface.
          Track progress, view details, and stay organized all in one place.
        </p>
        <div className="space-x-4">
          <a
            href="/applications"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            View Applications
          </a>
          <a
            href="/contact"
            className="border border-blue-600 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-100 transition"
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl">
        <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Easy Tracking</h3>
          <p className="text-gray-600 text-sm">
            Keep an eye on every application’s progress with real-time updates.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Secure Access</h3>
          <p className="text-gray-600 text-sm">
            All your data is safe and accessible only to authorized users.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Simple Interface</h3>
          <p className="text-gray-600 text-sm">
            A clean, intuitive design that lets you focus on what matters most.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
