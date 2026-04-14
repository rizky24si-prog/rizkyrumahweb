import { useState } from "react";
import { FiHome, FiShoppingCart, FiUsers, FiPlus, FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";

export default function SideBar() {
    const [activeMenu, setActiveMenu] = useState("Dashboard");

    const menuItems = [
        { id: "Dashboard", name: "Dashboard", icon: <FiHome /> },
        { id: "Orders", name: "Orders", icon: <FiShoppingCart /> },
        { id: "Customers", name: "Customers", icon: <FiUsers /> },
    ];

    const handleAddMenu = () => {
        Swal.fire({
            title: '<span class="text-white">Tambah Menu Baru</span>',
            html: `
                <input id="menuName" class="swal2-input" placeholder="Nama Menu">
                <select id="menuIcon" class="swal2-select">
                    <option value="home">Home</option>
                    <option value="orders">Orders</option>
                    <option value="customers">Customers</option>
                </select>
            `,
            background: "#1a1a2e",
            color: "#fff",
            confirmButtonColor: "#3b82f6",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "Tambah",
            cancelButtonText: "Batal",
            showCancelButton: true,
            preConfirm: () => {
                const name = document.getElementById("menuName").value;
                const icon = document.getElementById("menuIcon").value;
                if (!name) {
                    Swal.showValidationMessage("Nama menu harus diisi!");
                }
                return { name, icon };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Berhasil!",
                    text: `Menu "${result.value.name}" ditambahkan`,
                    icon: "success",
                    background: "#1a1a2e",
                    color: "#fff",
                    confirmButtonColor: "#3b82f6"
                });
            }
        });
    };

    const handleLogout = () => {
        Swal.fire({
            title: "Yakin ingin keluar?",
            text: "Anda akan keluar dari dashboard",
            icon: "warning",
            background: "#1a1a2e",
            color: "#fff",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#3b82f6",
            confirmButtonText: "Ya, Keluar!",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Keluar!", "Anda telah keluar.", "success");
            }
        });
    };

    return (
        <div className="flex min-h-screen w-90 flex-col bg-[#0f0f1a] p-10 shadow-2xl border-r border-blue-900/50 transition-all duration-500 animate-fadeIn">
            
            <div className="flex flex-col mb-12 group">
                <span className="font-poppins text-[44px] font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent animate-pulse">
                    Sedap <b className="text-blue-500 animate-bounce inline-block">.</b>
                </span>
                <span className="font-medium text-blue-300/70 text-sm mt-2 tracking-wide uppercase">
                    MODERN ADMIN DASHBOARD
                </span>
            </div>

            <div className="flex-grow">
                <ul className="space-y-3">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <div 
                                onClick={() => setActiveMenu(item.id)}
                                className={`
                                    flex cursor-pointer items-center rounded-2xl p-4 transition-all duration-500 transform hover:scale-105 hover:translate-x-2
                                    ${activeMenu === item.id 
                                        ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/30 animate-pulseRing" 
                                        : "text-blue-300/70 hover:bg-blue-900/30 hover:text-white hover:shadow-md"
                                    }
                                `}
                            >
                                <span className={`text-xl mr-4 transition-all duration-300 group-hover:rotate-12 ${activeMenu === item.id ? "text-white" : "text-blue-400"}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                                
                                {activeMenu === item.id && (
                                    <div className="ml-auto w-1.5 h-8 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50 animate-ping"></div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-10">
                <div className="bg-gradient-to-br from-blue-900 to-blue-950 p-6 rounded-3xl shadow-2xl shadow-blue-500/20 mb-8 relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-500">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/20 rounded-full animate-spin-slow"></div>
                    <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-blue-400/10 rounded-full animate-pulse"></div>
                    
                    <div className="relative z-10">
                        <p className="text-xs font-medium text-blue-200/80 leading-relaxed mb-4 text-center">
                            Please organize your menus through button below!
                        </p>
                        <div 
                            onClick={handleAddMenu}
                            className="flex justify-center items-center py-2.5 bg-blue-500/20 backdrop-blur-md rounded-xl cursor-pointer hover:bg-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-blue-500/30 group"
                        >
                            <span className="text-blue-300 flex items-center font-bold text-xs uppercase tracking-tighter">
                                <FiPlus className="mr-2 text-lg animate-spin-slow group-hover:animate-none" /> Add Menus
                            </span>
                        </div>
                    </div>
                </div>
                
                <div onClick={handleLogout} className="flex flex-col px-2 cursor-pointer group hover:translate-x-2 transition-all duration-300">
                    <span className="font-bold text-blue-300 text-xs flex items-center gap-2">
                        <FiLogOut className="text-red-400 group-hover:animate-bounce" />
                        Sedap Restaurant Admin
                    </span>
                    <p className="text-[10px] text-blue-500/50 mt-1 uppercase tracking-widest font-medium">
                        &copy; 2026 Version 2.0.1
                    </p>
                </div>
            </div>
        </div>
    );
}