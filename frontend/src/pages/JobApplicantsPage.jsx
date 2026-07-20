import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import ApplicantList from '../components/employer/ApplicantList';

export default function JobApplicantsPage() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/applications/job/${id}`),
      api.get(`/jobs/${id}`),
    ])
      .then(([appsRes, jobRes]) => {
        setApplications(appsRes.data);
        setJob(jobRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/employer/dashboard" className="mb-4 inline-block text-sm text-ink/50 hover:text-ink">&larr; Back to dashboard</Link>
      <h1 className="mb-6 font-display text-2xl font-800">
        Applicants {job ? `for ${job.title}` : ''}
      </h1>
      {loading ? (
        <div className="card h-40 animate-pulse bg-ink/5" />
      ) : (
        <ApplicantList applications={applications} onChange={setApplications} />
      )}
    </div>
  );
}
