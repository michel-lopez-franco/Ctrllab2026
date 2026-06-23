import { X, Star, Trophy, Zap, Gift } from 'lucide-react'
import { Button, Badge } from '@/components/ui/index.js'
import { getLevelInfo } from '../logic/levels.js'
import { useEffect, useState } from 'react'

export function LevelUpModal({ level, onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const [confetti, setConfetti] = useState([])
  const levelInfo = getLevelInfo(level)

  useEffect(() => {
    setIsVisible(true)
    
    // Generate confetti
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
    }))
    setConfetti(particles)

    // Play sound effect (if enabled)
    // playSound('level_up')
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center p-4
      bg-black/70 backdrop-blur-sm
      transition-opacity duration-300
      ${isVisible ? 'opacity-100' : 'opacity-0'}
    `}>
      {/* Confetti */}
      {confetti.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: '-10px',
            background: `hsl(${Math.random() * 360}, 70%, 60%)`,
            animation: `confetti ${particle.duration}s ease-out ${particle.delay}s forwards`,
          }}
        />
      ))}

      <div className={`
        relative w-full max-w-md
        glass-strong rounded-3xl border-2 border-primary-500/50
        p-8 text-center
        shadow-2xl shadow-primary-500/30
        transition-all duration-300
        ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
      `}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-surface-elevated transition-colors flex items-center justify-center text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="relative inline-flex mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-2xl shadow-primary-500/50 animate-pulse-glow">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center shadow-lg animate-float">
            <Star className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-bold text-gradient mb-2">
          ¡Nivel {level}!
        </h2>
        <p className="text-2xl font-bold text-white mb-4">
          {levelInfo.name}
        </p>

        {/* Description */}
        <p className="text-slate-400 mb-6">
          Has alcanzado un nuevo nivel de maestría en control automático. ¡Sigue así!
        </p>

        {/* Rewards */}
        <div className="bg-surface-elevated rounded-2xl p-6 mb-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">
            Recompensas Desbloqueadas
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface rounded-xl p-4 border border-surface-border">
              <Zap className="w-8 h-8 text-primary-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Nuevo contenido</p>
              <p className="text-sm font-semibold text-white">desbloqueado</p>
            </div>
            
            <div className="bg-surface rounded-xl p-4 border border-surface-border">
              <Gift className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Bonus XP</p>
              <p className="text-sm font-semibold text-white">+{levelInfo.minXP * 0.1}</p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <Button 
          onClick={handleClose}
          size="lg"
          className="w-full"
          icon={<Star size={20} />}
        >
          ¡Continuar Aprendiendo!
        </Button>
      </div>
    </div>
  )
}
