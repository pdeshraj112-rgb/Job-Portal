export default function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;

  const items = [];
  for (let i = 1; i <= pages; i += 1) items.push(i);

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <button
        className="btn-secondary px-3 py-1.5 text-xs"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </button>
      {items.map((i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`h-8 w-8 rounded-lg text-xs font-semibold transition ${
            i === page ? 'bg-brand-500 text-white' : 'text-ink/60 hover:bg-ink/5'
          }`}
        >
          {i}
        </button>
      ))}
      <button
        className="btn-secondary px-3 py-1.5 text-xs"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
