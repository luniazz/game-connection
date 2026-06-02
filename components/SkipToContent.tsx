export default function SkipToContent() {
  return (
    <a
      href="#conteudo-principal"
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:top-4 focus:left-1/2 focus:-translate-x-1/2
        focus:z-[99999]
        focus:bg-brand-green focus:text-brand-dark
        focus:font-extrabold focus:text-base
        focus:px-6 focus:py-3 focus:rounded-lg
        focus:shadow-[0_4px_0_0_#0ea149]
        focus:outline-none focus:ring-2 focus:ring-white
        transition-all
      "
    >
      Pular para o conteúdo principal
    </a>
  );
}