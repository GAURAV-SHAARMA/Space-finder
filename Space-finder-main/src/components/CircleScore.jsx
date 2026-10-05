import "./CircleScore.css";

export default function CircleScore({ score, size = 80, label, color }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const strokeColor = color || (score >= 85 ? "#10b981" : score >= 65 ? "#f59e0b" : "#ef4444");

  return (
    <div className="circle-score" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--border-solid)" strokeWidth="6"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={strokeColor} strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="circle-progress"
        />
      </svg>
      <div className="circle-inner">
        <span className="circle-val" style={{ color: strokeColor }}>{score}</span>
        {label && <span className="circle-label">{label}</span>}
      </div>
    </div>
  );
}
