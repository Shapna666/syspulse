function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200">
      <div className="h-4 w-24 rounded bg-surface-hover animate-pulse mb-5" />
      <div className="h-9 w-32 rounded bg-surface-hover animate-pulse mb-4" />
      <div className="h-3 w-20 rounded bg-surface-hover animate-pulse" />
    </div>
  );
}

export default SkeletonCard;