export function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6" aria-label="Memuat panel admin">
      <div className="space-y-3">
        <div className="h-3 w-24 rounded bg-[var(--cream)]" />
        <div className="h-12 w-2/3 max-w-lg rounded bg-[var(--cream)]" />
        <div className="h-4 w-full max-w-xl rounded bg-[var(--cream)]" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-36 rounded-2xl border border-[var(--line)] bg-white" />)}
      </div>
      <div className="h-72 rounded-2xl border border-[var(--line)] bg-white" />
    </div>
  )
}
