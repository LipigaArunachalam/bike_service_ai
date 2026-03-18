import type { ReactNode } from 'react';
import './CardStats.css';

interface CardStatsProps {
  eyebrow: string;
  value: string | number;
  subLabel: string;
  icon: ReactNode;
  accentColor: string;
  delay?: number;
}

export default function CardStats({ eyebrow, value, subLabel, icon, accentColor, delay = 0 }: CardStatsProps) {
  return (
    <div
      className="card-stats card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="card-stats__accent" style={{ background: accentColor }} />
      <div className="card-stats__header">
        <span className="text-eyebrow">{eyebrow}</span>
        <div className="card-stats__icon" style={{ color: accentColor }}>
          {icon}
        </div>
      </div>
      <div className="card-stats__value text-mono" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div className="card-stats__sub">{subLabel}</div>
    </div>
  );
}
