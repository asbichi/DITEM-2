import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Admission', path: '/admission' },
    { name: 'Contact', path: '/contact' },
    { name: 'Exit', path: '/exit' },
  ];

  // Don't show regular navbar on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-100 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link 
              to="/"
              onDoubleClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
              className="flex items-center gap-3 group"
            >
              <img src="https://i.ibb.co/TB4PbDRN/294463932-545722830683545-9019441332151319432-n.jpg" alt="DITEM Logo" className="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl text-brand-primary leading-tight tracking-tighter">DITEM</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Dialogue Institute</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`${
                  isActive(link.path)
                    ? 'text-brand-accent font-bold'
                    : 'text-slate-600 hover:text-brand-accent'
                } transition-all duration-200 font-semibold text-sm uppercase tracking-wide`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="bg-brand-accent hover:bg-brand-accent-hover text-white px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-brand-accent/20 hover:shadow-brand-accent/40 active:scale-95"
            >
              Enquire Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-brand-accent focus:outline-none p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`${
                  isActive(link.path)
                    ? 'bg-brand-accent/5 text-brand-accent font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-brand-accent'
                } block px-4 py-3 rounded-xl text-base font-semibold transition-all`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-brand-accent text-white py-4 rounded-xl font-bold uppercase tracking-widest"
              >
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
