import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const formatSalary = (min, max, currency = 'INR') => {
  if (!min && !max) return 'Not disclosed';
  const fmt = (n) => `${currency} ${Number(n).toLocaleString('en-IN')}`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  return fmt(min || max);
};

export default function JobDetail({ job, onApplied }) {
  const { user } = useAuth();
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showForm, setShowForm] = useState(false);

  const isSeeker = user?.role === 'seeker';
  const isOwner = user && String(job.postedBy?._id || job.postedBy) === String(user._id);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeFile && !user?.resumeUrl) {
      setMessage({ type: 'error', text: 'Please attach a resume or upload one to your profile first.' });
      return;
    }
    setApplying(true);
    setMessage({ type: '', text: '' });
    try {
      const formData = new FormData();
      if (resumeFile) formData.append('resume', resumeFile);
      formData.append('coverLetter', coverLetter);
      await api.post(`/applications/${job._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage({ type: 'success', text: 'Application submitted successfully!' });
      setShowForm(false);
      onApplied && onApplied();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="card space-y-6 p-6 lg:col-span-2">
        <div>
          <h1 className="font-display text-2xl font-800 text-ink">{job.title}</h1>
          <p className="mt-1 text-ink/60">
            {job.company?.name} &middot; {job.location}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="badge bg-brand-50 text-brand-700">{job.jobType}</span>
            <span className="badge bg-ink/5 text-ink/70">{job.experienceLevel}</span>
            <span className="badge bg-emerald-50 text-emerald-700">{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
          </div>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-700">Description</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink/70">{job.description}</p>
        </div>

        {job.responsibilities?.length > 0 && (
          <div>
            <h2 className="mb-2 font-display text-lg font-700">Responsibilities</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-ink/70">
              {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {job.requirements?.length > 0 && (
          <div>
            <h2 className="mb-2 font-display text-lg font-700">Requirements</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-ink/70">
              {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {job.skills?.length > 0 && (
          <div>
            <h2 className="mb-2 font-display text-lg font-700">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((s) => <span key={s} className="badge bg-ink/5 text-ink/60">{s}</span>)}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="card p-6">
          {!user && (
            <Link to="/login" className="btn-primary w-full">Log in to apply</Link>
          )}

          {user && isOwner && (
            <p className="text-sm text-ink/50">This is your own job posting.</p>
          )}

          {user && isSeeker && !isOwner && job.status === 'open' && !showForm && (
            <button onClick={() => setShowForm(true)} className="btn-primary w-full">Apply now</button>
          )}

          {user && isSeeker && job.status !== 'open' && (
            <p className="text-sm text-red-600">This job is no longer accepting applications.</p>
          )}

          {user && user.role === 'employer' && !isOwner && (
            <p className="text-sm text-ink/50">Only job seekers can apply to jobs.</p>
          )}

          {showForm && (
            <form onSubmit={handleApply} className="mt-4 space-y-3 border-t border-ink/10 pt-4">
              <div>
                <label className="label">Resume (PDF/DOC)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="input"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
                {!resumeFile && user?.resumeUrl && (
                  <p className="mt-1 text-xs text-ink/50">Leave empty to use resume already on your profile.</p>
                )}
              </div>
              <div>
                <label className="label">Cover letter (optional)</label>
                <textarea
                  className="input"
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the employer why you're a great fit..."
                />
              </div>
              <button type="submit" disabled={applying} className="btn-primary w-full">
                {applying ? 'Submitting...' : 'Submit application'}
              </button>
            </form>
          )}

          {message.text && (
            <p className={`mt-3 rounded-lg p-2.5 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
              {message.text}
            </p>
          )}
        </div>

        <div className="card p-6 text-sm text-ink/60">
          <p className="mb-2 font-700 text-ink">Job overview</p>
          <div className="space-y-1.5">
            <p>👁️ {job.views || 0} views</p>
            <p>🧑‍💼 {job.applicationsCount || 0} applicants</p>
            <p>🪑 {job.vacancies || 1} vacancy(ies)</p>
            {job.applicationDeadline && (
              <p>⏰ Apply before {new Date(job.applicationDeadline).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
