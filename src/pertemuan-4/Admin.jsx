import React, { useState } from 'react';
import tournamentData from './tour.json';

const AdminView = () => {
  const [data, setData] = useState(tournamentData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [selectedTournament, setSelectedTournament] = useState(null);

  const formatPrizePool = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID');
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    
    if (sortConfig.key === 'prizePool') {
      aVal = a.prizePool;
      bVal = b.prizePool;
    }
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter(tournament =>
    tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tournament.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tournament.organizer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handleViewDetail = (tournament) => {
    setSelectedtournament(tournament);
  };

  const closeModal = () => {
    setSelectedTournament(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0d0d2b] p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff4655] to-[#ff8a5c] bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-white/50 mt-1">Manajemen Data Turnamen Valorant</p>
          </div>
          <div className="bg-[#1a1a2e]/80 px-4 py-2 rounded-xl border border-[#ff4655]/30">
            <span className="text-white/70">Total Turnamen: </span>
            <span className="text-[#ff8a5c] font-bold text-xl">{data.length}</span>
          </div>
        </div>
        <div className="w-20 h-0.5 bg-gradient-to-r from-[#ff4655] to-transparent mt-3"></div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari berdasarkan nama, region, atau organizer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a2e]/80 text-white px-5 py-3 rounded-xl border border-[#ff4655]/30 focus:border-[#ff4655] focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#ff4655]/20 bg-[#1a1a2e]/50 backdrop-blur-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#ff4655]/30 bg-[#ff4655]/10">
              <th className="px-4 py-3 text-left text-white font-semibold cursor-pointer hover:text-[#ff8a5c] transition" onClick={() => handleSort('id')}>
                ID {getSortIcon('id')}
              </th>
              <th className="px-4 py-3 text-left text-white font-semibold cursor-pointer hover:text-[#ff8a5c] transition" onClick={() => handleSort('name')}>
                Nama Turnamen {getSortIcon('name')}
              </th>
              <th className="px-4 py-3 text-left text-white font-semibold cursor-pointer hover:text-[#ff8a5c] transition" onClick={() => handleSort('region')}>
                Region {getSortIcon('region')}
              </th>
              <th className="px-4 py-3 text-left text-white font-semibold cursor-pointer hover:text-[#ff8a5c] transition" onClick={() => handleSort('prizePool')}>
                Prize Pool {getSortIcon('prizePool')}
              </th>
              <th className="px-4 py-3 text-left text-white font-semibold">Organizer</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Winner</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Platform</th>
              <th className="px-4 py-3 text-center text-white font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((tournament) => (
              <tr key={tournament.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-white/70">#{tournament.id}</td>
                <td className="px-4 py-3">
                  <span className="text-white font-medium">{tournament.name}</span>
                  <div className="text-xs text-white/40">{tournament.startDate} - {tournament.endDate}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-[#ff4655]/20 text-[#ff8a5c] rounded-full text-xs">
                    {tournament.region}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#ffd700] font-semibold">{formatPrizePool(tournament.prizePool)}</td>
                <td className="px-4 py-3">
                  <div className="text-white/80">{tournament.organizer.name}</div>
                  <div className="text-xs text-white/40">{tournament.organizer.country}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500"></span>
                    <span className="text-white">{tournament.winner.teamName}</span>
                    <span className="text-xs text-[#ff8a5c]">({tournament.winner.score})</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="text-purple-400"></span>
                    <span className="text-white/60 text-sm">{tournament.streaming.platform}</span>
                  </div>
                  <div className="text-xs text-white/40">{tournament.streaming.peakViewers.toLocaleString()} viewers</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleViewDetail(tournament)}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-sm cursor-pointer"
                    >
                      Detail
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4"></div>
            <p className="text-white/50">Tidak ada data turnamen</p>
          </div>
        )}
      </div>

      {selectedTournament && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-[#ff4655]/30" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#1a1a2e] p-5 border-b border-[#ff4655]/30 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{selectedTournament.name}</h2>
              <button onClick={closeModal} className="text-white/70 hover:text-white text-2xl cursor-pointer">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/50 text-sm">Region</p>
                  <p className="text-white font-semibold">{selectedTournament.region}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Prize Pool</p>
                  <p className="text-[#ffd700] font-bold">{formatPrizePool(selectedTournament.prizePool)}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Tanggal</p>
                  <p className="text-white">{formatDate(selectedTournament.startDate)} - {formatDate(selectedTournament.endDate)}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Peak Viewers</p>
                  <p className="text-white">{selectedTournament.streaming.peakViewers.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-white font-semibold mb-2">Organizer</h3>
                <p className="text-white/80">{selectedTournament.organizer.name}</p>
                <p className="text-white/50 text-sm">{selectedTournament.organizer.country}</p>
                <a href={selectedTournament.organizer.website} className="text-[#ff8a5c] text-sm hover:underline" target="_blank" rel="noopener noreferrer">{selectedTournament.organizer.website}</a>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h3 className="text-white font-semibold mb-2">Winner</h3>
                <p className="text-white font-bold text-lg">{selectedTournament.winner.teamName}</p>
                <p className="text-white/80">Score: {selectedTournament.winner.score}</p>
                <p className="text-[#ffd700]">Prize Share: {formatPrizePool(selectedTournament.winner.prizeShare)}</p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h3 className="text-white font-semibold mb-2">Streaming</h3>
                <p className="text-white/80">Platform: {selectedTournament.streaming.platform}</p>
                <p className="text-white/80">Channels: {selectedTournament.streaming.channels.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;