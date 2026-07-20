import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import JobCard from '../components/job/JobCard';

export default function HomePage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState({ jobs: 0, companies: 0 });

  useEffect(() => {
    api.get('/jobs', { params: { limit: 6, sort: '-createdAt' } })
      .then(({ data }) => {
        setFeatured(data.jobs);
        setStats((s) => ({ ...s, jobs: data.total }));
      })
      .catch(() => {});
    api.get('/companies').then(({ data }) => setStats((s) => ({ ...s, companies: data.length }))).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(251,133,0,0.25),transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center text-white">
          <p className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-wide text-white/80">
            {stats.jobs}+ open roles &middot; {stats.companies}+ companies hiring
          </p>
          <h1 className="mx-auto max-w-2xl font-display text-4xl font-800 leading-tight sm:text-5xl">
            Find work that actually fits your life.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Search thousands of roles from startups to enterprises, apply in one click, and track every application in one place.
          </p>

          <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-xl flex-col gap-2 rounded-xl bg-white p-2 shadow-xl sm:flex-row">
            <input
              className="flex-1 rounded-lg border-none px-3 py-2.5 text-sm text-ink outline-none"
              placeholder="Job title or keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <input
              className="flex-1 rounded-lg border-none px-3 py-2.5 text-sm text-ink outline-none sm:border-l sm:border-ink/10"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button type="submit" className="btn-primary shrink-0">Search jobs</button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl font-800">Latest opportunities</h2>
          <Link to="/jobs" className="text-sm font-semibold text-brand-600 hover:underline">View all jobs &rarr;</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((job) => <JobCard key={job._id} job={job} />)}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2">
          <div className="card p-8">
            <h3 className="font-display text-xl font-700">I'm looking for a job</h3>
            <p className="mt-2 text-sm text-ink/60">Create a profile, upload your resume, and apply to roles in seconds.</p>
            <Link to="/register" className="btn-primary mt-5 inline-block">Get started</Link>
          </div>
          <div className="card p-8">
            <h3 className="font-display text-xl font-700">I'm hiring</h3>
            <p className="mt-2 text-sm text-ink/60">Post jobs, manage applicants, and find the right hire faster.</p>
            <Link to="/register" className="btn-secondary mt-5 inline-block">Post a job</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
