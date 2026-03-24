import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CartItem, Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, isLoading: cartLoading } = useCart();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (cartItems.length === 0) {
        setLoadingProducts(false);
        return;
      }

      const newProducts = { ...products };
      let changed = false;

      for (const item of cartItems) {
        if (!newProducts[item.product_id]) {
          try {
            const productDoc = await getDoc(doc(db, 'products', item.product_id));
            if (productDoc.exists()) {
              newProducts[item.product_id] = { id: productDoc.id, ...productDoc.data() } as Product;
              changed = true;
            }
          } catch (error) {
            console.error('Error fetching product:', error);
          }
        }
      }

      if (changed) {
        setProducts(newProducts);
      }
      setLoadingProducts(false);
    };

    fetchProducts();
  }, [cartItems]);

  const subtotal = cartItems.reduce((acc, item) => {
    const product = products[item.product_id];
    return acc + (item.quantity * (product?.price || 0));
  }, 0);

  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (cartLoading || (loadingProducts && cartItems.length > 0)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-48 text-center">
        <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-8" />
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Warenkorb wird geladen...</h2>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-48 text-center">
        <div className="mb-12 flex justify-center">
          <div className="bg-zinc-900 p-12 rounded-full border border-zinc-800">
            <ShoppingCart className="w-24 h-24 text-zinc-700" />
          </div>
        </div>
        <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-8">Dein Warenkorb ist leer</h1>
        <p className="text-zinc-400 text-xl mb-12 max-w-lg mx-auto">
          Es sieht so aus, als hättest du noch keine Produkte hinzugefügt. Entdecke unsere neuesten Hardware-Angebote!
        </p>
        <Link
          to="/kategorien"
          className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-5 rounded-full font-bold text-xl transition-all transform hover:scale-105 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Jetzt shoppen
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-16">Warenkorb</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence>
            {cartItems.map((item, i) => {
              const product = products[item.product_id];
              if (!product) return null;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800 flex flex-col sm:flex-row items-center gap-8"
                >
                  <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                    <p className="text-zinc-500 text-sm mb-4 uppercase font-bold tracking-widest">{product.brand}</p>
                    <div className="text-xl font-bold text-orange-500">{product.price.toFixed(2)} €</div>
                  </div>
                  <div className="flex items-center gap-4 bg-zinc-950 p-2 rounded-full border border-zinc-800">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:text-orange-500 transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-8 text-center font-bold text-xl">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:text-orange-500 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-4 text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-800 sticky top-32">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8">Zusammenfassung</h2>
            <div className="space-y-6 mb-10">
              <div className="flex justify-between text-zinc-400">
                <span>Zwischensumme</span>
                <span className="text-white font-bold">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Versand</span>
                <span className="text-white font-bold">{shipping === 0 ? "Gratis" : `${shipping.toFixed(2)} €`}</span>
              </div>
              <div className="pt-6 border-t border-zinc-800 flex justify-between items-end">
                <span className="text-xl font-bold uppercase italic">Gesamt</span>
                <span className="text-4xl font-black text-orange-500 italic uppercase tracking-tighter">{total.toFixed(2)} €</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-full font-bold text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-orange-500/20"
            >
              Zur Kasse <ArrowRight className="w-6 h-6" />
            </button>
            <p className="mt-6 text-center text-xs text-zinc-500 uppercase font-bold tracking-widest">
              Inkl. 19% MwSt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
