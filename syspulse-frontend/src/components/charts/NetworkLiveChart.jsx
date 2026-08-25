import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function NetworkLiveChart({ data, height = 220, compact = false }) {
  if (compact) {
    return (
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="download" stroke="var(--color-accent)" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="upload" stroke="#a78bfa" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--color-border)' }} tickLine={false} minTickGap={40} />
          <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: 'var(--color-text-muted)' }}
            formatter={(value, name) => [`${value} KB/s`, name === 'download' ? 'Download' : 'Upload']}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: 'var(--color-text-muted)' }} />
          <Line type="monotone" dataKey="download" name="Download" stroke="var(--color-accent)" strokeWidth={2} dot={false} isAnimationActive animationDuration={300} />
          <Line type="monotone" dataKey="upload" name="Upload" stroke="#a78bfa" strokeWidth={2} dot={false} isAnimationActive animationDuration={300} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default NetworkLiveChart;