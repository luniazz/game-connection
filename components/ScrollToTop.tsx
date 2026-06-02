'use client';

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollToTop}
      aria-label="Voltar ao topo da página"
      title="Voltar ao topo"
      className={`
        fixed bottom-6 left-6 z-[9999]
        p-4 rounded-full border-2 border-white bg-brand-green text-brand-dark
        shadow-[0_0_20px_rgba(29,229,109,0.4)]
        transition-all duration-300 ease-in-out
        hover:scale-110 hover:bg-brand-hover
        focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 focus:ring-offset-brand-dark
        ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
    >
      <ArrowUp size={24} aria-hidden="true" />
    </button>
  );
}
