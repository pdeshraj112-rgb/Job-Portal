export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-ink/60">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 font-display font-700 text-ink">
            <span className="grid h-6 w-6 place-items-center rounded bg-brand-500 text-xs text-white">H</span>
            HireHub
          </div>
          <p>Built as a learning project &mdash; connecting job seekers and employers.</p>
          <p>&copy; {new Date().getFullYear()} HireHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
