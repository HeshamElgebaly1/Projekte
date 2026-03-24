import React from 'react';
import { Link } from 'react-router-dom';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../firebase';
import { Category } from '../types';
import { ArrowRight, Zap, Shield, Truck, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export function Home() {
  const [categoriesValue, loading, error] = useCollection(collection(db, 'categories'));
  const categories = categoriesValue?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)) || [];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=2000"
            alt="Hardware Background"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl sm:text-8xl font-black italic tracking-tighter uppercase leading-none mb-6">
              Power Up Your <span className="text-orange-500">System</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-8 max-w-lg">
              Entdecke die neueste Hardware für Gaming, Workstations und IT-Infrastruktur. Qualität, die man spürt.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/kategorien"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all transform hover:scale-105"
              >
                Jetzt Shoppen <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/ueber-uns"
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
              >
                Mehr erfahren
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <Zap className="w-8 h-8 text-orange-500" />, title: "High Performance", desc: "Nur die schnellsten Komponenten." },
            { icon: <Shield className="w-8 h-8 text-orange-500" />, title: "Garantierte Qualität", desc: "Geprüfte Hardware von Top-Marken." },
            { icon: <Truck className="w-8 h-8 text-orange-500" />, title: "Schneller Versand", desc: "Heute bestellt, morgen bei dir." },
            { icon: <Cpu className="w-8 h-8 text-orange-500" />, title: "Experten Support", desc: "Hilfe bei jeder Konfiguration." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 hover:border-orange-500/50 transition-colors"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-zinc-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Kategorien</h2>
            <p className="text-zinc-400">Wähle deine Hardware-Sparte</p>
          </div>
          <Link to="/kategorien" className="text-orange-500 hover:text-orange-400 font-bold flex items-center gap-1 transition-colors">
            Alle ansehen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.slice(0, 6).map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer"
            >
              <Link to={`/kategorie/${category.id}`}>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-zinc-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-orange-500 rounded-[3rem] p-12 sm:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-orange-400 rounded-full blur-3xl opacity-50" />
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter text-zinc-950 mb-8">
              Bereit für das nächste Level?
            </h2>
            <p className="text-zinc-900 font-medium mb-12 text-lg">
              Melde dich an und erhalte exklusive Angebote für dein nächstes Build.
            </p>
            <Link
              to="/register"
              className="bg-zinc-950 text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-zinc-900 transition-all shadow-2xl"
            >
              Konto erstellen
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
