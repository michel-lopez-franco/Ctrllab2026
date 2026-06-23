export function Card({ children, className = '', accent = false, ...props }) {
  return (
    <div
      className={`bg-[#1e293b] rounded-xl border ${accent ? 'border-primary-500/40' : 'border-[#334155]'} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
