import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Stethoscope, 
  FileText, 
  Package, 
  Wallet,
  Settings,
  X 
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const menuItems = [
    { path: '/', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/appointments', name: 'Janji Temu', icon: Calendar },
    { path: '/patients', name: 'Data Pasien', icon: Users },
    { path: '/doctors', name: 'Data Dokter', icon: Stethoscope },
    { path: '/examinations', name: 'Pemeriksaan', icon: FileText },
    { path: '/inventory', name: 'Stok Barang', icon: Package },
    { path: '/finance', name: 'Keuangan', icon: Wallet },
    { path: '/settings', name: 'Pengaturan', icon: Settings },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        transform transition-transform duration-200 ease-in-out
        w-64 bg-white border-r border-gray-200 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dental Plus
            </h1>
            <p className="text-xs text-gray-500 mt-1">Klinik Gigi Digital</p>
          </div>
          <button 
            className="lg:hidden text-gray-500"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon size={20} className="mr-3" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 text-center">
              Terintegrasi dengan<br />
              <span className="font-semibold text-blue-600">SATUSEHAT</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;