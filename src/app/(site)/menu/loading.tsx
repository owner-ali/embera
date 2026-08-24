export default function MenuLoading() {
  return (
    <div className="bg-ink pb-24 pt-32">
      <div className="container">
        <div className="mb-12 h-10 w-64 animate-pulse rounded bg-white/5" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl bg-char">
              <div className="aspect-[4/3] bg-white/5" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-1/3 rounded bg-white/5" />
                <div className="h-5 w-2/3 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
