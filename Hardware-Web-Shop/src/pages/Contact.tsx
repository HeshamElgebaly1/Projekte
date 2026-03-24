import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Cpu } from 'lucide-react';

export function Contact() {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-24">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4">Kontakt</h1>
        <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
          Hast du Fragen zu deiner Bestellung oder benötigst du eine Beratung? Wir sind für dich da.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-800">
            <div className="bg-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">E-Mail</h3>
            <p className="text-zinc-400">support@hardwareshop.de</p>
          </div>
          <div className="bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-800">
            <div className="bg-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Telefon</h3>
            <p className="text-zinc-400">+49 (0) 123 456 789</p>
          </div>
          <div className="bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-800">
            <div className="bg-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Standort</h3>
            <p className="text-zinc-400">Hardwarestraße 1, 12345 Berlin</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 p-16 rounded-[3rem] border border-orange-500/50 text-center h-full flex flex-col justify-center items-center"
            >
              <div className="bg-orange-500 p-6 rounded-full mb-8">
                <Send className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Nachricht gesendet!</h2>
              <p className="text-zinc-400 text-lg">Vielen Dank für deine Nachricht. Wir werden uns so schnell wie möglich bei dir melden.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-12 text-orange-500 font-bold hover:text-orange-400 transition-colors"
              >
                Weitere Nachricht senden
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-zinc-900 p-12 rounded-[3rem] border border-zinc-800 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Name</label>
                  <input required type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-orange-500 outline-none transition-colors" placeholder="Dein Name" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">E-Mail</label>
                  <input required type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-orange-500 outline-none transition-colors" placeholder="Deine E-Mail" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Betreff</label>
                <input required type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-orange-500 outline-none transition-colors" placeholder="Wie können wir helfen?" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Nachricht</label>
                <textarea required rows={6} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:border-orange-500 outline-none transition-colors resize-none" placeholder="Deine Nachricht an uns..."></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-full font-bold text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-orange-500/20"
              >
                Nachricht senden <Send className="w-6 h-6" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
