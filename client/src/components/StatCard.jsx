export default function StatCard({ label, value, accent = 'blue' }) {
  return (
    <div className={`card stat-card ${accent}`}>
      <p className="label">{label}</p>
      <h3>{value}</h3>
    </div>
  );
}
