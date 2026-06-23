import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LEVELS, getLevelForXP } from '../logic/levels.js'
import { BADGES } from '../logic/badges.js'

export const useGamificationStore = create(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      badges: [],        // array of earned badge IDs
      missions: {
        daily: [],
        weekly: [],
      },
      stats: {
        simulationsRun: 0,
        challengesCompleted: 0,
        pidChallengesCompleted: 0,
        modulesCompleted: 0,
        totalTime: 0,
        streakDays: 0,
        bestSettlingTime: null,
        bestOvershoot: null,
        bestSteadyStateError: null,
        fastestChallenge: null,
      },
      pendingLevelUp: null, // nivel al que subió, para mostrar modal

      addXP: (amount) => {
        const { xp, level } = get()
        const newXP = xp + amount
        const newLevel = getLevelForXP(newXP)
        const leveledUp = newLevel > level
        set({
          xp: newXP,
          level: newLevel,
          pendingLevelUp: leveledUp ? newLevel : null,
        })
        return { leveledUp, newLevel }
      },

      clearLevelUp: () => set({ pendingLevelUp: null }),

      awardBadge: (badgeId) => {
        const { badges } = get()
        if (badges.includes(badgeId)) return false
        set({ badges: [...badges, badgeId] })
        return true
      },

      updateStats: (delta) => {
        const { stats } = get()
        // Keys prefixed with "$min" take the minimum instead of summing.
        // e.g. { $min_fastestChallenge: 42 } → stats.fastestChallenge = min(42, prev)
        const next = { ...stats }
        for (const [k, v] of Object.entries(delta)) {
          if (k.startsWith('$min_')) {
            const key = k.slice(5)
            next[key] = next[key] === null ? v : Math.min(next[key], v)
          } else if (typeof v === 'number' && typeof next[k] === 'number') {
            next[k] = next[k] + v
          } else {
            next[k] = v
          }
        }
        set({ stats: next })
      },

      checkBadges: () => {
        const { stats, badges, awardBadge, addXP } = get()
        const newBadges = []
        for (const badge of BADGES) {
          if (!badges.includes(badge.id) && badge.condition(stats)) {
            const awarded = awardBadge(badge.id)
            if (awarded) {
              addXP(badge.xpBonus)
              newBadges.push(badge)
            }
          }
        }
        return newBadges
      },
    }),
    { name: 'ctrllab-gamification' }
  )
)
