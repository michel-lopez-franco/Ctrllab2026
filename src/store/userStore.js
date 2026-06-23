import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      updateProgress: (moduleId) => {
        const { user } = get()
        if (!user) return
        const completed = new Set(user.completedModules ?? [])
        completed.add(moduleId)
        set({ user: { ...user, completedModules: [...completed] } })
      },
    }),
    { name: 'ctrllab-user' }
  )
)
