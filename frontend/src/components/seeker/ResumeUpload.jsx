import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

export default function ResumeUpload() {
  const { user, updateUserLocal } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const { data } = await api.post('/users/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUserLocal({ resumeUrl: data.resumeUrl });
      setMessage('Resume uploaded successfully.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card space-y-4 p-6">
      <h2 className="font-display text-lg font-700">Resume</h2>
      {user?.resumeUrl ? (
        <a
          href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.resumeUrl}`}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-sm text-brand-600 underline"
        >
          View current resume
        </a>
      ) : (
        <p className="text-sm text-ink/50">No resume uploaded yet.</p>
      )}
      <form onSubmit={handleUpload} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="input"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" disabled={uploading || !file} className="btn-primary shrink-0">
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p className="text-sm text-ink/60">{message}</p>}
    </div>
  );
}
