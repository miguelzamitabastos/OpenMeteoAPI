'use client'

import { useEffect, useState } from 'react'

type TThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'weather_theme'

function applyTheme(mode: TThemeMode): void {
  const root = document.documentElement
  if (mode === 'dark') {
    root.classList.add('dark')
    return
  }

  root.classList.remove('dark')
}

export function ThemeToggle(): JSX.Element {
  const [mode, setMode] = useState<TThemeMode>('light')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') {
      setMode(stored)
      applyTheme(stored)
      return
    }

    const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialMode: TThemeMode = preferredDark ? 'dark' : 'light'
    setMode(initialMode)
    applyTheme(initialMode)
  }, [])

  const toggle = (): void => {
    const nextMode: TThemeMode = mode === 'dark' ? 'light' : 'dark'
    setMode(nextMode)
    applyTheme(nextMode)
    window.localStorage.setItem(STORAGE_KEY, nextMode)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}
    >
      {mode === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
