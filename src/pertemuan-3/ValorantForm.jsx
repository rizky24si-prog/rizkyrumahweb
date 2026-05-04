import React, { useState } from 'react';
import InputField from './components/InputField';
import SelectField from './components/SelectField';

export default function ValorantForm() {
  const [formData, setFormData] = useState({
    username: '',
    role: '',
    rank: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    role: '',
    rank: ''
  });

  const [submittedData, setSubmittedData] = useState(null);

  const roleOptions = [
    { value: "duelist", label: "⚡ Duelist" },
    { value: "initiator", label: "🔍 Initiator" },
    { value: "controller", label: "☁️ Controller" },
    { value: "sentinel", label: "🛡️ Sentinel" },
    { value: "flex", label: "🔄 Flex" }
  ];

  const rankOptions = [
    { value: "iron", label: "Iron" },
    { value: "bronze", label: "Bronze" },
    { value: "silver", label: "Silver" },
    { value: "gold", label: "Gold" },
    { value: "platinum", label: "Platinum" },
    { value: "diamond", label: "Diamond" },
    { value: "ascendant", label: "Ascendant" },
    { value: "immortal", label: "Immortal" },
    { value: "radiant", label: "Radiant" }
  ];

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value) return 'Username wajib diisi';
        if (value.length < 3) return 'Username minimal 3 karakter';
        if (/\d/.test(value)) return 'Username tidak boleh mengandung angka';
        return '';
      case 'role':
        if (!value) return 'Role wajib dipilih';
        return '';
      case 'rank':
        if (!value) return 'Rank wajib dipilih';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    if (submittedData) setSubmittedData(null);
  };

  const isFormValid = () => {
    return formData.username &&
           formData.role &&
           formData.rank &&
           formData.username.length >= 3 &&
           !/\d/.test(formData.username) &&
           !errors.username && !errors.role && !errors.rank;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      setSubmittedData(formData);
    }
  };

  const handleReset = () => {
    setFormData({ username: '', role: '', rank: '' });
    setErrors({ username: '', role: '', rank: '' });
    setSubmittedData(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0d0d2b] p-5">
      <div className="bg-gradient-to-br from-[#1a1a2e]/95 to-[#16213e]/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#ff4655]/30 shadow-[#ff4655]/10">
        
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🎮</div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ff4655] to-[#ff8a5c] bg-clip-text text-transparent">
            VALORANT
          </h2>
          <p className="text-white/50 text-sm mt-1">Tournament Registration</p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-[#ff4655] to-transparent mx-auto mt-3"></div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <InputField 
            label="USERNAME"
            name="username"
            type="text" 
            placeholder="Masukkan Username (TenZ#riot)" 
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />
          
          <SelectField 
            label="Main Role"
            name="role"
            options={roleOptions}
            value={formData.role}
            onChange={handleChange}
            error={errors.role}
          />
          
          <SelectField 
            label="Rank"
            name="rank"
            options={rankOptions}
            value={formData.rank}
            onChange={handleChange}
            error={errors.rank}
          />
          
          <div className="flex gap-3 mt-6">
            {isFormValid() && (
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-[#ff4655] to-[#bd3944] text-white py-3 rounded-xl font-bold hover:from-[#ff5c6a] hover:to-[#d44a5a] transition-all duration-300 shadow-lg shadow-[#ff4655]/30 cursor-pointer transform hover:scale-105"
              >
                KIRIM
              </button>
            )}

            <button 
              type="button" 
              onClick={handleReset}
              className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 cursor-pointer"
            >
              RESET
            </button>
          </div>
        </form>

        {submittedData && (
          <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-[#ff4655]/10 to-[#bd3944]/10 border border-[#ff4655]/50 animate-fadeIn">
            <div className="text-center mb-3">
              <span className="text-3xl">🏆</span>
              <h3 className="text-white font-bold text-lg mt-1">REGISTRATION SUCCESS</h3>
            </div>
            <div className="space-y-3 text-white">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-white/60 text-sm">Username</span>
                <span className="font-semibold text-[#ff8a5c]">{submittedData.username}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-white/60 text-sm">Role</span>
                <span className="font-semibold">{submittedData.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Rank</span>
                <span className="font-semibold">{submittedData.rank}</span>
              </div>
            </div>
            <p className="text-center text-white/40 text-xs mt-3 pt-2 border-t border-white/10">
              Pendaftaran berhasil! Cek email untuk info lebih lanjut.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}