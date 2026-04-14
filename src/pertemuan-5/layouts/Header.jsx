import { useState } from "react";
import { FaBell, FaSearch, FaChevronDown, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";
import Swal from "sweetalert2";

export default function Header() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const handleNotificationClick = () => {
        Swal.fire({
            title: '<span class="text-white">Notifikasi</span>',
            html: `
                <div class="text-left text-gray-300 space-y-3">
                    <div class="p-3 bg-blue-900/30 rounded-lg animate-pulse">
                        <p class="text-sm"><strong class="text-blue-400">📦 Pesanan Baru!</strong></p>
                        <p class="text-xs text-gray-400">Anda memiliki 50 pesanan baru</p>
                    </div>
                    <div class="p-3 bg-blue-900/30 rounded-lg">
                        <p class="text-sm"><strong class="text-blue-400">✅ Pembayaran Diterima</strong></p>
                        <p class="text-xs text-gray-400">Rp 5.000.000 telah masuk</p>
                    </div>
                    <div class="p-3 bg-blue-900/30 rounded-lg">
                        <p class="text-sm"><strong class="text-blue-400">⭐ Ulasan Baru</strong></p>
                        <p class="text-xs text-gray-400">5 ulasan baru untuk restoran Anda</p>
                    </div>
                </div>
            `,
            background: "#1a1a2e",
            color: "#fff",
            confirmButtonColor: "#3b82f6",
            confirmButtonText: "Tutup",
            width: "400px",
            showCloseButton: true,
            backdrop: `
                rgba(0,0,0,0.8)
                url("/images/nyan-cat.gif")
                left top
                no-repeat
            `
        });
    };

    const handleChartClick = () => {
        Swal.fire({
            title: '<span class="text-white">Statistik Dashboard</span>',
            html: `
                <div class="text-gray-300">
                    <p class="mb-2">📈 Total Orders: <strong class="text-blue-400">75</strong></p>
                    <p class="mb-2">🚚 Total Delivered: <strong class="text-green-400">175</strong></p>
                    <p class="mb-2">❌ Total Canceled: <strong class="text-red-400">40</strong></p>
                    <p class="mb-2">💰 Total Revenue: <strong class="text-yellow-400">Rp 128 Juta</strong></p>
                </div>
            `,
            icon: "info",
            background: "#1a1a2e",
            color: "#fff",
            confirmButtonColor: "#3b82f6",
            confirmButtonText: "Tutup"
        });
    };

    const handleSettingsClick = () => {
        Swal.fire({
            title: '<span class="text-white">⚙️ Pengaturan</span>',
            html: `
                <div class="text-left text-gray-300">
                    <div class="mb-3">
                        <label class="flex items-center gap-2 mb-2">
                            <input type="checkbox" class="form-checkbox text-blue-500" /> Notifikasi Email
                        </label>
                        <label class="flex items-center gap-2 mb-2">
                            <input type="checkbox" class="form-checkbox text-blue-500" /> Mode Gelap
                        </label>
                        <label class="flex items-center gap-2">
                            <input type="checkbox" class="form-checkbox text-blue-500" /> Auto Refresh
                        </label>
                    </div>
                </div>
            `,
            background: "#1a1a2e",
            color: "#fff",
            confirmButtonColor: "#3b82f6",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "Simpan",
            cancelButtonText: "Batal",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Berhasil!",
                    text: "Pengaturan telah disimpan",
                    icon: "success",
                    background: "#1a1a2e",
                    color: "#fff",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            Swal.fire({
                title: '<span class="text-white">🔍 Hasil Pencarian</span>',
                text: `Anda mencari: "${searchValue}"`,
                icon: "info",
                background: "#1a1a2e",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
                confirmButtonText: "OK"
            });
        } else {
            Swal.fire({
                title: "Peringatan!",
                text: "Masukkan kata kunci pencarian",
                icon: "warning",
                background: "#1a1a2e",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
                timer: 1500,
                showConfirmButton: false
            });
        }
    };

    const handleMyProfile = () => {
        Swal.fire({
            title: '<span class="text-white">👤 Profil Saya</span>',
            html: `
                <div class="flex flex-col items-center">
                    <img src="images/profil.jpeg" class="w-24 h-24 rounded-full border-4 border-blue-500 mb-3 animate-pulse" />
                    <p class="text-white font-bold">Kby</p>
                    <p class="text-gray-400 text-sm">Super Admin</p>
                    <p class="text-gray-500 text-xs mt-2">kby@sedap.com</p>
                </div>
            `,
            background: "#1a1a2e",
            color: "#fff",
            confirmButtonColor: "#3b82f6",
            confirmButtonText: "Tutup"
        });
    };

    const handleSettings = () => {
        Swal.fire({
            title: '<span class="text-white">⚙️ Pengaturan Akun</span>',
            text: "Fitur pengaturan akun akan segera hadir!",
            icon: "info",
            background: "#1a1a2e",
            color: "#fff",
            confirmButtonColor: "#3b82f6"
        });
    };

    const handleLogout = () => {
        Swal.fire({
            title: '<span class="text-white">Yakin ingin keluar?</span>',
            text: "Anda akan keluar dari dashboard",
            icon: "warning",
            background: "#1a1a2e",
            color: "#fff",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#3b82f6",
            confirmButtonText: "Ya, Keluar!",
            cancelButtonText: "Batal",
            showClass: {
                popup: 'animate__animated animate__shakeX'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Keluar!",
                    text: "Anda telah keluar dari dashboard",
                    icon: "success",
                    background: "#1a1a2e",
                    color: "#fff",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };

    return (
        <div className="flex justify-between items-center p-4 bg-[#0f0f1a]/90 backdrop-blur-md sticky top-0 z-50 border-b border-blue-800/50 shadow-lg shadow-blue-500/10 animate-slideDown">
            
            <form onSubmit={handleSearch} className="relative w-full max-w-lg group">
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search Here..."
                    className="border border-blue-800/50 p-2.5 pr-10 bg-[#1a1a2e] text-white w-full rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300 placeholder:text-gray-500"
                />
                <button type="submit">
                    <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-all duration-300 hover:scale-110" />
                </button>
            </form>

            <div className="flex items-center space-x-4">
                
                <div 
                    onClick={handleNotificationClick}
                    className="relative p-3 bg-blue-900/30 rounded-2xl text-blue-400 cursor-pointer hover:bg-blue-800/50 hover:scale-110 hover:rotate-12 transition-all duration-300 group"
                >
                    <FaBell className="group-hover:animate-bounce" />
                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white animate-pulse">
                        50
                    </span>
                </div>

                <div 
                    onClick={handleChartClick}
                    className="p-3 bg-blue-900/30 rounded-2xl cursor-pointer hover:bg-blue-800/50 hover:scale-110 hover:-rotate-12 transition-all duration-300 group"
                >
                    <FcAreaChart className="group-hover:animate-spin" />
                </div>

                <div 
                    onClick={handleSettingsClick}
                    className="p-3 bg-blue-900/30 rounded-2xl text-blue-400 cursor-pointer hover:bg-blue-800/50 hover:scale-110 transition-all duration-300 group"
                >
                    <SlSettings className="group-hover:animate-spin-slow" />
                </div>
             
                <div className="relative">
                    <div 
                        className={`flex items-center space-x-4 border-l pl-4 border-blue-800/50 cursor-pointer p-1 rounded-lg transition-all duration-300 ${isProfileOpen ? 'bg-blue-900/30 shadow-lg' : 'hover:bg-blue-900/30 hover:scale-105'}`}
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="flex flex-col text-right hidden md:block">
                            <span className="text-blue-300 text-sm">
                                Hello, <b className="text-blue-400 mr-1">Kby</b>
                            </span>
                            <span className="text-[10px] text-blue-500/50 font-medium uppercase tracking-wider">Super Admin</span>
                        </div>
                        <img
                            src="images/profil.jpeg"
                            className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-lg shadow-blue-500/30 hover:scale-110 transition-all duration-300"
                            alt="Profile Avatar"
                        />
                        <FaChevronDown className={`text-blue-400 text-xs transition-all duration-500 ${isProfileOpen ? 'rotate-180 text-blue-300' : ''}`} />
                    </div>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-[#1a1a2e] rounded-xl shadow-2xl shadow-blue-500/20 border border-blue-800/50 py-2 animate-fadeInUp z-50 backdrop-blur-md">
                            <div className="px-4 py-2 border-b border-blue-800/50 mb-1">
                                <p className="text-xs text-blue-400">Manage Account</p>
                            </div>
                            <button 
                                onClick={handleMyProfile}
                                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-blue-300 hover:bg-blue-800/30 hover:text-white transition-all duration-300 hover:translate-x-1"
                            >
                                <FaUser className="text-xs" /> <span>My Profile</span>
                            </button>
                            <button 
                                onClick={handleSettings}
                                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-blue-300 hover:bg-blue-800/30 hover:text-white transition-all duration-300 hover:translate-x-1"
                            >
                                <FaCog className="text-xs" /> <span>Settings</span>
                            </button>
                            <div className="border-t border-blue-800/50 mt-1 pt-1">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all duration-300 hover:translate-x-1"
                                >
                                    <FaSignOutAlt className="text-xs" /> <span className="font-bold">Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}