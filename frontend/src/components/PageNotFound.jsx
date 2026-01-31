import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Frown } from 'lucide-react'; // Using lucide-react icons

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-pink-50 to-rose-100 p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Logo Section */}
        <div className="flex justify-center items-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">4</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">0</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">4</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-pink-200 rounded-full opacity-30 blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-rose-200 rounded-full opacity-20 blur-xl"></div>
          
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-pink-100">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full">
                <Frown className="w-16 h-16 text-pink-500" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
              Page Not Found
            </h1>
            
            <p className="text-gray-600 text-lg mb-2">
              Oops! The page you're looking for seems to have wandered off.
            </p>
            <p className="text-gray-500 mb-8">
              Don't worry, even the best explorers get lost sometimes.
            </p>

            {/* Search Suggestion */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 mb-8 border border-pink-100">
              <div className="flex items-center justify-center space-x-2 text-pink-600">
                <Search className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Double-check the URL or try searching from our homepage
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Home className="w-5 h-5" />
                Back to Homepage
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-pink-600 font-semibold rounded-xl border-2 border-pink-200 hover:border-pink-300 hover:bg-pink-50 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                ← Go Back
              </button>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-6 border-t border-pink-100">
              <p className="text-gray-500 text-sm">
                Need help? <Link to="/contact" className="text-pink-600 hover:text-rose-600 font-medium">Contact Support</Link> or <Link to="/sitemap" className="text-pink-600 hover:text-rose-600 font-medium">View Sitemap</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Footer */}
        <div className="pt-8">
          <div className="flex justify-center space-x-6 opacity-40">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-400"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;