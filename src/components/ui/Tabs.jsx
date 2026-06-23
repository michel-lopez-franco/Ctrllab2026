export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-surface-elevated/70 border border-surface-border rounded-lg mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-all duration-200 cursor-pointer ${
            active === tab
              ? 'bg-primary-500 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.3)] border border-primary-300/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-surface-hover/50'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
