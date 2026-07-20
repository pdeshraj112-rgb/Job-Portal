import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dashboardPath =
    user?.role === 'admin' ? '/admin' : user?.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard';

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-800 tracking-tight text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-white">H</span>
          HireHub
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-ink/70 md:flex">
          <Link to="/jobs" className="hover:text-ink">Find Jobs</Link>
          {user?.role === 'employer' && <Link to="/employer/post-job" className="hover:text-ink">Post a Job</Link>}
          {user && <Link to={dashboardPath} className="hover:text-ink">Dashboard</Link>}
          {user?.role === 'admin' && <Link to="/admin" className="hover:text-ink">Admin</Link>}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-ink/60">Hi, {user.name?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-secondary">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Log in</Link>
              <Link to="/register" className="btn-primary">Sign up</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-ink"></span>
            <span className="block h-0.5 w-6 bg-ink"></span>
            <span className="block h-0.5 w-6 bg-ink"></span>
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink/10 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium">
            <Link to="/jobs" onClick={() => setOpen(false)}>Find Jobs</Link>
            {user?.role === 'employer' && <Link to="/employer/post-job" onClick={() => setOpen(false)}>Post a Job</Link>}
            {user && <Link to={dashboardPath} onClick={() => setOpen(false)}>Dashboard</Link>}
            {user?.role === 'admin' && <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>}
            {user ? (
              <button onClick={handleLogout} className="btn-secondary w-full">Log out</button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary flex-1 text-center" onClick={() => setOpen(false)}>Log in</Link>
                <Link to="/register" className="btn-primary flex-1 text-center" onClick={() => setOpen(false)}>Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
