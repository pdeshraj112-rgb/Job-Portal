import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import PostJobForm from '../components/employer/PostJobForm';

export default function PostJobPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      api.get(`/jobs/${id}`).then(({ data }) => setJob(data)).finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {loading ? <div className="card h-64 animate-pulse bg-ink/5" /> : <PostJobForm initialJob={job} />}
    </div>
  );
}
