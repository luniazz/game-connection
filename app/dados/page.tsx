'use client';

import { useEffect, useState } from "react";
import { Gamepad2, Users, Globe, Search, TrendingUp, TrendingDown } from "lucide-react";
import CardStat from "@/components/CardStat";
import Image from "next/image";

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  genres: { name: string }[];
}

export default function DadosPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  const [usuariosIniciais, setUsuariosIniciais] = useState(10000);
  const [taxaCrescimento, setTaxaCrescimento] = useState(15);
  const [meses, setMeses] = useState(12);
  const [capacidadeMaxima, setCapacidadeMaxima] = useState(100000);
  const [velocidadeRetencao, setVelocidadeRetencao] = useState(0.3);

  const getUsuariosIniciaisValidos = () => usuariosIniciais > 0 ? usuariosIniciais : 1000;
  const getTaxaCrescimentoValida = () => taxaCrescimento > 0 && taxaCrescimento <= 100 ? taxaCrescimento : 10;
  const getMesesValidos = () => meses > 0 && meses <= 36 ? meses : 12;
  const getCapacidadeMaxima = () => capacidadeMaxima > 0 ? capacidadeMaxima : 100000;
  const getVelocidadeRetencao = () => velocidadeRetencao > 0 && velocidadeRetencao <= 1 ? velocidadeRetencao : 0.3;

  const dadosTabela = [
    { indicador: "População que joga games digitais (2025)", valor: "82,8 %", fonte: "PGB 2025" },
    { indicador: "Jogos digitais como diversão principal", valor: "80,1 %", fonte: "PGB 2025" },
    { indicador: "Mulheres gamers no Brasil", valor: "53,2 %", fonte: "PGB 2025" },
    { indicador: "Faixa etária principal (Millennials)", valor: "30–44 anos", fonte: "PGB 2025" },
    { indicador: "Plataforma favorita: Smartphone", valor: "40,8 %", fonte: "PGB 2025" },
    { indicador: "Jogadores de Console", valor: "24,7 %", fonte: "PGB 2025" },
    { indicador: "Jogadores de PC", valor: "20,3 %", fonte: "PGB 2025" },
    { indicador: "Total de jogadores no Brasil", valor: "103 mi", fonte: "Setor de games" },
  ];

  const dadosFiltrados = dadosTabela.filter(item =>
    (item.indicador + item.valor + item.fonte).toLowerCase().includes(filtro.toLowerCase())
  );

  const calcularCrescimento = (u0: number, taxa: number, tempo: number) => {
    const r = taxa / 100;
    return u0 * Math.pow(1 + r, tempo);
  };

  const gerarDadosGrafico = () => {
    const dados = [];
    const u0 = getUsuariosIniciaisValidos();
    const taxa = getTaxaCrescimentoValida();
    const periodo = getMesesValidos();
    for (let mes = 0; mes <= periodo; mes++) {
      const usuarios = calcularCrescimento(u0, taxa, mes);
      dados.push({ mes, usuarios: Math.round(usuarios) });
    }
    return dados;
  };

  const dadosGrafico = gerarDadosGrafico();
  const usuariosFinais = dadosGrafico[dadosGrafico.length - 1].usuarios;
  const crescimentoTotal = ((usuariosFinais - getUsuariosIniciaisValidos()) / getUsuariosIniciaisValidos()) * 100;
  const valorMaximo = Math.max(...dadosGrafico.map(d => d.usuarios));

  const calcularRetencao = (t: number) => {
    const K = getCapacidadeMaxima();
    const k = getVelocidadeRetencao();
    return K * (1 - Math.exp(-k * t));
  };

  const gerarDadosRetencao = () => {
    const periodo = getMesesValidos();
    return Array.from({ length: periodo + 1 }, (_, mes) => ({
      mes,
      usuarios: Math.round(calcularRetencao(mes)),
    }));
  };

  const dadosRetencao = gerarDadosRetencao();
  const retencaoFinal = dadosRetencao[dadosRetencao.length - 1].usuarios;
  const limiteTeoricoFormatado = getCapacidadeMaxima().toLocaleString("pt-BR");
  const percentualSaturacao = ((retencaoFinal / getCapacidadeMaxima()) * 100).toFixed(1);

  useEffect(() => {
    async function fetchGames() {
      try {
        const apiKey = 'c542e67aec3a4340908f9de9e86038af';
        const url = `https://api.rawg.io/api/games?key=${apiKey}&tags=co-op&genres=indie,family,adventure,platformer&dates=2016-01-01,2025-12-31&metacritic=80,100&ordering=-added&page_size=6`;
        const response = await fetch(url);
        const data = await response.json();
        setGames(data.results);
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  // Classes reutilizáveis para foco

  const focusGreen = "focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/50 focus:shadow-[0_0_0_4px_rgba(29,229,109,0.1)] transition-all";
  const focusCyan  = "focus:outline-none focus:border-[#0dcaf0] focus:ring-2 focus:ring-[#0dcaf0]/40 focus:shadow-[0_0_0_4px_rgba(13,202,240,0.1)] transition-all";

  return (
    <div className="min-h-screen bg-brand-dark pt-40 pb-20 px-4 relative overflow-hidden">

      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(29,229,109,0.3) 0%, rgba(2,1,30,0) 70%)' }}
        aria-hidden="true"
      ></div>

      <main className="container mx-auto max-w-6xl relative z-10" aria-label="Página de Pesquisa e Dados do mercado gamer">

        {/* CABEÇALHO */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-xl">
            Panorama do <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-400">Mercado</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Dados demográficos atualizados e os jogos cooperativos mais aclamados pela crítica nos últimos anos.
          </p>
        </div>

        {/* CARDS DE ESTATÍSTICA */}
        <section aria-label="Estatísticas gerais do mercado gamer brasileiro" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <CardStat icon={<Gamepad2 size={32} aria-hidden="true" />} finalValue={82.8} text="da população joga" suffix="%" />
          <CardStat icon={<Users size={32} aria-hidden="true" />} finalValue={53.2} text="são mulheres" suffix="%" />
          <CardStat icon={<Globe size={32} aria-hidden="true" />} finalValue={103} text="milhões de gamers" suffix="M" />
        </section>

        {/* MÓDULO 1 — CRESCIMENTO EXPONENCIAL */}
        <section aria-label="Simulação de crescimento de usuários" className="mb-20">
          <h2 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
            <span className="w-2 h-10 bg-brand-green rounded-full" aria-hidden="true"></span>
            Simulação de Crescimento de Usuários
          </h2>

          <div role="group" aria-labelledby="controles-simulacao-titulo" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <span id="controles-simulacao-titulo" className="sr-only">Parâmetros da simulação de crescimento</span>

            <div className="bg-brand-surface/60 backdrop-blur-md border border-white/10 rounded-xl p-4">
              <label htmlFor="usuarios-iniciais" className="block text-xs font-semibold mb-2 text-gray-300">
                Usuários Iniciais (U₀)
              </label>
              <input
                id="usuarios-iniciais"
                type="number"
                value={usuariosIniciais}
                onChange={(e) => setUsuariosIniciais(Number(e.target.value) || 1000)}
                className={`w-full bg-brand-green text-brand-dark font-bold px-3 py-2 rounded-lg text-sm ${focusGreen}`}
                min="100"
                step="1000"
                aria-label="Número inicial de usuários para a simulação"
                aria-required="true"
                aria-describedby="usuarios-iniciais-desc"
              />
              <span id="usuarios-iniciais-desc" className="sr-only">Valor mínimo: 100 usuários.</span>
            </div>

            <div className="bg-brand-surface/60 backdrop-blur-md border border-white/10 rounded-xl p-4">
              <label htmlFor="taxa-crescimento" className="block text-xs font-semibold mb-2 text-gray-300">
                Taxa de Crescimento (% mês)
              </label>
              <input
                id="taxa-crescimento"
                type="number"
                value={taxaCrescimento}
                onChange={(e) => setTaxaCrescimento(Number(e.target.value) || 10)}
                className={`w-full bg-brand-green text-brand-dark font-bold px-3 py-2 rounded-lg text-sm ${focusGreen}`}
                min="1"
                max="50"
                aria-label="Taxa de crescimento mensal em porcentagem"
                aria-required="true"
                aria-describedby="taxa-crescimento-desc"
              />
              <span id="taxa-crescimento-desc" className="sr-only">Valor entre 1% e 50% ao mês.</span>
            </div>

            <div className="bg-brand-surface/60 backdrop-blur-md border border-white/10 rounded-xl p-4">
              <label htmlFor="periodo-meses" className="block text-xs font-semibold mb-2 text-gray-300">
                Período (meses)
              </label>
              <input
                id="periodo-meses"
                type="number"
                value={meses}
                onChange={(e) => setMeses(Number(e.target.value) || 12)}
                className={`w-full bg-brand-green text-brand-dark font-bold px-3 py-2 rounded-lg text-sm ${focusGreen}`}
                min="1"
                max="24"
                aria-label="Período de projeção em meses"
                aria-required="true"
                aria-describedby="periodo-meses-desc"
              />
              <span id="periodo-meses-desc" className="sr-only">Valor entre 1 e 24 meses.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" aria-live="polite" aria-label="Resultados da simulação de crescimento">
            <div className="bg-brand-surface/60 border-2 border-brand-green rounded-xl p-6 text-center">
              <TrendingUp size={40} className="mx-auto mb-3 text-brand-green" aria-hidden="true" />
              <h3 className="text-3xl font-extrabold text-brand-green mb-1">{usuariosFinais.toLocaleString("pt-BR")}</h3>
              <p className="text-gray-300 text-sm">Usuários Projetados</p>
            </div>
            <div className="bg-brand-surface/60 border-2 border-[#0dcaf0] rounded-xl p-6 text-center">
              <TrendingUp size={40} className="mx-auto mb-3 text-[#0dcaf0]" aria-hidden="true" />
              <h3 className="text-3xl font-extrabold text-[#0dcaf0] mb-1">+{crescimentoTotal.toFixed(1)}%</h3>
              <p className="text-gray-300 text-sm">Crescimento Total</p>
            </div>
            <div className="bg-brand-surface/60 border-2 border-[#ffc107] rounded-xl p-6 text-center">
              <Users size={40} className="mx-auto mb-3 text-[#ffc107]" aria-hidden="true" />
              <h3 className="text-3xl font-extrabold text-[#ffc107] mb-1">{getMesesValidos()} meses</h3>
              <p className="text-gray-300 text-sm">Período de Análise</p>
            </div>
          </div>

          <div className="bg-brand-surface/60 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Curva de Crescimento Exponencial</h3>
            <div
              className="relative h-64 bg-brand-dark/50 rounded-lg p-4"
              role="img"
              aria-label={`Gráfico de crescimento exponencial de ${getUsuariosIniciaisValidos().toLocaleString("pt-BR")} para ${usuariosFinais.toLocaleString("pt-BR")} usuários em ${getMesesValidos()} meses`}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1DE56D" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#1DE56D" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  points={`0,100 ${dadosGrafico.map((d, i) => {
                    const x = (i / getMesesValidos()) * 100;
                    const y = 100 - (d.usuarios / valorMaximo) * 100;
                    return `${x},${y}`;
                  }).join(" ")} 100,100`}
                  fill="url(#areaGradient)"
                />
                <polyline
                  points={dadosGrafico.map((d, i) => {
                    const x = (i / getMesesValidos()) * 100;
                    const y = 100 - (d.usuarios / valorMaximo) * 100;
                    return `${x},${y}`;
                  }).join(" ")}
                  fill="none" stroke="#1DE56D" strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"
                />
                {dadosGrafico.map((d, i) => {
                  const x = (i / getMesesValidos()) * 100;
                  const y = 100 - (d.usuarios / valorMaximo) * 100;
                  return <circle key={i} cx={x} cy={y} r="0.8" fill="#1DE56D" vectorEffect="non-scaling-stroke" />;
                })}
              </svg>
            </div>
            <div className="mt-4 p-4 bg-brand-dark/40 rounded-lg border border-white/5">
              <p className="text-xs text-gray-400 leading-relaxed">
                <span className="text-white font-semibold">Como ler este gráfico: </span>
                a linha verde mostra como o número de usuários cresce ao longo do tempo.
                Cada ponto na linha representa um mês. Quanto mais à direita, mais distante no futuro.
                Quanto mais alto o ponto, maior o número de usuários naquele mês.
                O crescimento acelera com o tempo — por isso a curva sobe cada vez mais rápido —
                partindo de{" "}
                <span className="text-brand-green font-bold">{getUsuariosIniciaisValidos().toLocaleString("pt-BR")}</span>
                {" "}e chegando a{" "}
                <span className="text-brand-green font-bold">{usuariosFinais.toLocaleString("pt-BR")} usuários</span>
                {" "}ao final de{" "}
                <span className="text-brand-green font-bold">{getMesesValidos()} meses</span>.
              </p>
            </div>
          </div>
        </section>

        {/* MÓDULO 2 — SATURAÇÃO */}
        <section aria-label="Análise de tendência de retenção e saturação de mercado" className="mb-20">
          <h2 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
            <span className="w-2 h-10 bg-[#0dcaf0] rounded-full" aria-hidden="true"></span>
            Tendência de Crescimento com Limite de Saturação
          </h2>

          <div role="group" aria-labelledby="controles-retencao-titulo" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <span id="controles-retencao-titulo" className="sr-only">Parâmetros do modelo de retenção</span>

            <div className="bg-brand-surface/60 backdrop-blur-md border border-white/10 rounded-xl p-4">
              <label htmlFor="capacidade-maxima" className="block text-xs font-semibold mb-2 text-gray-300">
                Capacidade Máxima do Mercado 
              </label>
              <input
                id="capacidade-maxima"
                type="number"
                value={capacidadeMaxima}
                onChange={(e) => setCapacidadeMaxima(Number(e.target.value) || 100000)}
                className={`w-full bg-[#0dcaf0] text-brand-dark font-bold px-3 py-2 rounded-lg text-sm ${focusCyan}`}
                min="1000"
                step="10000"
                aria-label="Capacidade máxima de usuários que a plataforma pode atingir"
                aria-describedby="capacidade-maxima-desc"
              />
              <span id="capacidade-maxima-desc" className="sr-only">Representa o limite teórico de usuários. A curva nunca ultrapassa este valor.</span>
            </div>

            <div className="bg-brand-surface/60 backdrop-blur-md border border-white/10 rounded-xl p-4">
              <label htmlFor="velocidade-retencao" className="block text-xs font-semibold mb-2 text-gray-300">
                Velocidade de Saturação (0.1 a 1.0)
              </label>
              <input
                id="velocidade-retencao"
                type="number"
                value={velocidadeRetencao}
                onChange={(e) => setVelocidadeRetencao(Number(e.target.value) || 0.3)}
                className={`w-full bg-[#0dcaf0] text-brand-dark font-bold px-3 py-2 rounded-lg text-sm ${focusCyan}`}
                min="0.1"
                max="1"
                step="0.1"
                aria-label="Velocidade com que a curva se aproxima da capacidade máxima"
                aria-describedby="velocidade-retencao-desc"
              />
              <span id="velocidade-retencao-desc" className="sr-only">Valores maiores fazem a curva saturar mais rápido. Entre 0.1 (lento) e 1.0 (rápido).</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" aria-live="polite" aria-label="Resultados do modelo de retenção">
            <div className="bg-brand-surface/60 border-2 border-[#0dcaf0] rounded-xl p-6 text-center">
              <TrendingUp size={40} className="mx-auto mb-3 text-[#0dcaf0]" aria-hidden="true" />
              <h3 className="text-3xl font-extrabold text-[#0dcaf0] mb-1">{retencaoFinal.toLocaleString("pt-BR")}</h3>
              <p className="text-gray-300 text-sm">Usuários Totais Estimados</p>
            </div>
            <div className="bg-brand-surface/60 border-2 border-[#ffc107] rounded-xl p-6 text-center">
              <TrendingDown size={40} className="mx-auto mb-3 text-[#ffc107]" aria-hidden="true" />
              <h3 className="text-3xl font-extrabold text-[#ffc107] mb-1">{percentualSaturacao}%</h3>
              <p className="text-gray-300 text-sm">Saturação Atingida</p>
            </div>
            <div className="bg-brand-surface/60 border-2 border-brand-green rounded-xl p-6 text-center">
              <Users size={40} className="mx-auto mb-3 text-brand-green" aria-hidden="true" />
              <h3 className="text-3xl font-extrabold text-brand-green mb-1">{limiteTeoricoFormatado}</h3>
              <p className="text-gray-300 text-sm">Limite Teórico</p>
            </div>
          </div>

          <div className="bg-brand-surface/60 border border-white/10 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
              <h3 className="text-lg font-bold text-white">Curva de Saturação de Mercado</h3>
              <span className="text-xs text-gray-400 bg-brand-dark/60 px-3 py-1 rounded-full border border-white/10">
                Linha tracejada = limite ({limiteTeoricoFormatado} usuários)
              </span>
            </div>
            <div
              className="relative h-64 bg-brand-dark/50 rounded-lg p-4"
              role="img"
              aria-label={`Gráfico de saturação mostrando tendência de retenção que se aproxima do limite de ${limiteTeoricoFormatado} usuários. Ao final do período, ${percentualSaturacao}% do limite foi atingido.`}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="retencaoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0dcaf0" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0dcaf0" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="5" x2="100" y2="5" stroke="#ffc107" strokeWidth="0.6" strokeDasharray="3,2" vectorEffect="non-scaling-stroke" />
                <polygon
                  points={`0,100 ${dadosRetencao.map((d, i) => {
                    const x = (i / getMesesValidos()) * 100;
                    const y = 100 - (d.usuarios / getCapacidadeMaxima()) * 95;
                    return `${x},${y}`;
                  }).join(" ")} 100,100`}
                  fill="url(#retencaoGradient)"
                />
                <polyline
                  points={dadosRetencao.map((d, i) => {
                    const x = (i / getMesesValidos()) * 100;
                    const y = 100 - (d.usuarios / getCapacidadeMaxima()) * 95;
                    return `${x},${y}`;
                  }).join(" ")}
                  fill="none" stroke="#0dcaf0" strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"
                />
                {dadosRetencao.map((d, i) => {
                  const x = (i / getMesesValidos()) * 100;
                  const y = 100 - (d.usuarios / getCapacidadeMaxima()) * 95;
                  return <circle key={i} cx={x} cy={y} r="0.8" fill="#0dcaf0" vectorEffect="non-scaling-stroke" />;
                })}
              </svg>
            </div>
            <div className="mt-4 p-4 bg-brand-dark/40 rounded-lg border border-white/5">
              <p className="text-xs text-gray-400 leading-relaxed">
                <span className="text-white font-semibold">Como ler este gráfico: </span>
                a curva cresce mais rápido no início, quando novos usuários entram na plataforma, e depois vai diminuindo o ritmo conforme se aproxima do limite máximo.
                A linha amarela tracejada indica esse limite, ou seja, o total de usuários que a plataforma pode alcançar.
                Atualmente, com {getMesesValidos()} meses de operação, a plataforma chegaria a{" "}
                <span className="text-[#0dcaf0] font-bold">{percentualSaturacao}%</span> desse total.
              </p>
            </div>
          </div>
        </section>

        {/* TABELA */}
        <section aria-label="Tabela de perfil do gamer brasileiro" className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-brand-green rounded-full" aria-hidden="true"></span>
              Perfil do Gamer Brasileiro
            </h2>
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-green">
                <Search size={18} aria-hidden="true" />
              </div>
              <input
                type="text"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                placeholder="Filtrar dados..."
                aria-label="Filtrar dados da tabela por indicador, valor ou fonte"
                aria-controls="tabela-gamer"
                className={`w-full bg-brand-surface/80 border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl placeholder:text-gray-400 backdrop-blur-sm ${focusGreen}`}
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm bg-brand-surface/30">
            <table id="tabela-gamer" className="w-full text-left border-collapse" aria-label="Dados do perfil do gamer brasileiro" aria-live="polite">
              <thead>
                <tr className="bg-brand-surface text-gray-400 border-b border-white/10">
                  <th scope="col" className="p-5 font-semibold">Indicador</th>
                  <th scope="col" className="p-5 font-semibold">Valor</th>
                  <th scope="col" className="p-5 font-semibold">Fonte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dadosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-5 text-center text-gray-300" role="alert">
                      Nenhum resultado encontrado para &quot;{filtro}&quot;.
                    </td>
                  </tr>
                ) : (
                  dadosFiltrados.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors group">
                      <td className="p-5 text-gray-200 font-medium">{item.indicador}</td>
                      <td className="p-5 text-brand-green font-bold text-lg group-hover:scale-105 transition-transform origin-left">{item.valor}</td>
                      <td className="p-5 text-gray-300 text-sm">{item.fonte}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* JOGOS DA API */}
        <section aria-label="Jogos cooperativos recomendados via API RAWG">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-8">
            <span className="w-2 h-8 bg-brand-green rounded-full" aria-hidden="true"></span>
            Recomendados: Melhores Co-op (API RAWG)
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-64" role="status" aria-live="polite">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green" aria-hidden="true"></div>
              <span className="sr-only">Carregando jogos recomendados, aguarde...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <article
                  key={game.id}
                  className="group bg-brand-surface/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-brand-green/50 transition-all hover:shadow-[0_0_30px_rgba(29,229,109,0.15)] hover:-translate-y-2"
                  aria-label={`Jogo: ${game.name}, avaliação ${game.rating} de 5 estrelas`}
                >
                  <div className="relative h-48 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={game.background_image}
                      alt={`Imagem de capa do jogo ${game.name}, gênero ${game.genres[0]?.name || 'cooperativo'}, avaliação ${game.rating} estrelas`}
                      title={`${game.name} - ${game.genres[0]?.name || 'Co-op'} | Avaliação: ${game.rating}★`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div
                      className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-brand-green font-bold px-3 py-1 rounded-lg border border-brand-green/20 text-sm"
                      aria-label={`Avaliação: ${game.rating} de 5 estrelas`}
                    >
                      ★ {game.rating}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1" title={game.name}>{game.name}</h3>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs font-bold text-brand-dark bg-brand-green px-2 py-1 rounded-md uppercase truncate max-w-[60%]">
                        {game.genres[0]?.name || "Co-op"}
                      </span>
                      <p className="text-gray-300 text-xs" aria-label={`Ano de lançamento: ${game.released ? new Date(game.released).getFullYear() : 'não informado'}`}>
                        {game.released ? new Date(game.released).getFullYear() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}