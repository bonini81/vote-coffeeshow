import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/** Barras horizontales de votos por cafetería, de la más votada a la menos votada. */
export default function VotosChart({ datos }) {
  const alto = Math.max(240, datos.length * 40 + 40);
  return (
    <div role="img" aria-label="Gráfico de votos por cafetería" style={{ height: alto }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 0 }}>
          <CartesianGrid horizontal={false} stroke="#e4dcd4" />
          <XAxis type="number" allowDecimals={false} tick={{ fill: '#6b625c', fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="nombre"
            width={110}
            tick={{ fill: '#1d1d1b', fontSize: 13, fontWeight: 600 }}
          />
          <Tooltip cursor={{ fill: '#fdecee' }} formatter={(v) => [v, 'Votos']} />
          <Bar dataKey="votos" fill="#d91828" radius={[0, 6, 6, 0]} isAnimationActive={false}>
            <LabelList dataKey="votos" position="right" style={{ fill: '#1d1d1b', fontWeight: 700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
