import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AuditEngine from './components/AuditEngine';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
      <Navbar />
      <main>
        <Hero />
        <AuditEngine />
        <Services />
        <WhyUs />
        <Testimonials />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
