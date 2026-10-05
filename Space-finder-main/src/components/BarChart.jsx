import "./BarChart.css";

export default function BarChart({ data, xKey, yKey, color = "#2563eb", title, height = 180 }) {
  const max = Math.max(...data.map((d) => d[yKey]));

  return (
    <div className="bar-chart-wrap glass-card">
      {title && <h4 className="chart-title">{title}</h4>}
      <div className="bar-chart" style={{ height }}>
        {data.map((item, i) => {
          const pct = (item[yKey] / max) * 100;
          return (
            <div key={i} className="bar-col">
              <div className="bar-tooltip">{item[yKey]}</div>
              <div
                className="bar"
                style={{
                  height: `${pct}%`,
                  background: `linear-gradient(180deg, ${color}, ${color}88)`,
                  animationDelay: `${i * 80}ms`,
                }}
              ></div>
              <span className="bar-label">{item[xKey]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
