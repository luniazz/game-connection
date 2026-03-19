'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";

export default function Home() {
  const [subtitle, setSubtitle] = useState("");
  const [userCount, setUserCount] = useState(0);
  
  const fullSubtitle = "A Game Connection é um espaço feito para gamers se conectarem, formarem duos, novas amizades e quem sabe, o achievement de final feliz.";

  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= fullSubtitle.length) {
        setSubtitle(fullSubtitle.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 30);

    const finalValue = Math.floor(Math.random() * (30000 - 5000 + 1)) + 5000;
    let startValue = 0;
    const duration = 2000;
    const increment = finalValue / (duration / 20);

    const counterInterval = setInterval(() => {
      startValue += increment;
      if (startValue >= finalValue) {
        setUserCount(finalValue);
        clearInterval(counterInterval);
      } else {
        setUserCount(Math.floor(startValue));
      }
    }, 20);

    return () => {
      clearInterval(typeInterval);
      clearInterval(counterInterval);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 relative overflow-hidden dark:bg-brand-dark transition-colors duration-500">
      
      {/* GLOW DE FUNDO */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-brand-green/10 rounded-full blur-[120px] -z-10 pointer-events-none opacity-60 dark:opacity-40"
        aria-hidden="true"
      ></div>

      <div className="container mx-auto max-w-5xl text-center z-10 flex flex-col items-center">
        
        {/* TÍTULO PRINCIPAL */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-10 leading-tight text-gray-900 dark:text-white animate-fade-in-up drop-shadow-2xl transition-colors duration-500">
          Mais que Partidas<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-400">
            Criamos Conexões
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-12 max-w-3xl leading-relaxed min-h-[80px] md:min-h-[60px] font-light transition-colors duration-500">
          {subtitle}
          <span className="animate-pulse text-brand-green font-bold" aria-hidden="true">|</span>
        </p>
        
        {/* BOTÃO DE AÇÃO */}
        <Link 
          href="/cadastro" 
          className="group relative inline-flex items-center justify-center bg-brand-green text-brand-dark text-lg md:text-xl font-extrabold rounded-lg px-12 py-4 mb-16 transition-all duration-300 ease-in-out shadow-[0_4px_0_0_#0ea149] hover:bg-brand-hover hover:-translate-y-1 hover:shadow-[0_6px_0_0_#10a14a] active:translate-y-0.5 active:shadow-none"
          aria-label="Ir para página de cadastro para encontrar seu match"
        >
          Encontre o seu Match
          <ArrowRight className="w-6 h-6 ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>

        {/* CONTADOR DE USUÁRIOS - CONTRASTE MELHORADO */}
        <div className="inline-flex items-center justify-center gap-5 px-10 py-4 rounded-2xl bg-white/60 dark:bg-brand-surface/40 backdrop-blur-md border border-brand-green/20 animate-fade-in-up hover:border-brand-green/40 transition-colors cursor-default min-w-[400px] shadow-lg">
          
          <div className="bg-brand-green/10 p-2.5 rounded-full">
            <Users className="text-brand-green w-6 h-6" aria-hidden="true" />
          </div>
          
          <div className="text-left">
            <span className="block font-mono font-bold text-gray-900 dark:text-white text-2xl leading-none mb-1 transition-colors duration-500">
              {userCount.toLocaleString("pt-BR")}
            </span>
            <span className="text-gray-600 dark:text-gray-300 text-sm uppercase tracking-widest font-bold transition-colors duration-500">
              gamers conectados
            </span>
          </div>
        </div>

      </div>
    </main>
  );
}