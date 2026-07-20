import { Link } from 'react-router-dom';
import api from '../../services/api';

const statusColors = {
  applied: 'bg-ink/5 text-ink/60',
  reviewed: 'bg-blue-50 text-blue-700',
  shortlisted: 'bg-purple-50 text-purple-700',
  interview: 'bg-amber-50 text-amber-700',
  rejected: 'bg-red-50 text-red-600',
  hired: 'bg-emerald-50 text-emerald-700',
};

export default function ApplicationStatus({ application, onWithdraw }) {
  const { job } = application;

  const handleWithdraw = async () => {
    if (!confirm('Withdraw this application?')) return;
    try {
      await api.delete(`/applications/${application._id}`);
      onWithdraw && onWithdraw(application._id);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link to={`/jobs/${job?._id}`} className="font-display font-700 text-ink hover:text-brand-600">
          {job?.title || 'Job removed'}
        </Link>
        <p className="text-sm text-ink/60">{job?.company?.name} &middot; {job?.location}</p>
        <p className="mt-1 text-xs text-ink/40">Applied on {new Date(application.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`badge ${statusColors[application.status] || 'bg-ink/5 text-ink/60'}`}>{application.status}</span>
        {application.status === 'applied' && (
          <button onClick={handleWithdraw} className="text-xs font-semibold text-red-600 hover:underline">
            Withdraw
          </button>
        )}
      </div>
    </div>
  );
}
