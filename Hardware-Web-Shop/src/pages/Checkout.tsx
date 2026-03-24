import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { CreditCard, Truck, Shield, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

export function Checkout() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsProcessing(true);
    try {
      // Simulate order processing
      const cartRef = collection(db, `users/${user.uid}/cart`);
      const cartSnap = await getDocs(cartRef);
      const cartItems = cartSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (cartItems.length === 0) {
        alert("Warenkorb ist leer.");
        setIsProcessing(false);
        return;
      }

      const totalAmount = cartItems.reduce((acc, item: any) => acc + (item.quantity * 299.99), 0);

      // Create order
      const orderRef = await addDoc(collection(db, 'orders'), {
        user_id: user.uid,
        order_date: serverTimestamp(),
        total_amount: totalAmount,
        payment_method: 'Kreditkarte (Simulation)',
        status: 'pending',
      });

      // Create order items
      for (const item of cartItems as any[]) {
        await addDoc(collection(db, `orders/${orderRef.id}/items`), {
          product_id: item.product_id,
          quantity: item.quantity,
          single_price: 299.99,
        });
        // Clear cart item
        await deleteDoc(doc(db, `users/${user.uid}/cart`, item.id));
      }

      // Simulate a small delay for "processing"
      setTimeout(() => {
        navigate('/bestaetigung');
      }, 2000);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-16">Checkout</h1>

      <form onSubmit={handleOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-16">
          <section>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-4">
              <Truck className="w-8 h-8 text-orange-500" /> Lieferadresse
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Vorname</label>
                <input required type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:border-orange-500 outline-none transition-colors" />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Nachname</label>
                <input required type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:border-orange-500 outline-none transition-colors" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Straße & Hausnummer</label>
                <input required type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:border-orange-500 outline-none transition-colors" />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Stadt</label>
                <input required type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:border-orange-500 outline-none transition-colors" />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">PLZ</label>
                <input required type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:border-orange-500 outline-none transition-colors" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-4">
              <CreditCard className="w-8 h-8 text-orange-500" /> Zahlungsmethode
            </h2>
            <div className="bg-zinc-900 p-8 rounded-[2rem] border border-orange-500/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-orange-500 p-3 rounded-xl">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold">Kreditkarte (Simulation)</div>
                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Sichere Zahlung</div>
                </div>
              </div>
              <CheckCircle className="w-6 h-6 text-orange-500" />
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-800 sticky top-32">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8">Bestellung abschließen</h2>
            <div className="space-y-6 mb-10">
              <div className="flex justify-between text-zinc-400">
                <span>Versandart</span>
                <span className="text-white font-bold">Standardversand</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Lieferzeit</span>
                <span className="text-white font-bold">1-2 Werktage</span>
              </div>
              <div className="pt-6 border-t border-zinc-800 flex items-center gap-4 text-zinc-500 text-sm">
                <Shield className="w-6 h-6 text-orange-500" />
                Deine Daten sind durch eine 256-Bit-SSL-Verschlüsselung geschützt.
              </div>
            </div>
            <button
              disabled={isProcessing}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 text-white py-6 rounded-full font-bold text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-orange-500/20"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                  Verarbeite...
                </span>
              ) : (
                <>Zahlungspflichtig bestellen <ArrowRight className="w-6 h-6" /></>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/warenkorb')}
              className="w-full mt-4 text-zinc-500 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Zurück zum Warenkorb
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
