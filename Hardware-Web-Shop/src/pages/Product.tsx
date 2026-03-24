import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ArrowLeft, Shield, Truck, Zap, Cpu, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { addToCart } = useCart();
  const [productValue, loading] = useDocument(doc(db, 'products', id || ''));
  const [isAdding, setIsAdding] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const product = productValue?.exists() ? { id: productValue.id, ...productValue.data() } as Product : null;

  if (loading) return <div className="p-24 text-center text-2xl font-bold">Lade Produktdetails...</div>;
  if (!product) return <div className="p-24 text-center text-2xl font-bold">Produkt nicht gefunden.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <Link to={`/kategorie/${product.category_id}`} className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-bold mb-12 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Zurück zur Kategorie
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-square rounded-[3rem] overflow-hidden border border-zinc-800 shadow-2xl"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-8 left-8 bg-zinc-950/80 backdrop-blur-md px-6 py-3 rounded-full font-bold text-orange-500 text-xl">
            {product.brand}
          </div>
        </motion.div>

        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-6 leading-none">{product.name}</h1>
            <div className="text-4xl font-bold text-orange-500 mb-8">{product.price.toFixed(2)} €</div>
            <p className="text-zinc-400 text-xl mb-12 leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="flex items-center gap-4 text-zinc-300 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                <Truck className="w-8 h-8 text-orange-500" />
                <div>
                  <div className="font-bold">Schneller Versand</div>
                  <div className="text-sm text-zinc-500">In 1-2 Tagen bei dir</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-zinc-300 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                <Shield className="w-8 h-8 text-orange-500" />
                <div>
                  <div className="font-bold">Garantie</div>
                  <div className="text-sm text-zinc-500">2 Jahre Herstellergarantie</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                disabled={isAdding || showSuccess}
                className={`flex-1 px-12 py-6 rounded-full font-bold text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl ${
                  showSuccess 
                    ? 'bg-green-500 text-white' 
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                }`}
                onClick={async () => {
                  setIsAdding(true);
                  try {
                    await addToCart(product.id);
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 2000);
                  } finally {
                    setIsAdding(false);
                  }
                }}
              >
                <AnimatePresence mode="wait">
                  {showSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-6 h-6" /> Hinzugefügt
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3"
                    >
                      <ShoppingCart className="w-6 h-6" /> 
                      {isAdding ? 'Wird hinzugefügt...' : 'In den Warenkorb'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white p-6 rounded-full transition-all">
                <Zap className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-12 pt-12 border-t border-zinc-900 flex items-center gap-8 text-zinc-500 text-sm font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2"><Cpu className="w-4 h-4" /> Lagerbestand: {product.stock}</div>
              <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> Sicherer Checkout</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
