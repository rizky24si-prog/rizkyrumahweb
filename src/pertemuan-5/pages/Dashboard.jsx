import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaEye } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import Swal from "sweetalert2";

export default function Dashboard() {
    const stats = [
        { 
            id: "orders", 
            title: "Total Orders", 
            count: "75", 
            icon: <FaShoppingCart />, 
            color: "from-blue-600 to-blue-800", 
            bgColor: "bg-blue-900/30",
            progress: "w-[75%]", 
            percent: "75%",
            detail: "Detail pesanan: 75 pesanan aktif, 30 pending, 45 diproses"
        },
        { 
            id: "delivered", 
            title: "Total Delivered", 
            count: "175", 
            icon: <FaTruck />, 
            color: "from-green-600 to-green-800", 
            bgColor: "bg-green-900/30",
            progress: "w-[90%]", 
            percent: "90%",
            detail: "175 pesanan telah terkirim, 20 dalam perjalanan"
        },
        { 
            id: "canceled", 
            title: "Total Canceled", 
            count: "40", 
            icon: <FaBan />, 
            color: "from-red-600 to-red-800", 
            bgColor: "bg-red-900/30",
            progress: "w-[20%]", 
            percent: "20%",
            detail: "40 pesanan dibatalkan, 10 karena pembayaran gagal"
        },
        { 
            id: "revenue", 
            title: "Total Revenue", 
            count: "Rp.128", 
            icon: <FaDollarSign />, 
            color: "from-yellow-600 to-yellow-800", 
            bgColor: "bg-yellow-900/30",
            progress: "w-[60%]", 
            percent: "60%",
            detail: "Pendapatan Rp 128 Juta, naik 15% dari bulan lalu"
        },
    ];

    const handleCardClick = (item) => {
        Swal.fire({
            title: `<span class="text-white">Detail ${item.title}</span>`,
            html: `
                <div class="text-left text-gray-300">
                    <p class="mb-2"><strong class="text-blue-400">Total:</strong> ${item.count}</p>
                    <p class="mb-2"><strong class="text-blue-400">Progress:</strong> ${item.percent}</p>
                    <p class="mb-2"><strong class="text-blue-400">Info:</strong> ${item.detail}</p>
                </div>
            `,
            icon: "info",
            background: "#1a1a2e",
            color: "#fff",
            confirmButtonColor: "#3b82f6",
            confirmButtonText: "Tutup",
            showCloseButton: true,
            showConfirmButton: true
        });
    };

    const handleConfirmAction = () => {
        Swal.fire({
            title: "Konfirmasi",
            text: "Apakah Anda ingin mengekspor data?",
            icon: "question",
            background: "#1a1a2e",
            color: "#fff",
            showCancelButton: true,
            confirmButtonColor: "#3b82f6",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "Ya, Ekspor!",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Berhasil!",
                    text: "Data berhasil diekspor",
                    icon: "success",
                    background: "#1a1a2e",
                    color: "#fff",
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        });
    };

    return (
        <div className="p-4 min-h-screen bg-gradient-to-br from-[#0a0a14] to-[#0f0f1a]">
            <PageHeader onExport={handleConfirmAction} />
            
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-5">
                {stats.map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => handleCardClick(item)}
                        className={`
                            ${item.bgColor} rounded-2xl border border-blue-800/30 p-5 
                            hover:shadow-2xl hover:shadow-blue-500/20 
                            transition-all duration-500 
                            transform hover:scale-105 hover:-translate-y-2 
                            cursor-pointer group animate-fadeInUp
                            backdrop-blur-sm
                        `}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`
                                bg-gradient-to-br ${item.color} rounded-xl p-3 text-white text-2xl 
                                shadow-lg shadow-blue-500/30 
                                group-hover:animate-bounce group-hover:shadow-xl
                                transition-all duration-300
                            `}>
                                {item.icon}
                            </div>
                            <span className="text-blue-300/50 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                Monthly
                                <FaEye className="text-xs opacity-0 group-hover:opacity-100 transition-all duration-300" />
                            </span>
                        </div>

                        <div className="flex flex-col mb-4">
                            <span className="text-3xl font-black bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                                {item.count}
                            </span>
                            <span className="text-blue-300/70 text-sm font-medium">{item.title}</span>
                        </div>

                        <div className="w-full bg-blue-900/50 rounded-full h-1.5 mb-1 overflow-hidden">
                            <div className={`
                                bg-gradient-to-r ${item.color} h-1.5 rounded-full ${item.progress} 
                                relative animate-shimmer
                            `}></div>
                        </div>
                        <div className="flex justify-end">
                            <span className="text-[10px] font-bold text-blue-400/70">{item.percent} Target</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}