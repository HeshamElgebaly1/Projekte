import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Cpu } from 'lucide-react';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { cn } from '../lib/utils';
import { useCart } from '../contexts/CartContext';

export function Navbar() {
  const [user] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="bg-zinc-950 text-white sticky top-0 z-50 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-orange-500 font-bold text-xl">
              <Cpu className="w-8 h-8" />
              <span className="hidden sm:block tracking-tighter uppercase font-black italic">HardwareShop</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              <Link to="/" className="hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">Startseite</Link>
              <Link to="/kategorien" className="hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">Kategorien</Link>
              <Link to="/ueber-uns" className="hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">Über uns</Link>
              <Link to="/kontakt" className="hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">Kontakt</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:text-orange-500 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/warenkorb" className="p-2 hover:text-orange-500 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link to={user ? "/profil" : "/login"} className="p-2 hover:text-orange-500 transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:text-orange-500 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", isMenuOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-zinc-900 border-b border-zinc-800">
          <Link to="/" className="block hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Startseite</Link>
          <Link to="/kategorien" className="block hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Kategorien</Link>
          <Link to="/ueber-uns" className="block hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Über uns</Link>
          <Link to="/kontakt" className="block hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Kontakt</Link>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-orange-500 font-bold text-xl mb-4">
              <Cpu className="w-8 h-8" />
              <span className="tracking-tighter uppercase font-black italic">HardwareShop</span>
            </Link>
            <p className="max-w-xs">
              Dein Partner für High-End Hardware und IT-Zubehör. Qualität und Leistung für dein System.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/kategorien" className="hover:text-orange-500 transition-colors">Kategorien</Link></li>
              <li><Link to="/angebote" className="hover:text-orange-500 transition-colors">Angebote</Link></li>
              <li><Link to="/neuheiten" className="hover:text-orange-500 transition-colors">Neuheiten</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Informationen</h3>
            <ul className="space-y-2">
              <li><Link to="/ueber-uns" className="hover:text-orange-500 transition-colors">Über uns</Link></li>
              <li><Link to="/kontakt" className="hover:text-orange-500 transition-colors">Kontakt</Link></li>
              <li><Link to="/impressum" className="hover:text-orange-500 transition-colors">Impressum</Link></li>
              <li><Link to="/datenschutz" className="hover:text-orange-500 transition-colors">Datenschutz</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-zinc-900 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} HardwareShop. Alle Rechte vorbehalten. IHK Projekt.</p>
        </div>
      </div>
    </footer>
  );
}
