import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function ManageJobs({ jobs, onChange }) {
  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting? This cannot be undone.')) return;
    try {
      await api.delete(`/jobs/${id}`);
      onChange && onChange(jobs.filter((j) => j._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleStatus = async (job) => {
    const next = job.status === 'open' ? 'closed' : 'open';
    try {
      const { data } = await api.put(`/jobs/${job._id}`, { status: next });
      onChange && onChange(jobs.map((j) => (j._id === job._id ? data : j)));
    } catch (err) {
      alert(err.message);
    }
  };

  if (!jobs || jobs.length === 0) {
    return (
      <div className="card p-10 text-center text-ink/50">
        <p className="font-600">No jobs posted yet</p>
        <Link to="/employer/post-job" className="btn-primary mt-4 inline-block">Post your first job</Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div key={job._id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display font-700 text-ink">{job.title}</p>
            <p className="text-sm text-ink/60">{job.location} &middot; {job.jobType}</p>
            <p className="mt-1 text-xs text-ink/40">{job.applicationsCount || 0} applicants &middot; {job.views || 0} views</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`badge ${job.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-ink/5 text-ink/60'}`}>
              {job.status}
            </span>
            <Link to={`/jobs/${job._id}/applicants`} className="btn-secondary px-3 py-1.5 text-xs">Applicants</Link>
            <Link to={`/employer/jobs/${job._id}/edit`} className="btn-secondary px-3 py-1.5 text-xs">Edit</Link>
            <button onClick={() => toggleStatus(job)} className="btn-secondary px-3 py-1.5 text-xs">
              {job.status === 'open' ? 'Close' : 'Reopen'}
            </button>
            <button onClick={() => handleDelete(job._id)} className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:underline">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
