export default function AdminLoading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-background px-4 py-8 text-foreground">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Заявки</h1>
        <span className="text-sm text-muted-foreground">Загрузка…</span>
      </div>
      <div
        className="rounded-md border bg-muted/30 p-8 text-center text-sm text-muted-foreground"
        aria-busy="true"
        aria-live="polite"
      >
        Загрузка заявок…
      </div>
    </main>
  );
}
