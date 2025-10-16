import React from "react";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-8">
            <span className="text-sm font-medium text-blue-700">
              🚀 Streamline Your Workflow
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </span>
            <span className="block text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-600 mt-4">
              Manage Everything in One Place
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your application management with our intuitive dashboard. 
            Track progress, analyze data, and make informed decisions effortlessly.
          </p>

          <div className="mb-48 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/applications"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Get Started
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            
            <a
              href="/contact"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl hover:border-blue-300 transform hover:-translate-y-1 transition-all duration-300"
            >
              <span className="mr-2 group-hover:text-blue-600 transition-colors">👥</span>
              Contact Team
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your applications efficiently and effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Real-time Analytics",
                description: "Monitor application progress with live data and comprehensive analytics dashboard.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: "🔒",
                title: "Secure & Compliant",
                description: "Enterprise-grade security with end-to-end encryption and compliance certifications.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: "🎯",
                title: "Intuitive Dashboard",
                description: "Clean, modern interface designed for productivity and ease of use.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: "👥",
                title: "Team Collaboration",
                description: "Work seamlessly with your team with role-based access and sharing.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: "⚙️",
                title: "Customizable Workflows",
                description: "Adapt the platform to your specific processes and requirements.",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: "🔔",
                title: "Smart Notifications",
                description: "Stay updated with intelligent alerts and notification system.",
                color: "from-teal-500 to-green-500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 transform group-hover:scale-110 transition-transform duration-300 text-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Home;