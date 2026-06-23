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
        perfectScores: 0,
        hintsUsed: 0,
        collaborativeChallenges: 0,
      },
      pendingLevelUp: null, // nivel al que subió, para mostrar modal
      notifications: [], // notificaciones de logros y eventos
      achievements: [], // logros recientes para mostrar
      dailyStreak: {
        current: 0,
        lastVisit: null,
        longestStreak: 0,
      },
      leaderboard: {
        position: null,
        totalUsers: 0,
      },
      preferences: {
        soundEnabled: true,
        animationsEnabled: true,
        notificationsEnabled: true,
      },

      addXP: (amount, source = 'general') => {
        const { xp, level } = get()
        const newXP = xp + amount
        const newLevel = getLevelForXP(newXP)
        const leveledUp = newLevel > level
        
        // Solo notificar XP si es una cantidad significativa (>= 50)
        if (amount >= 50) {
          get().addNotification({
            type: 'xp',
            message: `+${amount} XP ganados`,
            source,
            timestamp: Date.now(),
          })
        }

        set({
          xp: newXP,
          level: newLevel,
          pendingLevelUp: leveledUp ? newLevel : null,
        })

        if (leveledUp) {
          get().addNotification({
            type: 'level_up',
            message: `¡Subiste al nivel ${newLevel}!`,
            level: newLevel,
            timestamp: Date.now(),
          })
        }

        return { leveledUp, newLevel }
      },

      clearLevelUp: () => set({ pendingLevelUp: null }),

      awardBadge: (badgeId) => {
        const { badges } = get()
        if (badges.includes(badgeId)) return false
        
        const badge = BADGES.find(b => b.id === badgeId)
        set({ badges: [...badges, badgeId] })
        
        if (badge) {
          get().addNotification({
            type: 'badge',
            message: `¡Insignia desbloqueada: ${badge.name}!`,
            badge,
            timestamp: Date.now(),
          })
          get().addAchievement({
            type: 'badge',
            badge,
            timestamp: Date.now(),
          })
        }
        
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
              addXP(badge.xpBonus, `badge:${badge.id}`)
              newBadges.push(badge)
            }
          }
        }
        return newBadges
      },

      updateDailyStreak: () => {
        const { dailyStreak } = get()
        const now = new Date()
        const today = now.toDateString()
        
        if (!dailyStreak.lastVisit) {
          // First visit - no notification
          set({
            dailyStreak: {
              current: 1,
              lastVisit: today,
              longestStreak: 1,
            }
          })
          return 1
        }

        const lastVisit = new Date(dailyStreak.lastVisit)
        const daysDiff = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24))

        if (daysDiff === 0) {
          // Same day, no change
          return dailyStreak.current
        } else if (daysDiff === 1) {
          // Consecutive day
          const newStreak = dailyStreak.current + 1
          const newLongest = Math.max(newStreak, dailyStreak.longestStreak)
          
          set({
            dailyStreak: {
              current: newStreak,
              lastVisit: today,
              longestStreak: newLongest,
            },
            stats: { ...get().stats, streakDays: newStreak }
          })
          
          // Solo notificar en hitos importantes (7, 14, 30 días)
          if (newStreak % 7 === 0) {
            get().addNotification({
              type: 'streak_milestone',
              message: `¡${newStreak} días de racha! 🔥`,
              timestamp: Date.now(),
            })
          }
          
          return newStreak
        } else {
          // Streak broken - no notification
          set({
            dailyStreak: {
              current: 1,
              lastVisit: today,
              longestStreak: dailyStreak.longestStreak,
            },
            stats: { ...get().stats, streakDays: 1 }
          })
          return 1
        }
      },

      addNotification: (notification) => {
        const { notifications, preferences } = get()
        if (!preferences.notificationsEnabled) return
        
        set({
          notifications: [notification, ...notifications].slice(0, 20) // Keep last 20
        })
      },

      clearNotification: (index) => {
        const { notifications } = get()
        set({
          notifications: notifications.filter((_, i) => i !== index)
        })
      },

      clearAllNotifications: () => {
        set({ notifications: [] })
      },

      addAchievement: (achievement) => {
        const { achievements } = get()
        set({
          achievements: [achievement, ...achievements].slice(0, 10) // Keep last 10
        })
      },

      updatePreferences: (prefs) => {
        set({
          preferences: { ...get().preferences, ...prefs }
        })
      },

      generateDailyMissions: () => {
        const missions = [
          {
            id: 'daily_simulation',
            title: 'Ejecuta 3 simulaciones',
            description: 'Experimenta con diferentes parámetros PID',
            progress: 0,
            target: 3,
            xpReward: 50,
            type: 'daily',
          },
          {
            id: 'daily_challenge',
            title: 'Completa 1 reto',
            description: 'Resuelve cualquier reto disponible',
            progress: 0,
            target: 1,
            xpReward: 75,
            type: 'daily',
          },
          {
            id: 'daily_perfect',
            title: 'Logra una puntuación perfecta',
            description: 'Obtén 100% en un quiz o reto',
            progress: 0,
            target: 1,
            xpReward: 100,
            type: 'daily',
          },
        ]
        
        set({
          missions: {
            ...get().missions,
            daily: missions,
          }
        })
      },

      updateMissionProgress: (missionId, progress) => {
        const { missions } = get()
        const updatedDaily = missions.daily.map(m => {
          if (m.id === missionId) {
            const newProgress = Math.min(m.target, progress)
            const completed = newProgress >= m.target && m.progress < m.target
            
            if (completed) {
              get().addXP(m.xpReward, `mission:${missionId}`)
              get().addNotification({
                type: 'mission_complete',
                message: `¡Misión completada: ${m.title}!`,
                xpReward: m.xpReward,
                timestamp: Date.now(),
              })
            }
            
            return { ...m, progress: newProgress, completed }
          }
          return m
        })
        
        set({
          missions: {
            ...missions,
            daily: updatedDaily,
          }
        })
      },
    }),
    { name: 'ctrllab-gamification' }
  )
)
