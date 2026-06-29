import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show regular footer on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-brand-primary text-white pt-20 pb-10 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <img src="https://i.ibb.co/TB4PbDRN/294463932-545722830683545-9019441332151319432-n.jpg" alt="DITEM Logo" className="h-12 w-auto object-contain bg-white rounded-lg p-1.5" />
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tighter">DITEM</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Kaduna Campus</span>
              </div>
            </div>
            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-md">
              Dialogue Institute of Technology and Management Kaduna. Empowering the next generation of tech leaders through industry-standard ICT education and professional training.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://wa.me/2348069196891" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-lg shadow-emerald-600/5"
                title="Chat on WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.124.553 4.194 1.605 6.014L.211 24l6.105-1.602a11.974 11.974 0 0 0 5.715 1.444h.004c6.648 0 12.031-5.383 12.031-12.031S18.679 0 12.031 0zm0 21.84c-1.796 0-3.556-.483-5.097-1.397l-.366-.217-3.788.994.994-3.788-.217-.366A9.98 9.98 0 0 1 2.031 12.03c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.49-7.513c-.301-.151-1.783-.881-2.059-.982-.276-.101-.477-.151-.678.151-.201.302-.779.982-.955 1.183-.176.201-.352.226-.653.075-.301-.151-1.272-.469-2.423-1.496-.896-.8-1.503-1.788-1.679-2.09-.176-.302-.019-.465.132-.616.135-.135.301-.352.452-.528.151-.176.201-.302.301-.503.101-.201.05-.377-.025-.528-.075-.151-.678-1.634-.929-2.237-.245-.589-.494-.509-.678-.518-.176-.008-.377-.011-.578-.011-.201 0-.528.075-.804.377-.276.302-1.055 1.031-1.055 2.514 0 1.483 1.08 2.916 1.231 3.117.151.201 2.125 3.243 5.145 4.546.719.311 1.28.497 1.717.636.722.23 1.38.197 1.898.119.582-.088 1.783-.729 2.034-1.433.251-.704.251-1.307.176-1.433-.075-.126-.276-.201-.578-.352z"/>
                </svg>
              </a>
              <a 
                href="https://web.facebook.com/photo/?fbid=545722857350209&set=pb.100057374983217.-2207520000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-blue-600/10 text-blue-500 border border-blue-600/20 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg shadow-blue-600/5"
                title="Visit our Facebook"
              >
                <Facebook size={22} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-pink-600/10 text-pink-500 border border-pink-600/20 flex items-center justify-center hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white transition-all duration-300 shadow-lg shadow-pink-600/5"
                title="Visit our Instagram"
              >
                <Instagram size={22} />
              </a>
            </div>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-lg font-bold mb-8 uppercase tracking-widest text-brand-accent">Contact Information</h3>
            <ul className="space-y-6 text-slate-400">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-brand-accent transition-colors">
                  <MapPin size={20} className="text-brand-accent group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm leading-relaxed">61/63 Tafawa Balewa Way, opposite Kaduna State University (KASU), Kaduna.</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-brand-accent transition-colors">
                  <Phone size={20} className="text-brand-accent group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm">08069196891</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-brand-accent transition-colors">
                  <Mail size={20} className="text-brand-accent group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm">jameeluks@gmail.com</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-lg font-bold mb-8 uppercase tracking-widest text-brand-accent">Quick Links</h3>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li><a href="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all">About Our Institute</a></li>
              <li><a href="/admission" className="hover:text-white hover:translate-x-1 inline-block transition-all">Admission Process</a></li>
              <li><a href="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-all">Student Enquiries</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-medium">&copy; <span onDoubleClick={() => navigate('/login')} className="cursor-pointer">{new Date().getFullYear()}</span> Dialogue Institute of Technology and Management. All rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-500 text-sm font-bold uppercase tracking-widest">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
