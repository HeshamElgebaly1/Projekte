import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { UserPlus, ArrowRight, Shield, Cpu, LogIn } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const [firstname, setFirstname] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: `${firstname} ${lastname}` });

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstname,
        lastname,
        email,
        role: 'user',
      });

      navigate('/');
    } catch (err) {
      setError('Registrierung fehlgeschlagen. Bitte prüfe deine Daten.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex justify-center items-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 p-12 rounded-[3rem] border border-zinc-800 w-full max-w-xl shadow-2xl"
      >
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-orange-500 p-4 rounded-3xl">
              <Cpu className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4">Konto erstellen</h1>
          <p className="text-zinc-400">Werde Teil der Hardware-Community.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl mb-8 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6 mb-12">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Vorname</label>
              <input
                required
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-orange-500 outline-none transition-colors"
                placeholder="Max"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Nachname</label>
              <input
                required
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-orange-500 outline-none transition-colors"
                placeholder="Mustermann"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">E-Mail Adresse</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-orange-500 outline-none transition-colors"
              placeholder="name@beispiel.de"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Passwort</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-orange-500 outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-full font-bold text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-orange-500/20"
          >
            Registrieren <UserPlus className="w-6 h-6" />
          </button>
        </form>

        <div className="text-center">
          <p className="text-zinc-400 mb-4">Bereits ein Konto?</p>
          <Link
            to="/login"
            className="text-orange-500 hover:text-orange-400 font-bold text-lg flex items-center justify-center gap-2 transition-colors"
          >
            Jetzt anmelden <LogIn className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
