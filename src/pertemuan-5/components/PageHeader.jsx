import { FiBell, FiSettings, FiUser, FiDownload } from "react-icons/fi";

export default function PageHeader({ onExport }) {
    return (
        <div className="flex justify-between items-center mb-6 p-4 bg-[#0f0f1a]/80 backdrop-blur-md rounded-2xl border border-blue-800/30 shadow-lg animate-slideDown">
            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Dashboard
                </h1>
                <p className="text-blue-300/50 text-sm">Welcome back, Admin!</p>
            </div>
            
            <div className="flex gap-3">
                <button 
                    onClick={onExport}
                    className="p-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                >
                    <FiDownload />
                </button>
                <button className="p-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110 hover:-rotate-12">
                    <FiBell />
                </button>
                <button className="p-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                    <FiSettings />
                </button>
                <button className="p-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                    <FiUser />
                </button>
            </div>
        </div>
    );
}