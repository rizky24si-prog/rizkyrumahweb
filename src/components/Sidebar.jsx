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
  Gift,
  MessageCircle,
  Tag,
  History,
  BarChart3,
  X 
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/appointments', name: 'Janji Temu', icon: Calendar },
    { path: '/patients', name: 'Data Pasien', icon: Users },
    { path: '/dokter', name: 'Data Dokter', icon: Stethoscope },
    { path: '/examinations', name: 'Pemeriksaan', icon: FileText },
    { path: '/inventory', name: 'Stok Barang', icon: Package },
    { path: '/loyalty', name: 'Loyalty & Reward', icon: Gift },
    { path: '/promotions', name: 'Promosi', icon: Tag },
    { path: '/reports', name: 'Laporan', icon: BarChart3 },
    { path: '/surveys', name: 'Survei', icon: MessageCircle },
    { path: '/activity-logs', name: 'Activity Logs', icon: History },
    { path: '/finance', name: 'Keuangan', icon: Wallet },
    { path: '/settings', name: 'Pengaturan', icon: Settings },
  ];

return (
    <>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        transform transition-transform duration-300 ease-in-out
        w-64 bg-white border-r border-gray-200 flex flex-col font-sans
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-primary">
                Dental Plus
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mt-1">
                Klinik Gigi Digital
              </p>
            </div>
            <button className="lg:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-10">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-white shadow-lg shadow-gray  -200' 
                    : 'text-txt-primary hover:bg-gray-50 hover:text-primary'
                  }
                `}
              >
                <item.icon size={20} className="mr-3" />
                {item.name}
              </NavLink>
            ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-50">
          <div className="bg-main-bg border border-blue-50 rounded-xl p-3">
            <p className="text-[11px] text-gray-500 text-center leading-relaxed font-medium">
              Terintegrasi dengan<br />
              <span className="font-bold text-blue-600">SATUSEHAT</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;