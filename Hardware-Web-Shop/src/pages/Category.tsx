import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { collection, query, where, doc, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Category, Product } from '../types';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowLeft, Info } from 'lucide-react';
import { addToCart } from '../services/cartService';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

export function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [categoryValue, catLoading] = useDocument(doc(db, 'categories', id || ''));
  const category = categoryValue?.exists() ? { id: categoryValue.id, ...categoryValue.data() } as Category : null;

  const [productsValue, prodLoading] = useCollection(
    query(collection(db, 'products'), where('category_id', '==', id || ''), limit(8))
  );
  const products = productsValue?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)) || [];

  if (catLoading || prodLoading) return <div className="p-24 text-center text-2xl font-bold">Lade Produkte...</div>;
  if (!category) return <div className="p-24 text-center text-2xl font-bold">Kategorie nicht gefunden.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <Link to="/kategorien" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-bold mb-12 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Zurück zu allen Kategorien
      </Link>

      <div className="mb-24 relative h-96 rounded-[3rem] overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-12">
          <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-4">{category.name}</h1>
          <p className="text-zinc-300 text-2xl max-w-2xl">{category.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-zinc-900/50 rounded-[2rem] overflow-hidden border border-zinc-800 hover:border-orange-500/50 transition-all flex flex-col"
          >
            <Link to={`/produkt/${product.id}`} className="relative h-64 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md px-4 py-2 rounded-full font-bold text-orange-500">
                {product.price.toFixed(2)} €
              </div>
            </Link>
            <div className="p-8 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold group-hover:text-orange-500 transition-colors">{product.name}</h3>
                <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">{product.brand}</span>
              </div>
              <p className="text-zinc-400 text-sm mb-8 line-clamp-2 flex-grow">{product.description}</p>
              <div className="flex gap-2">
                <Link
                  to={`/produkt/${product.id}`}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Info className="w-4 h-4" /> Details
                </Link>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-all transform active:scale-95"
                  onClick={async () => {
                    if (!user) return navigate('/login');
                    try {
                      await addToCart(product.id);
                      alert(`${product.name} wurde zum Warenkorb hinzugefügt!`);
                    } catch (err) {
                      alert('Fehler beim Hinzufügen zum Warenkorb.');
                    }
                  }}
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
