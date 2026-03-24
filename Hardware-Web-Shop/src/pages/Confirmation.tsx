import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, ShoppingBag, Truck } from 'lucide-react';

export function Confirmation() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-48 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="mb-12 flex justify-center"
      >
        <div className="bg-orange-500 p-12 rounded-full shadow-2xl shadow-orange-500/30">
          <CheckCircle className="w-24 h-24 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-6xl sm:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">
          Vielen Dank für <br /> deine <span className="text-orange-500">Bestellung</span>
        </h1>
        <p className="text-zinc-400 text-xl mb-12 max-w-2xl mx-auto">
          Deine Bestellung wurde erfolgreich entgegengenommen. Wir senden dir in Kürze eine Bestätigungs-E-Mail mit allen Details.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 flex items-center gap-6 text-left">
            <ShoppingBag className="w-10 h-10 text-orange-500" />
            <div>
              <div className="font-bold text-lg">Bestellnummer</div>
              <div className="text-zinc-500">#HS-{Math.floor(Math.random() * 1000000)}</div>
            </div>
          </div>
          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 flex items-center gap-6 text-left">
            <Truck className="w-10 h-10 text-orange-500" />
            <div>
              <div className="font-bold text-lg">Voraussichtliche Lieferung</div>
              <div className="text-zinc-500">In 1-2 Werktagen</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <Link
            to="/"
            className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-5 rounded-full font-bold text-xl transition-all transform hover:scale-105 flex items-center gap-2"
          >
            Zurück zur Startseite <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/profil"
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-12 py-5 rounded-full font-bold text-xl transition-all"
          >
            Meine Bestellungen
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
