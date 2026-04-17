'use client'

interface TGlobalErrorProps {
  error: Error
  reset: () => void
}

export default function GlobalError({ error, reset }: TGlobalErrorProps): JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
      <section className="w-full max-w-lg rounded-3xl border border-red-300 bg-white p-6 shadow-lg dark:border-red-700 dark:bg-slate-900">
        <p className="text-xs font-bold uppercase tracking-widest text-red-700 dark:text-red-300">
          Application error
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Something went wrong
        </h1>
        <p
          className="mt-2 text-sm text-slate-700 dark:text-slate-300"
          role="alert"
          aria-live="assertive"
        >
          {error.message}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          aria-label="Retry after error"
        >
          Try again
        </button>
      </section>
    </main>
  )
}
