import JobCard from './JobCard';

export default function JobList({ jobs, loading, error }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card h-40 animate-pulse bg-ink/5" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>;
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="card p-10 text-center text-ink/50">
        <p className="text-lg font-600">No jobs found</p>
        <p className="mt-1 text-sm">Try adjusting your filters or search keywords.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}
