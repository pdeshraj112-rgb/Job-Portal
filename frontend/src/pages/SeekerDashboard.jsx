import { useState, useEffect } from 'react';
import api from '../services/api';
import ProfileForm from '../components/seeker/ProfileForm';
import ResumeUpload from '../components/seeker/ResumeUpload';
import ApplicationStatus from '../components/seeker/ApplicationStatus';

const tabs = [
  { key: 'applications', label: 'My applications' },
  { key: 'saved', label: 'Saved jobs' },
  { key: 'profile', label: 'Profile & resume' },
];

export default function SeekerDashboard() {
  const [tab, setTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [appsRes, savedRes] = await Promise.all([
          api.get('/applications/mine'),
          api.get('/users/saved-jobs'),
        ]);
        setApplications(appsRes.data);
        setSaved(savedRes.data);
      } catch (err) {
        // no-op, empty state handles it
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-800">My dashboard</h1>

      <div className="mb-6 flex gap-2 border-b border-ink/10">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.key ? 'border-brand-500 text-brand-600' : 'border-transparent text-ink/50 hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <div className="card h-40 animate-pulse bg-ink/5" />}

      {!loading && tab === 'applications' && (
        <div className="space-y-3">
          {applications.length === 0 && <div className="card p-10 text-center text-ink/50">You haven't applied to any jobs yet.</div>}
          {applications.map((app) => (
            <ApplicationStatus
              key={app._id}
              application={app}
              onWithdraw={(id) => setApplications((prev) => prev.filter((a) => a._id !== id))}
            />
          ))}
        </div>
      )}

      {!loading && tab === 'saved' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {saved.length === 0 && <div className="card col-span-2 p-10 text-center text-ink/50">No saved jobs yet.</div>}
          {saved.map((job) => (
            <a key={job._id} href={`/jobs/${job._id}`} className="card p-5 hover:shadow-md">
              <p className="font-display font-700">{job.title}</p>
              <p className="text-sm text-ink/60">{job.company?.name} &middot; {job.location}</p>
            </a>
          ))}
        </div>
      )}

      {tab === 'profile' && (
        <div className="space-y-6">
          <ProfileForm />
          <ResumeUpload />
        </div>
      )}
    </div>
  );
}
