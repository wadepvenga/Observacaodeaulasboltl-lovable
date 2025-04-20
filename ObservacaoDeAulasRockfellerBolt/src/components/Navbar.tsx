import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiUpload, FiFileText, FiClock } from 'react-icons/fi';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-rockfeller-yellow shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/rockfeller-icon.svg" alt="Rockfeller" className="h-10 w-auto" />
            <div className="h-8 w-px bg-white/20" />
            <span className="text-xl font-bold text-white">
              Observação de aulas Rockfeller
            </span>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/upload"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${isActive('/upload')
                  ? 'bg-white text-rockfeller-blue-primary'
                  : 'text-white hover:bg-white/10'
                }`}
            >
              <FiUpload className="w-5 h-5" />
              <span>Upload</span>
            </Link>
            <Link
              to="/analysis"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${isActive('/analysis')
                  ? 'bg-white text-rockfeller-blue-primary'
                  : 'text-white hover:bg-white/10'
                }`}
            >
              <FiFileText className="w-5 h-5" />
              <span>Analysis</span>
            </Link>
            <Link
              to="/history"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${isActive('/history')
                  ? 'bg-white text-rockfeller-blue-primary'
                  : 'text-white hover:bg-white/10'
                }`}
            >
              <FiClock className="w-5 h-5" />
              <span>History</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};