export default function AnomalyAlert({ data, isDark }) {
  if (!data || data.length === 0) return null;
  const bg = isDark ? "bg-[#1C1C1C]" : "bg-white";

  return (
    <div className={`${bg} p-6 rounded-2xl border shadow-md`}>
      <h3 className="text-[#FFD700] font-semibold mb-3 text-lg">
        🚨 Detecção de Anomalias
      </h3>
      <ul className="space-y-1 text-sm">
        {data.map((a, i) => (
          <li key={i}>
            {a.tipo === "queda" ? "📉" : "📈"}{" "}
            <b>{a.tipo === "queda" ? "Queda" : "Pico"}</b> em{" "}
            {new Date(a.data).toLocaleDateString("pt-BR")} — R$
            {a.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </li>
        ))}
      </ul>
    </div>
  );
}
