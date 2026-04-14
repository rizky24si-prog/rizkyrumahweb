import { createRoot } from "react-dom/client";
import './assets/tailwind.css';
import Header from "./layouts/Header";
import Sidebar from "./layouts/SideBar";
import PageHeader from "./components/PageHeader";
import Dashboard from "./pages/Dashboard";
import { FaHome } from "react-icons/fa";

createRoot(document.getElementById("root")).render(
  <div className="flex min-h-screen bg-gray-50">
    {/* 1. Sidebar ada di sisi kiri */}
    <Sidebar />

    {/* 2. Container kanan untuk Header dan Halaman Utama */}
    <div className="flex-1 flex flex-col">
      {/* Header ada di paling atas area konten */}
      <Header />

      {/* Area konten utama (Dashboard) */}
      <main className="flex-1">
        {/* Hapus <PageHeader/> di sini karena sudah ada di dalam Dashboard.jsx */}
        <Dashboard />
      </main>
    </div>
  </div>
);