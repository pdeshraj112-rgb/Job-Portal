import { Link } from 'react-router-dom';

const typeColors = {
  'Full-time': 'bg-brand-50 text-brand-700',
  'Part-time': 'bg-amber-50 text-amber-700',
  'Contract': 'bg-purple-50 text-purple-700',
  'Internship': 'bg-emerald-50 text-emerald-700',
  'Remote': 'bg-cyan-50 text-cyan-700',
};

const formatSalary = (min, max, currency = 'INR') => {
  if (!min && !max) return 'Salary not disclosed';
  const fmt = (n) => `${currency} ${Number(n).toLocaleString('en-IN')}`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  return fmt(min || max);
};

export default function JobCard({ job }) {
  return (
    <Link
      to={`/jobs/${job._id}`}
      className="card group flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-ink/5 text-sm font-700 text-ink/70">
            {job.company?.name?.[0]?.toUpperCase() || 'C'}
          </div>
          <div>
            <h3 className="font-display text-base font-700 text-ink group-hover:text-brand-600">{job.title}</h3>
            <p className="text-sm text-ink/60">{job.company?.name || 'Confidential'}</p>
          </div>
        </div>
        <span className={`badge ${typeColors[job.jobType] || 'bg-ink/5 text-ink/70'}`}>{job.jobType}</span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/60">
        <span>📍 {job.location}</span>
        <span>💼 {job.experienceLevel}</span>
        <span>💰 {formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
      </div>

      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((s) => (
            <span key={s} className="badge bg-ink/5 text-ink/60">{s}</span>
          ))}
        </div>
      )}

      <div className="mt-1 flex items-center justify-between border-t border-ink/10 pt-3 text-xs text-ink/50">
        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
        <span>{job.applicationsCount || 0} applicants</span>
      </div>
    </Link>
  );
}
