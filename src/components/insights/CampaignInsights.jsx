import { Lightbulb } from "lucide-react";

export default function CampaignInsights({ insights, recomendacoes = [], isDark }) {
  if (!insights) return null;

  const melhor = insights.melhor_campanha || {};
  const pior = insights.pior_campanha || {};
  const taxaMedia = insights.taxa_conversao_media || 0;

  const bg = isDark ? "bg-[#1C1C1C]" : "bg-white";
  const border = isDark ? "border-[#222]" : "border-gray-200";
  const text = isDark ? "text-[#EAEAEA]" : "text-[#222]";
  const highlight = isDark ? "text-[#FFD700]" : "text-[#DAA520]";

  return (
    <section className="flex flex-col gap-8">
      {/* 📊 INSIGHTS DE CAMPANHAS */}
      <div className={`${bg} p-6 rounded-2xl shadow-lg border ${border}`}>
        <h2 className={`${highlight} font-semibold mb-3 text-lg`}>
          Insights de Campanhas
        </h2>

        <div className={`space-y-3 text-sm ${text}`}>
          <p>
            <span className={`${highlight} font-medium`}>Taxa média:</span>{" "}
            {String(taxaMedia).includes("%") ? taxaMedia : `${taxaMedia}%`}
          </p>

          <p>
            <span className="text-[#00BFA6] font-medium">Melhor campanha:</span>{" "}
            {melhor.nome || "—"} (
            {String(melhor.taxa_conversao).includes("%")
              ? melhor.taxa_conversao
              : `${melhor.taxa_conversao || 0}%`}
            )
          </p>

          <p>
            <span className="text-red-400 font-medium">Pior campanha:</span>{" "}
            {pior.nome || "—"} (
            {String(pior.taxa_conversao).includes("%")
              ? pior.taxa_conversao
              : `${pior.taxa_conversao || 0}%`}
            )
          </p>
        </div>
      </div>

      {/* 💡 RECOMENDAÇÕES INTELIGENTES (IA) */}
      <div className={`${bg} p-6 rounded-2xl shadow-lg border ${border}`}>
        <h2 className={`${highlight} font-semibold mb-3 text-lg flex items-center gap-2`}>
          <Lightbulb className={highlight} /> Recomendações Inteligentes
        </h2>

        <ul className={`space-y-2 text-sm ${text}`}>
          {recomendacoes.length > 0 ? (
            recomendacoes.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2 leading-relaxed hover:translate-x-[2px] transition-transform duration-150"
              >
                <span className={highlight}>•</span>
                <span>{rec.replace("?", "").trim()}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-400 italic">
              Nenhuma recomendação disponível no momento.
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
