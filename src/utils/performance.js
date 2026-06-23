/**
 * Performance monitoring utilities for development
 * Tracks component render times and provides insights
 */

// Track component render performance
export function measureRender(componentName, callback) {
  if (import.meta.env.DEV) {
    const start = performance.now()
    const result = callback()
    const end = performance.now()
    const duration = end - start
    
    if (duration > 16) { // Slower than 60fps
      console.warn(`[Performance] ${componentName} took ${duration.toFixed(2)}ms to render`)
    }
    
    return result
  }
  return callback()
}

// Track navigation timing
export function trackNavigation(pageName) {
  if (import.meta.env.DEV && window.performance) {
    const navigation = performance.getEntriesByType('navigation')[0]
    if (navigation) {
      console.log(`[Navigation] ${pageName}:`, {
        domContentLoaded: `${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`,
        loadComplete: `${navigation.loadEventEnd - navigation.loadEventStart}ms`,
        totalTime: `${navigation.loadEventEnd - navigation.fetchStart}ms`
      })
    }
  }
}

// Monitor bundle size in production
export function reportBundleSize() {
  if (import.meta.env.PROD && window.performance) {
    const resources = performance.getEntriesByType('resource')
    const jsResources = resources.filter(r => r.name.endsWith('.js'))
    const cssResources = resources.filter(r => r.name.endsWith('.css'))
    
    const totalJS = jsResources.reduce((sum, r) => sum + r.transferSize, 0)
    const totalCSS = cssResources.reduce((sum, r) => sum + r.transferSize, 0)
    
    console.log('[Bundle Size]', {
      js: `${(totalJS / 1024).toFixed(2)} KB`,
      css: `${(totalCSS / 1024).toFixed(2)} KB`,
      total: `${((totalJS + totalCSS) / 1024).toFixed(2)} KB`
    })
  }
}

// Detect slow renders using React DevTools Profiler API
export function withProfiler(Component, id) {
  if (import.meta.env.DEV) {
    return function ProfiledComponent(props) {
      const onRender = (
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      ) => {
        if (actualDuration > 16) {
          console.warn(`[Profiler] ${id} (${phase}):`, {
            actualDuration: `${actualDuration.toFixed(2)}ms`,
            baseDuration: `${baseDuration.toFixed(2)}ms`
          })
        }
      }

      return (
        <React.Profiler id={id} onRender={onRender}>
          <Component {...props} />
        </React.Profiler>
      )
    }
  }
  return Component
}

// Memory usage tracking
export function trackMemoryUsage() {
  if (import.meta.env.DEV && performance.memory) {
    const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory
    const usedMB = (usedJSHeapSize / 1048576).toFixed(2)
    const totalMB = (totalJSHeapSize / 1048576).toFixed(2)
    const limitMB = (jsHeapSizeLimit / 1048576).toFixed(2)
    
    console.log('[Memory]', {
      used: `${usedMB} MB`,
      total: `${totalMB} MB`,
      limit: `${limitMB} MB`,
      usage: `${((usedJSHeapSize / jsHeapSizeLimit) * 100).toFixed(1)}%`
    })
  }
}

// FPS monitor
export function startFPSMonitor() {
  if (import.meta.env.DEV) {
    let lastTime = performance.now()
    let frames = 0
    
    function measureFPS() {
      frames++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime))
        if (fps < 55) {
          console.warn(`[FPS] Low frame rate detected: ${fps} fps`)
        }
        frames = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    requestAnimationFrame(measureFPS)
  }
}
