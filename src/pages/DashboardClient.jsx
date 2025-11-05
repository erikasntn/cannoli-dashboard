import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, SlidersHorizontal } from "lucide-react";
import { fetchInsights, exportReport } from "../api/insightsApi";
import useTheme from "../hooks/useTheme";

// Layout
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// KPIs e gráficos
import KpiGrid from "../components/kpis/KpiGrid";
import RevenueChart from "../components/charts/RevenueChart";
import CampaignsChart from "../components/charts/CampaignsChart";
import ComparisonTable from "../components/table/ComparisonTable";
import ClientSimulator from "../components/simulador/ClientSimulator";

// Inteligência Artificial
import CampaignInsights from "../components/insights/CampaignInsights";
import CampaignOptimizer from "../components/insights/CampaignOptimizer";
import AnomalyAlert from "../components/insights/AnomalyAlert";

export default function DashboardClient() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [metric, setMetric] = useState("receita");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark, toggleTheme, themeClasses } = useTheme();

  // === Carrega insights sempre que o período muda ===
  useEffect(() => {
    setLoading(true);
    fetchInsights(selectedPeriod)
      .then((data) => setInsights(data))
      .catch((err) => console.error("Erro ao buscar insights:", err))
      .finally(() => setLoading(false));
  }, [selectedPeriod]);

  const resumo = insights?.resumo_geral || {};

  // === Gera série de dados por métrica (30 dias) ===
  function buildSeriesByMetric(insights, metric) {
    const hoje = new Date();

    // agora são 30 dias
    const mkDates = (n = 15) =>
      [...Array(n)].map((_, i) =>
        new Date(
          hoje.getFullYear(),
          hoje.getMonth(),
          hoje.getDate() + i + 1
        ).toISOString()
      );

    if (!insights) return [];

    switch (metric) {
      // === Receita: usa previsão do backend (ou simulação leve)
      case "receita": {
        const baseData = insights.previsao_receita ?? [];
        if (baseData.length > 0) return baseData;

        const base = Number(insights?.resumo_geral?.receita_total || 0) / 30;
        const dates = mkDates();
        return dates.map((d, i) => ({
          data: d,
          receita_prevista: base * (1 + Math.sin(i / 5) * 0.1),
        }));
      }

      // === Ticket médio: mantém leve oscilação semanal
      case "ticket": {
        const base = Number(insights?.resumo_geral?.ticket_medio || 0);
        const dates = mkDates();
        return dates.map((d, i) => ({
          data: d,
          receita_prevista: base * (1 + Math.sin(i / 7) * 0.02),
        }));
      }

      // === Clientes ativos: cresce suavemente com reativações
      case "clientes": {
        const base = Number(insights?.resumo_geral?.clientes_ativos || 0);
        const reativ = Number(insights?.resumo_geral?.clientes_reativados || 0);
        const incDia = reativ / 30;
        const dates = mkDates();
        return dates.map((d, i) => ({
          data: d,
          receita_prevista: base + i * incDia,
        }));
      }

      // === Inatividade: tendência de queda gradual
      case "inatividade": {
        const base = Number(insights?.resumo_geral?.taxa_inatividade || 0);
        const dates = mkDates();
        return dates.map((d, i) => ({
          data: d,
          // decresce lentamente — melhora mês a mês
          receita_prevista: Math.max(0, base - i * 0.4),
        }));
      }

      default:
        return insights.previsao_receita ?? [];
    }
  }

  const serie = useMemo(
    () => buildSeriesByMetric(insights, metric),
    [insights, metric]
  );

  // === Tela de carregamento ===
  if (loading)
    return (
      <div
        className={`${themeClasses.bg} min-h-screen flex flex-col items-center justify-center`}
      >
        <div className="flex gap-3 items-center">
          <div className="w-3 h-3 rounded-full bg-[#FFD700] animate-bounce"></div>
          <div className="w-3 h-3 rounded-full bg-[#FF8C00] animate-bounce delay-150"></div>
          <div className="w-3 h-3 rounded-full bg-[#00BFA6] animate-bounce delay-300"></div>
        </div>
        <p className={`${themeClasses.muted} mt-4 text-sm`}>
          Carregando painel do cliente...
        </p>
      </div>
    );

  // === Renderização principal ===
  return (
    <motion.div
      key={selectedPeriod}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`${themeClasses.bg} ${themeClasses.text} min-h-screen flex flex-col transition-colors duration-500`}
    >
      {/* === HEADER === */}
      <Header
        isDark={isDark}
        toggleTheme={toggleTheme}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        muted={themeClasses.muted}
        border={themeClasses.border}
      />

      {/* === CONTEÚDO === */}
      <main className="flex-1 px-8 py-10 space-y-10">
        {/* === FILTROS === */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-[#FF8C00]" />
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="receita">Métrica: Receita</option>
              <option value="ticket">Métrica: Ticket Médio</option>
              <option value="clientes">Métrica: Clientes Ativos</option>
              <option value="inatividade">Métrica: Inatividade</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {["csv", "xlsx", "pdf"].map((ext) => (
              <button
                key={ext}
                onClick={() => exportReport(ext, selectedPeriod, { metric })}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5"
              >
                <Download size={16} /> {ext.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* === KPIs === */}
        <KpiGrid resumo={resumo} isDark={isDark} />

        {/* === INSIGHTS + IAs === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <CampaignsChart
            data={insights.campanhas_inteligentes}
            isDark={isDark}
          />
          <CampaignInsights
            insights={insights.campanha_insights}
            recomendacoes={insights.recomendacoes}
            isDark={isDark}
          />
          <CampaignOptimizer
            data={insights.otimizacao_campanhas}
            isDark={isDark}
          />
          <AnomalyAlert data={insights.anomalias} isDark={isDark} />
        </div>

        {/* === GRÁFICO DE MÉTRICA === */}
        <RevenueChart data={serie} metric={metric} isDark={isDark} />

        {/* === SIMULADOR === */}
        <ClientSimulator resumo={insights.resumo_geral} isDark={isDark} />

        {/* === TABELA DE COMPARAÇÃO === */}
        <ComparisonTable resumo={resumo} isDark={isDark} />
      </main>

      {/* === FOOTER === */}
      <Footer muted={themeClasses.muted} border={themeClasses.border} />
    </motion.div>
  );
}
