import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  LabelList,
  ReferenceLine,
} from "recharts";
import ChartCard from "./ChartCard";

// Função simples pra calcular regressão linear
function getLinearTrend(data) {
  if (!data || data.length < 2) return [];
  const n = data.length;
  const sumX = data.reduce((acc, _, i) => acc + i, 0);
  const sumY = data.reduce((acc, d) => acc + d.value, 0);
  const sumXY = data.reduce((acc, d, i) => acc + i * d.value, 0);
  const sumX2 = data.reduce((acc, _, i) => acc + i * i, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return data.map((_, i) => ({
    name: data[i].name,
    trend: intercept + slope * i,
  }));
}

export default function RevenueChart({ data, metric, isDark }) {
  const chartData =
    data?.map((d) => ({
      name: new Date(d.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      value: Number(d.receita_prevista) || 0,
    })) || [];

  const trendLine = getLinearTrend(chartData);

  // 🎨 Tema
  const axisColor = isDark ? "#E0E0E0" : "#333";
  const gridColor = isDark ? "#2A2A2A" : "#E5E5E5";
  const tooltipBg = isDark ? "#1C1C1C" : "#FFFFFF";
  const tooltipBorder = isDark ? "#FFD700" : "#FF8C00";
  const tooltipText = isDark ? "#EAEAEA" : "#222";

  // 🎨 Cores dinâmicas por métrica
  const colorMap = {
    receita: "#FF8C00",
    ticket: "#FFD700",
    clientes: "#00BFA6",
    inatividade: "#FF4C4C",
  };
  const lineColor = colorMap[metric] || "#FF8C00";

  // 💬 Formatação
  const formatValue = (v) => {
    if (metric === "receita" || metric === "ticket") {
      return `R$ ${Number(v).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`;
    }
    if (metric === "inatividade") {
      return `${Number(v).toFixed(1)}%`;
    }
    return Math.round(Number(v));
  };

  const titleMap = {
    receita: "Evolução da Receita (30 dias)",
    ticket: "Evolução do Ticket Médio (30 dias)",
    clientes: "Variação de Clientes Ativos (30 dias)",
    inatividade: "Taxa de Inatividade (30 dias)",
  };

  return (
    <ChartCard title={titleMap[metric] || "Previsão"} isDark={isDark}>
      <div className="rounded-2xl p-4 transition-colors">
        <ResponsiveContainer width="100%" height={480}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              stroke={axisColor}
              tick={{ fill: axisColor, dy: 10 }}
              axisLine={{ stroke: axisColor }}
            />
            <YAxis
              stroke={axisColor}
              tick={{ fill: axisColor }}
              axisLine={{ stroke: axisColor }}
              domain={[0, "auto"]}
            />

            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            {/* Área e linha principal */}
            <Area type="monotone" dataKey="value" fill="url(#colorMetric)" />
            <Line
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={3}
              dot={{ stroke: lineColor, strokeWidth: 2, r: 3 }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="value"
                position="top"
                style={{
                  fill: lineColor,
                  fontSize: 12,
                  fontWeight: "600",
                }}
                formatter={formatValue}
              />
            </Line>

            {/* Linha de tendência linear tracejada */}
            <Line
              type="linear"
              dataKey="trend"
              data={trendLine}
              stroke={isDark ? "#8884d8" : "#4444ff"}
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
              name="Tendência"
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                color: tooltipText,
              }}
              itemStyle={{ color: tooltipText }}
              formatter={formatValue}
            />

            {/* Linha de referência horizontal para média */}
            <ReferenceLine
              y={
                chartData.reduce((acc, d) => acc + d.value, 0) /
                Math.max(chartData.length, 1)
              }
              stroke={isDark ? "#666" : "#ccc"}
              strokeDasharray="2 4"
              label={{
                value: "Média",
                position: "right",
                fill: tooltipText,
                fontSize: 12,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
