import React, { useState } from 'react';
import tournamentData from './tour.json';

const GuestView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  const regions = ['All', 'International', 'Pacific', 'Europe, Middle East, Africa', 'North & South America', 'South Korea', 'China', 'India', 'Asia', 'Brazil', 'EMEA', 'North America', 'Oceania', 'Europe', 'Japan'];

  const filteredTournaments = tournamentData.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || !selectedRegion || tournament.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const formatPrizePool = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0d0d2b] p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ff4655] to-[#ff8a5c] bg-clip-text text-transparent">
          VALORANT Tournaments
        </h1>
        <p className="text-white/50 mt-2">Daftar Turnamen Valorant Seluruh Dunia</p>
        <div className="w-24 h-0.5 bg-gradient-to-r from-[#ff4655] to-transparent mx-auto mt-4"></div>
      </div>

      <div className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Cari turnamen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-[#1a1a2e]/80 text-white px-5 py-3 rounded-xl border border-[#ff4655]/30 focus:border-[#ff4655] focus:outline-none transition-all"
        />
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="bg-[#1a1a2e]/80 text-white px-5 py-3 rounded-xl border border-[#ff4655]/30 focus:border-[#ff4655] focus:outline-none cursor-pointer"
        >
          {regions.map(region => (
            <option key={region} value={region}>{region === 'All' ? 'Semua Region' : region}</option>
          ))}
        </select>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTournaments.map((tournament, index) => (
          <div
            key={tournament.id}
            className="group bg-gradient-to-br from-[#1a1a2e]/95 to-[#16213e]/95 backdrop-blur-md rounded-2xl overflow-hidden border border-[#ff4655]/30 hover:border-[#ff4655]/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff4655]/20"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="h-40 bg-gradient-to-r from-[#ff4655]/20 to-[#ff8a5c]/20 relative overflow-hidden">
  <img 
    src={tournament.imageUrl} 
    alt={tournament.name}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = 'https://placehold.co/400x200/1a1a2e/ff4655?text=No+Image';
    }}
  />
  {/* Overlay gelap agar teks terbaca */}
  <div className="absolute inset-0 bg-black/40"></div>
  <div className="absolute top-3 right-3 bg-[#ff4655] text-white text-xs font-bold px-2 py-1 rounded-full z-10">
    #{tournament.id}
  </div>
</div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ff8a5c] transition-colors">
                {tournament.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 bg-[#ff4655]/20 text-[#ff8a5c] rounded-full">
                  {tournament.region}
                </span>
                <span className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded-full">
                  {formatPrizePool(tournament.prizePool)}
                </span>
              </div>

              <div className="border-t border-white/10 pt-3 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Organizer</span>
                  <span className="text-white/80">{tournament.organizer.name}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-white/50">Tanggal</span>
                  <span className="text-white/80">{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
                </div>
              </div>

              <div className="bg-[#ff4655]/10 rounded-xl p-3 mt-3 border border-[#ff4655]/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-500"></span>
                  <span className="text-white/70 text-xs">WINNER</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">{tournament.winner.teamName}</span>
                  <span className="text-[#ff8a5c] text-sm">{tournament.winner.score}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10">
                <div className="flex items-center gap-1">
                  <span className="text-purple-400"></span>
                  <span className="text-white/60 text-xs">{tournament.streaming.platform}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-400"></span>
                  <span className="text-white/60 text-xs">{tournament.streaming.peakViewers.toLocaleString()} viewers</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTournaments.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4"></div>
          <p className="text-white/50">Tidak ada turnamen yang ditemukan</p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .group {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default GuestView;