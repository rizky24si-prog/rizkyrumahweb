import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, X, Phone, Mail, MapPin, Clock, ChevronRight, Star, Calendar, Users, 
  Award, Shield, Stethoscope, Smile, Heart,
  CheckCircle, ArrowRight, Play, Quote, MessageCircle,
  CalendarDays, Sparkles, TrendingUp, Gift, Coffee, Baby,
  Activity, Droplets, Syringe, Microscope, Brain
} from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { icon: Smile, title: 'Scaling & Polishing', desc: 'Membersihkan karang gigi dan plak untuk kesehatan gigi optimal', price: 'Rp 200.000', color: 'from-blue-500 to-cyan-500' },
    { icon: Smile, title: 'Perawatan Behel', desc: 'Merapikan gigi dengan teknologi behel terkini', price: 'Rp 4.500.000', color: 'from-green-500 to-teal-500' },
    { icon: Activity, title: 'Tambal Gigi', desc: 'Menambal gigi berlubang dengan bahan berkualitas', price: 'Rp 250.000', color: 'from-purple-500 to-pink-500' },
    { icon: Syringe, title: 'Cabut Gigi', desc: 'Pencabutan gigi dengan metode tanpa rasa sakit', price: 'Rp 150.000', color: 'from-red-500 to-orange-500' },
    { icon: Sparkles, title: 'Pemutihan Gigi', desc: 'Memutihkan gigi hingga 8 shade lebih cerah', price: 'Rp 1.500.000', color: 'from-yellow-500 to-amber-500' },
    { icon: Brain, title: 'Konsultasi', desc: 'Konsultasi dengan dokter gigi spesialis', price: 'Gratis', color: 'from-indigo-500 to-purple-500' }
  ];

  const doctors = [
    { name: 'drg. Ahmad Surya', specialty: 'Spesialis Ortodonti', experience: '12 tahun', rating: 4.9, image: '👨‍⚕️', schedule: 'Sen-Rab, 09:00-16:00' },
    { name: 'drg. Andini Putri', specialty: 'Spesialis Konservasi', experience: '8 tahun', rating: 4.8, image: '👩‍⚕️', schedule: 'Sel-Kam, 10:00-17:00' },
    { name: 'drg. Budi Santoso', specialty: 'Spesialis Bedah Mulut', experience: '10 tahun', rating: 4.9, image: '👨‍⚕️', schedule: 'Sen-Jum, 08:00-15:00' },
    { name: 'drg. Citra Dewi', specialty: 'Spesialis Periodonti', experience: '7 tahun', rating: 4.7, image: '👩‍⚕️', schedule: 'Rab-Sab, 09:00-14:00' }
  ];

  const testimonials = [
    { name: 'Budi Santoso', text: 'Pelayanan sangat profesional, gigi saya yang bermasalah kini sudah rapi. Dokter sangat ramah dan menjelaskan dengan detail.', rating: 5, date: '2 minggu lalu', treatment: 'Behel' },
    { name: 'Siti Aminah', text: 'Klinik bersih, alat modern, dan tidak sakit saat dicabut. Sangat recommended!', rating: 5, date: '1 bulan lalu', treatment: 'Cabut Gigi' },
    { name: 'Ahmad Fauzi', text: 'Scaling nya cepat dan hasilnya memuaskan. Harga terjangkau dengan kualitas terbaik.', rating: 4, date: '3 minggu lalu', treatment: 'Scaling' },
    { name: 'Dewi Lestari', text: 'Dokter sangat sabar menghadapi anak saya yang takut ke dokter gigi. Sekarang anak saya jadi berani!', rating: 5, date: '2 bulan lalu', treatment: 'Perawatan Anak' }
  ];

  const facilities = [
    { icon: Shield, title: 'Sterilisasi Tingkat Tinggi', desc: 'Alat-alat disterilkan dengan autoclave modern' },
    { icon: Microscope, title: 'Radiologi Digital', desc: 'Rontgen gigi digital dengan hasil cepat & akurat' },
    { icon: Activity, title: 'Monitor Pasien', desc: 'Pemantauan tanda vital selama perawatan' },
    { icon: Users, title: 'Ruang Nyaman', desc: 'Ruangan ber-AC dengan suasana yang menenangkan' }
  ];

  const promos = [
    { title: 'Diskon Scaling 20%', desc: 'Dapatkan diskon khusus untuk scaling', code: 'SCALING20', validUntil: '30 Juni 2026' },
    { title: 'Gratis Konsultasi', desc: 'Konsultasi pertama gratis untuk pasien baru', code: 'CONSULTFREE', validUntil: '31 Desember 2026' },
    { title: 'Paket Keluarga', desc: 'Diskon 15% untuk 3 anggota keluarga', code: 'FAMILY15', validUntil: '30 September 2026' }
  ];

  const faqs = [
    { q: 'Apakah scaling sakit?', a: 'Scaling umumnya tidak sakit, hanya terasa sedikit tidak nyaman. Jika gigi Anda sensitif, dokter akan memberikan anestesi lokal.' },
    { q: 'Berapa lama pemasangan behel?', a: 'Proses pemasangan behel memakan waktu sekitar 1-2 jam, tergantung kondisi gigi.' },
    { q: 'Apakah klinik menerima BPJS?', a: 'Ya, kami menerima BPJS Kesehatan untuk layanan tertentu. Silakan hubungi resepsionis untuk info lebih lanjut.' },
    { q: 'Bagaimana cara booking janji?', a: 'Anda bisa booking melalui website, WhatsApp, atau langsung datang ke klinik.' }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <Smile className="text-white" size={22} />
              </div>
              <span className={`text-xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>Dental <span className="text-primary">Plus</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Home', 'Layanan', 'Dokter', 'Testimoni', 'Fasilitas', 'FAQ'].map((item) => (
                <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className={`${scrolled ? 'text-gray-600 hover:text-primary' : 'text-white/90 hover:text-white'} transition font-medium`}>
                  {item}
                </button>
              ))}
              <Link to="/login" className="px-5 py-2 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition shadow-md">
                Booking Online
              </Link>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg bg-white/20">
              {isMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl py-4 px-4">
            <div className="flex flex-col gap-3">
              {['Home', 'Layanan', 'Dokter', 'Testimoni', 'Fasilitas', 'FAQ'].map((item) => (
                <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-left font-medium">
                  {item}
                </button>
              ))}
              <Link to="/login" className="mt-2 px-4 py-3 bg-primary text-white rounded-xl font-semibold text-center">
                Booking Online
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1600')] bg-cover bg-center mix-blend-overlay z-0"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-white text-sm">✨ Klinik Gigi Digital Terpercaya</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
              Senyum Sehat, <br />
              <span className="text-yellow-300">Perawatan Modern</span>
            </h1>
            <p className="text-white/90 text-lg mb-8 max-w-lg">Layanan kesehatan gigi terbaik dengan teknologi digital, dokter spesialis, dan harga terjangkau.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="px-8 py-3 bg-white text-primary rounded-full font-bold hover:shadow-lg transition flex items-center gap-2">
                Booking Sekarang <ArrowRight size={18} />
              </Link>
              <button onClick={() => scrollToSection('layanan')} className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition">
                Lihat Layanan
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center"><div className="w-1 h-2 bg-white rounded-full mt-2"></div></div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold mb-2">Mengapa Memilih Kami</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Keunggulan Klinik Dental Plus</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Kami berkomitmen memberikan pelayanan terbaik untuk kesehatan gigi Anda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac, i) => <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition"><div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><fac.icon size={32} className="text-primary" /></div><h3 className="text-lg font-bold mb-2">{fac.title}</h3><p className="text-gray-500 text-sm">{fac.desc}</p></div>)}
          </div>
        </div>
      </section>

      <section id="layanan" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12"><p className="text-primary font-semibold mb-2">Layanan Kami</p><h2 className="text-3xl md:text-4xl font-bold text-gray-900">Perawatan Gigi Profesional</h2><p className="text-gray-500 mt-3">Dilakukan oleh dokter spesialis dengan teknologi terkini</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => <div key={i} className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition border border-gray-100"><div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}><service.icon size={28} className="text-white" /></div><h3 className="text-xl font-bold mb-2">{service.title}</h3><p className="text-gray-500 text-sm mb-3">{service.desc}</p><div className="flex justify-between items-center"><span className="text-primary font-bold">{service.price}</span><button className="text-primary hover:underline text-sm flex items-center gap-1">Detail <ChevronRight size={14} /></button></div></div>)}
          </div>
        </div>
      </section>

      <section id="dokter" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12"><p className="text-primary font-semibold mb-2">Tim Dokter</p><h2 className="text-3xl md:text-4xl font-bold text-gray-900">Dokter Gigi Berpengalaman</h2><p className="text-gray-500 mt-3">Tim dokter profesional siap memberikan perawatan terbaik</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc, i) => <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition"><div className="w-24 h-24 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">{doc.image}</div><h3 className="text-lg font-bold">{doc.name}</h3><p className="text-primary text-sm mb-1">{doc.specialty}</p><p className="text-gray-400 text-xs mb-2">{doc.experience} pengalaman</p><div className="flex items-center justify-center gap-1 mb-3"><Star size={14} className="text-yellow-400 fill-yellow-400" /><span className="text-sm font-semibold">{doc.rating}</span></div><p className="text-xs text-gray-500 flex items-center justify-center gap-1"><Clock size={12} /> {doc.schedule}</p><button className="mt-3 text-primary text-sm font-semibold hover:underline">Booking</button></div>)}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10"><Gift size={40} className="mx-auto mb-3 opacity-90" /><h2 className="text-3xl font-bold">Promo Spesial</h2><p className="opacity-90 mt-2">Dapatkan penawaran menarik terbatas!</p></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promos.map((promo, i) => <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"><h3 className="text-xl font-bold mb-2">{promo.title}</h3><p className="opacity-90 text-sm mb-3">{promo.desc}</p><div className="bg-white/20 rounded-full px-4 py-2 inline-block mb-3"><code className="font-mono text-sm">{promo.code}</code></div><p className="text-xs opacity-75">Berlaku s/d {promo.validUntil}</p></div>)}
          </div>
        </div>
      </section>

      <section id="testimoni" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12"><Quote size={32} className="mx-auto text-primary mb-3" /><h2 className="text-3xl md:text-4xl font-bold text-gray-900">Apa Kata Pasien Kami</h2><p className="text-gray-500 mt-3">Lebih dari 5.000 pasien puas dengan layanan kami</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => <div key={i} className="bg-gray-50 rounded-2xl p-6"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"><Quote size={16} className="text-primary" /></div><div><p className="font-bold">{t.name}</p><div className="flex items-center gap-1">{[...Array(5)].map((_, s) => <Star key={s} size={12} className={s < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />)}</div></div></div><p className="text-gray-600 text-sm italic mb-3">"{t.text}"</p><div className="flex justify-between text-xs text-gray-400"><span>{t.treatment}</span><span>{t.date}</span></div></div>)}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-gray-900">Pertanyaan Umum</h2><p className="text-gray-500 mt-3">Informasi yang sering ditanyakan pasien</p></div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => <div key={i} className="bg-white rounded-xl p-5 shadow-sm"><h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3><p className="text-gray-600 text-sm">{faq.a}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Siap Memulai Perawatan?</h2>
            <p className="text-gray-600 mb-6">Booking janji temu sekarang dan dapatkan konsultasi gratis</p>
            <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-bold hover:shadow-lg transition">
              Booking Online Sekarang <ArrowRight size={18} />
            </Link>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-500">
              <span className="flex items-center gap-2"><Phone size={14} className="text-primary" /> (021) 1234-5678</span>
              <span className="flex items-center gap-2"><MessageCircle size={14} className="text-primary" /> 0812-3456-7890</span>
              <span className="flex items-center gap-2"><Mail size={14} className="text-primary" /> info@dentalplus.com</span>
              <span className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> Jakarta Selatan</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center"><Smile size={20} /></div>
                <span className="text-xl font-bold">Dental Plus</span>
              </div>
              <p className="text-gray-400 text-sm">Klinik gigi digital dengan teknologi modern dan dokter spesialis berpengalaman.</p>
              <div className="flex gap-3 mt-4">
                <Phone size={18} className="text-gray-400 hover:text-white cursor-pointer" />
                <MessageCircle size={18} className="text-gray-400 hover:text-white cursor-pointer" />
                <Mail size={18} className="text-gray-400 hover:text-white cursor-pointer" />
                <MapPin size={18} className="text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
            <div><h3 className="font-bold mb-4">Layanan</h3><ul className="space-y-2 text-sm text-gray-400"><li>Scaling & Polishing</li><li>Perawatan Behel</li><li>Tambal Gigi</li><li>Cabut Gigi</li><li>Pemutihan Gigi</li></ul></div>
            <div><h3 className="font-bold mb-4">Informasi</h3><ul className="space-y-2 text-sm text-gray-400"><li>Tentang Kami</li><li>Karir</li><li>Kebijakan Privasi</li><li>Syarat & Ketentuan</li><li>Hubungi Kami</li></ul></div>
            <div><h3 className="font-bold mb-4">Jam Operasional</h3><ul className="space-y-2 text-sm text-gray-400"><li className="flex justify-between"><span>Senin - Jumat</span><span>09:00 - 20:00</span></li><li className="flex justify-between"><span>Sabtu</span><span>09:00 - 17:00</span></li><li className="flex justify-between"><span>Minggu</span><span>09:00 - 14:00</span></li></ul><p className="mt-4 text-sm text-gray-400"><Clock size={14} className="inline mr-1" /> Layanan Darurat 24 Jam</p></div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">© 2024 Dental Plus. All rights reserved.</div>
        </div>
      </footer>

      <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition z-40">
        <MessageCircle size={24} />
      </a>
    </div>
  );
};

export default LandingPage;
