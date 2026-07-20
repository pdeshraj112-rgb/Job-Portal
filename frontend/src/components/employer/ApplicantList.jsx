import { useState } from 'react';
import api from '../../services/api';

const statusOptions = ['applied', 'reviewed', 'shortlisted', 'interview', 'rejected', 'hired'];
const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

export default function ApplicantList({ applications, onChange }) {
  const [updating, setUpdating] = useState(null);

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      const { data } = await api.put(`/applications/${id}/status`, { status });
      onChange && onChange(applications.map((a) => (a._id === id ? data : a)));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  };

  if (!applications || applications.length === 0) {
    return <div className="card p-10 text-center text-ink/50">No applicants yet for this job.</div>;
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <div key={app._id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display font-700 text-ink">{app.applicant?.name}</p>
            <p className="text-sm text-ink/60">{app.applicant?.email} &middot; {app.applicant?.phone || 'No phone'}</p>
            {app.applicant?.skills?.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {app.applicant.skills.slice(0, 5).map((s) => <span key={s} className="badge bg-ink/5 text-ink/60">{s}</span>)}
              </div>
            )}
            <a href={`${apiBase}${app.resumeUrl}`} target="_blank" rel="noreferrer" className="mt-1.5 inline-block text-xs text-brand-600 underline">
              View resume
            </a>
          </div>
          <select
            className="input w-auto"
            value={app.status}
            disabled={updating === app._id}
            onChange={(e) => handleStatusChange(app._id, e.target.value)}
          >
            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}
