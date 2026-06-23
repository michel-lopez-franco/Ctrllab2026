export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-slate-800 rounded-lg mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            active === tab
              ? 'bg-primary-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
