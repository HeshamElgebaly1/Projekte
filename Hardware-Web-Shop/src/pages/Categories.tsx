import React from 'react';
import { Link } from 'react-router-dom';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../firebase';
import { Category } from '../types';
import { motion } from 'motion/react';

export function Categories() {
  const [categoriesValue, loading, error] = useCollection(collection(db, 'categories'));
  const categories = categoriesValue?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)) || [];

  if (loading) return <div className="p-24 text-center text-2xl font-bold">Lade Kategorien...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="mb-16 text-center">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4">Alle Kategorien</h1>
        <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
          Wähle eine Kategorie, um die passenden Komponenten für dein System zu finden.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {categories.map((category, i) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative h-96 rounded-[2.5rem] overflow-hidden border border-zinc-800 hover:border-orange-500/50 transition-all"
          >
            <Link to={`/kategorie/${category.id}`}>
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-10">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">{category.name}</h2>
                <p className="text-zinc-300 mb-6 max-w-xs">{category.description}</p>
                <span className="inline-flex items-center gap-2 text-orange-500 font-bold group-hover:translate-x-2 transition-transform">
                  Produkte ansehen <span className="text-xl">→</span>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
