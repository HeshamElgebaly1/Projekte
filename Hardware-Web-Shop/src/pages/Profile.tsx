import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Order } from '../types';
import { motion } from 'motion/react';
import { Package, Truck, CheckCircle, Clock, LogOut, User, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { seedData } from '../services/seedService';

export function Profile() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isSeeding, setIsSeeding] = React.useState(false);
  const [ordersValue, loading] = useCollection(
    user ? query(collection(db, 'orders'), where('user_id', '==', user.uid), orderBy('order_date', 'desc')) : null
  );
  const orders = ordersValue?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)) || [];

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const handleSeed = async () => {
    if (!user) {
      alert('Bitte melde dich zuerst an.');
      return;
    }
    console.log('Current user for seeding:', user.email, user.uid);
    setIsSeeding(true);
    try {
      console.log('Starting force re-seed...');
      await seedData(true); // Force re-seed
      console.log('Seeding successful!');
      alert('Datenbank erfolgreich aktualisiert!');
      // Refresh the page to show new data
      window.location.reload();
    } catch (err) {
      console.error('Seeding error details:', err);
      alert(`Fehler beim Aktualisieren der Datenbank: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  if (loading) return <div className="p-24 text-center text-2xl font-bold">Lade Profil...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div className="flex items-center gap-6">
          <div className="bg-orange-500 p-6 rounded-full shadow-2xl shadow-orange-500/20">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">{user?.displayName || 'Benutzer'}</h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm mt-2">{user?.email}</p>
            {user?.email === 'heshamelgebaly0108@gmail.com' && (
              <button
                onClick={handleSeed}
                disabled={isSeeding}
                className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-xs text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all border border-zinc-700 disabled:opacity-50"
              >
                <Database className="w-3 h-3" /> {isSeeding ? 'Aktualisiere...' : 'Datenbank aktualisieren'}
              </button>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-all border border-zinc-800"
        >
          <LogOut className="w-5 h-5" /> Abmelden
        </button>
      </div>

      <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-4">
        <Package className="w-8 h-8 text-orange-500" /> Meine Bestellungen
      </h2>

      {orders.length === 0 ? (
        <div className="bg-zinc-900/50 p-16 rounded-[3rem] border border-zinc-800 text-center">
          <p className="text-zinc-400 text-xl">Du hast noch keine Bestellungen getätigt.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-8"
            >
              <div className="flex items-center gap-6">
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                  <Package className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Bestellnummer</div>
                  <div className="font-bold text-lg">#HS-{order.id.slice(0, 8).toUpperCase()}</div>
                </div>
              </div>

              <div className="text-center md:text-left">
                <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Datum</div>
                <div className="font-bold">{order.order_date.toDate().toLocaleDateString('de-DE')}</div>
              </div>

              <div className="text-center md:text-left">
                <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Gesamtbetrag</div>
                <div className="font-bold text-orange-500 text-xl">{order.total_amount.toFixed(2)} €</div>
              </div>

              <div className="flex items-center gap-3 bg-zinc-950 px-6 py-3 rounded-full border border-zinc-800">
                {order.status === 'pending' && <Clock className="w-5 h-5 text-yellow-500" />}
                {order.status === 'shipped' && <Truck className="w-5 h-5 text-blue-500" />}
                {order.status === 'delivered' && <CheckCircle className="w-5 h-5 text-green-500" />}
                <span className="font-bold uppercase tracking-widest text-xs">
                  {order.status === 'pending' && 'In Bearbeitung'}
                  {order.status === 'shipped' && 'Versandt'}
                  {order.status === 'delivered' && 'Zugestellt'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
