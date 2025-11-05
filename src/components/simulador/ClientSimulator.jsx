import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { TrendingUp, Users, RotateCcw } from "lucide-react";

export default function ClientSimulator({ resumo, isDark }) {
  const [reativacao, setReativacao] = useState(5);
  const [recompra, setRecompra] = useState(10);

  // === Cálculos dinâmicos ===
  const impacto = useMemo(() => {
    const baseReceita = resumo?.receita_total || 0;
    const baseClientes = resumo?.clientes_ativos || 1;

    const incrementoReceita = baseReceita * (recompra / 100);
    const incrementoClientes = baseClientes * (reativacao / 100);
    const novaReceita = baseReceita + incrementoReceita;
    const percentual = ((novaReceita - baseReceita) / baseReceita) * 100;

    return {
      incrementoReceita,
      incrementoClientes: Math.round(incrementoClientes),
      novaReceita,
      baseReceita,
      percentual,
    };
  }, [reativacao, recompra, resumo]);

  const chartData = useMemo(
    () => [
      { name: "Atual", valor: impacto.baseReceita },
      { name: "Estimado", valor: impacto.novaReceita },
    ],
    [impacto]
  );

  const gradientId = isDark ? "gradDark" : "gradLight";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl shadow-lg p-6 border ${
        isDark ? "bg-[#1E1E1E] border-[#333]" : "bg-white border-gray-200"
      }`}
    >
      <h3 className="text-lg font-semibold mb-3 text-[#FF8C00] flex items-center gap-2">
        <TrendingUp size={18} /> Simulador de Impacto 💡
      </h3>

      <p className="text-sm mb-6 text-gray-500 dark:text-gray-400">
        Ajuste os parâmetros abaixo e veja o potencial de crescimento da sua
        receita.
      </p>

      {/* === SLIDERS === */}
      <div className="space-y-5 mb-6">
        {/* SLIDER DE RECOMPRA */}
        <div className="relative">
          <label className="flex justify-between text-sm mb-1">
            <span>📈 Aumento na taxa de recompra</span>
            <motion.span
              key={recompra}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-[#FFD700] font-medium"
            >
              {recompra}%
            </motion.span>
          </label>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={recompra}
            onChange={(e) => {
              const novoValor = Number(e.target.value);
              setRecompra(novoValor);
            }}
            className="w-full accent-[#FF8C00] cursor-pointer"
          />
        </div>

        {/* SLIDER DE REATIVAÇÃO */}
        <div className="relative">
          <label className="flex justify-between text-sm mb-1">
            <span>🔄 Reativação de clientes inativos</span>
            <motion.span
              key={reativacao}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-[#FFD700] font-medium"
            >
              {reativacao}%
            </motion.span>
          </label>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={reativacao}
            onChange={(e) => {
              const novoValor = Number(e.target.value);
              setReativacao(novoValor);
            }}
            className="w-full accent-[#00BFA6] cursor-pointer"
          />
        </div>
      </div>

      {/* === SUBTÍTULO DINÂMICO === */}
      <motion.p
        key={impacto.percentual}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-sm mb-3 text-center font-medium"
      >
        💡 Seu faturamento pode crescer em{" "}
        <span
          className={`font-semibold ${
            impacto.percentual >= 0 ? "text-[#00BFA6]" : "text-red-500"
          }`}
        >
          +{impacto.percentual.toFixed(1)}%
        </span>
      </motion.p>

      {/* === RESULTADO VISUAL === */}
      <motion.div
        key={impacto.novaReceita}
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`p-4 rounded-xl ${
          isDark ? "bg-[#111]" : "bg-[#FFF9E5]"
        } border border-[#FFD700]/40`}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Receita atual:
          </p>
          <span className="font-semibold">
            R${" "}
            {impacto.baseReceita.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nova receita estimada:
          </p>
          <motion.span
            key={impacto.novaReceita}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="font-semibold text-[#00BFA6]"
          >
            R${" "}
            {impacto.novaReceita.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </motion.span>
        </div>

        {/* Atualiza dinamicamente agora ✅ */}
        <motion.div
          key={impacto.incrementoReceita}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-2"
        >
          <span className="flex items-center gap-2">
            <Users size={14} /> +{impacto.incrementoClientes.toFixed(1)}{" "}
            clientes
          </span>
          <span className="flex items-center gap-2">
            <RotateCcw size={14} /> +R$
            {impacto.incrementoReceita.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}{" "}
            em receita
          </span>
        </motion.div>
      </motion.div>

      {/* === GRÁFICO BONITO === */}
      <div className="mt-8 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barCategoryGap="35%"
            margin={{ top: 30, right: 20, left: 10, bottom: 20 }} // 👈 padding extra no topo
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                {isDark ? (
                  <>
                    <stop offset="0%" stopColor="#FFD700" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#FF8C00" stopOpacity={0.4} />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor="#00BFA6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#FFD700" stopOpacity={0.4} />
                  </>
                )}
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              tick={{
                fill: isDark ? "#AAA" : "#555",
                fontSize: 13,
                fontWeight: 500,
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
              tick={{ fill: isDark ? "#AAA" : "#555", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v) =>
                `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
              }
              contentStyle={{
                backgroundColor: isDark ? "#1E1E1E" : "#fff",
                borderRadius: "10px",
                border: "1px solid #FFD700",
                color: isDark ? "#fff" : "#333",
                fontSize: 13,
              }}
            />
            <Bar
              dataKey="valor"
              radius={[10, 10, 0, 0]}
              fill={`url(#${gradientId})`}
              barSize={40}
              animationDuration={700}
            >
              <LabelList
                dataKey="valor"
                position="top"
                formatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                fill={isDark ? "#FFF" : "#444"}
                fontSize={12}
                offset={8} // 👈 empurra o label um pouco pra baixo (evita corte)
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
