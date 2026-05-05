import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  User, 
  LogOut, 
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil teks dari URL (misal: "/data-pasien" jadi "Data Pasien")
  const currentPath = location.pathname.split('/').pop() || 'Dashboard';
  const displayTitle = currentPath.replace(/-/g, ' ');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-main-bg/80 backdrop-blur-md sticky top-0 z-20 font-sans">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 mr-2 text-gray-500 lg:hidden hover:bg-gray-100 rounded-lg"
            >
              <Menu size={22} />
            </button>
            
            {/* Breadcrumbs Otomatis dari URL */}
            <div className="flex items-center text-sm font-medium tracking-tight">
              <span className="text-gray-400">Pages</span>
              <ChevronRight size={14} className="mx-2 text-gray-300" />
              <span className="text-txt-primary font-bold capitalize">
                {displayTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifikasi */}
            <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-1 pr-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-gray-100"
              >
                <div className="w-8 h-8 bg-gradient-to-tr from-main-bg to-main-bg rounded-full flex items-center justify-center shadow-sm">
                  <User size={16} className="text-primary" />
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-gray-800 leading-none">drg. Rizky</p>
                    <p className="text-[10px] font-medium text-gray-500 mt-1">Administrator</p>
                </div>
                <ChevronDown size={14} className="hidden md:block text-gray-400" />
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1">
                      <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                        <User size={16} className="mr-3 text-gray-400" />
                        Profil Saya
                      </Link>
                      <Link to="/settings" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                        <Settings size={16} className="mr-3 text-gray-400" />
                        Pengaturan
                      </Link>
                      <hr className="my-1 border-gray-50" />
                      <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors">
                        <LogOut size={16} className="mr-3" />
                        Keluar
                      </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;