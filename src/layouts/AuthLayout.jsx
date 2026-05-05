import React from 'react';
import { Outlet } from 'react-router-dom';
import { Stethoscope } from 'lucide-react'; // Menggunakan ikon stetoskop sebagai pengganti

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-main-bg flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12 relative overflow-hidden">
          
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <Stethoscope size={36} className="text-blue-600" />
            </div>
          </div>

          <Outlet />
          
        </div>

        <div className="text-center mt-8 text-txt-primary text-xs font-medium tracking-wide">
          © 2026 DENTAL PLUS • TERINTEGRASI SATUSEHAT
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;