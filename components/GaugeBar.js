'use client'

export default function GaugeBar({ value, max = 5, label, displayValue }) {
  return (
    <div>
      {label && (
        <span className="text-[10px] font-bold text-on-surface-variant block uppercase mb-2 tracking-label">
          {label}
        </span>
      )}
      <div className="flex gap-0.5 h-2 mb-2">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm ${
              i < value ? 'bg-primary' : 'bg-surface-container-highest'
            }`}
          />
        ))}
      </div>
      {displayValue && (
        <span className="text-xl font-bold tracking-tight">{displayValue}</span>
      )}
    </div>
  )
}
