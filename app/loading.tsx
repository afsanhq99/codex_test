export default function Loading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="card animate-pulse space-y-3">
          <div className="h-5 w-2/3 rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
