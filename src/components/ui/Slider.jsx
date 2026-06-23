export function Slider({ label, value, min, max, step = 0.01, onChange, unit = '', className = '' }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex justify-between text-sm">
        <label className="text-slate-300 font-mono">{label}</label>
        <span className="text-primary-400 font-mono font-semibold">
          {typeof value === 'number' ? value.toFixed(2) : value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
        className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-500"
      />
      <div className="flex justify-between text-xs text-slate-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
