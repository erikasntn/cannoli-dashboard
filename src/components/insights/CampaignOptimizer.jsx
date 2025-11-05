import { Clock, Send, Target } from "lucide-react";

export default function CampaignOptimizer({ data, isDark }) {
  if (!data || !data.canal_ideal) return null;
  const bg = isDark ? "bg-[#1C1C1C]" : "bg-white";

  return (
    <div className={`${bg} p-6 rounded-2xl border shadow-md`}>
      <h3 className="text-[#FFD700] font-semibold mb-4 text-lg flex items-center gap-2">
        <Target className="text-[#FFD700]" /> Otimização de Campanhas
      </h3>
      <ul className="space-y-2 text-sm">
        <li><Send className="inline text-[#00BFA6]" /> Canal ideal: <b>{data.canal_ideal}</b> ({data.taxa_canal}%)</li>
        <li><Clock className="inline text-[#FF8C00]" /> Horário ideal: <b>{data.horario_ideal}</b> ({data.taxa_horario}%)</li>
        <li>🎯 Tipo ideal: <b>{data.tipo_ideal}</b> ({data.taxa_tipo}%)</li>
      </ul>
    </div>
  );
}
