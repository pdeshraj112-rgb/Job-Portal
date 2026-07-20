import { useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import JobDetail from '../components/job/JobDetail';

export default function JobDetailPage() {
  const { id } = useParams();
  const { data: job, loading, error, refetch } = useFetch(`/jobs/${id}`);

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-10"><div className="card h-64 animate-pulse bg-ink/5" /></div>;

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-center">
        <p className="text-red-600">{error}</p>
        <Link to="/jobs" className="btn-secondary mt-4 inline-block">Back to jobs</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/jobs" className="mb-4 inline-block text-sm text-ink/50 hover:text-ink">&larr; Back to jobs</Link>
      {job && <JobDetail job={job} onApplied={refetch} />}
    </div>
  );
}
