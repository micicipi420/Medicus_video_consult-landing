export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-3xl font-heading">MedicusUnion KZ</h1>
      <p className="text-mu-text-500">Next.js 15 scaffold — Phase 59</p>
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-mu-green-500 rounded-lg" />
        <div className="w-16 h-16 bg-mu-blue rounded-lg" />
        <div className="w-16 h-16 bg-mu-accent-orange rounded-lg" />
      </div>
      <p className="text-sm text-mu-text-300">If you see green, blue, and orange squares above — Tailwind tokens are working.</p>
    </main>
  );
}
