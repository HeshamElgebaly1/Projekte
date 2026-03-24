import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Shield, Truck, Users, Award } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-24">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4">Über uns</h1>
        <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
          Wir sind mehr als nur ein Hardware-Shop. Wir sind Enthusiasten, die dein System auf das nächste Level bringen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] overflow-hidden aspect-video shadow-2xl"
        >
          <img
            src="https://picsum.photos/seed/team/1200/800"
            alt="Unser Team"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </motion.div>

        <div className="space-y-8">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Unsere Mission</h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Gegründet von IT-Experten, ist es unser Ziel, hochwertige Hardware für jeden zugänglich zu machen. Ob du ein Gamer bist, der die maximale FPS sucht, oder ein Profi, der eine zuverlässige Workstation benötigt – wir haben die passende Lösung.
          </p>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Wir legen großen Wert auf Qualität, Transparenz und erstklassigen Service. Jede Komponente in unserem Shop wird sorgfältig ausgewählt und geprüft.
          </p>
          <div className="flex gap-8 pt-8">
            <div className="text-center">
              <div className="text-4xl font-black text-orange-500 italic uppercase tracking-tighter">10k+</div>
              <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Kunden</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-orange-500 italic uppercase tracking-tighter">500+</div>
              <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Produkte</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-orange-500 italic uppercase tracking-tighter">24/7</div>
              <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Support</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: <Zap className="w-10 h-10 text-orange-500" />, title: "Leidenschaft", desc: "Wir lieben Technik und leben Hardware." },
          { icon: <Shield className="w-10 h-10 text-orange-500" />, title: "Vertrauen", desc: "Sichere Zahlungen und garantierte Qualität." },
          { icon: <Award className="w-10 h-10 text-orange-500" />, title: "Exzellenz", desc: "Nur das Beste für dein System." },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-900/50 p-12 rounded-[3rem] border border-zinc-800 text-center"
          >
            <div className="flex justify-center mb-6">{item.icon}</div>
            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
            <p className="text-zinc-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
