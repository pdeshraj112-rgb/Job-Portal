import { useState, useEffect } from 'react';
import api from '../services/api';

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'users', label: 'Users' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'categories', label: 'Categories' },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    const [s, u, j, c] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/jobs'),
      api.get('/admin/categories'),
    ]);
    setStats(s.data);
    setUsers(u.data);
    setJobs(j.data);
    setCategories(c.data);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const toggleActive = async (id) => {
    const { data } = await api.put(`/admin/users/${id}/toggle-active`);
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive: data.isActive } : u)));
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    await api.delete(`/admin/users/${id}`);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const setJobStatus = async (id, status) => {
    const { data } = await api.put(`/admin/jobs/${id}/status`, { status });
    setJobs((prev) => prev.map((j) => (j._id === id ? data : j)));
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const { data } = await api.post('/admin/categories', { name: newCategory });
    setCategories((prev) => [...prev, data]);
    setNewCategory('');
  };

  const deleteCategory = async (id) => {
    await api.delete(`/admin/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c._id !== id));
  };

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-10"><div className="card h-64 animate-pulse bg-ink/5" /></div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-800">Admin dashboard</h1>

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

      {tab === 'overview' && stats && (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="card p-5">
              <p className="text-xs uppercase tracking-wide text-ink/50">{key.replace(/([A-Z])/g, ' $1')}</p>
              <p className="mt-1 font-display text-2xl font-800">{value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 text-ink/50">
              <tr>
                <th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-ink/5">
                  <td className="p-4">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4 capitalize">{u.role}</td>
                  <td className="p-4">
                    <span className={`badge ${u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 space-x-3">
                    {u.role !== 'admin' && (
                      <>
                        <button onClick={() => toggleActive(u._id)} className="text-xs font-semibold text-brand-600 hover:underline">
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => deleteUser(u._id)} className="text-xs font-semibold text-red-600 hover:underline">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'jobs' && (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job._id} className="card flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display font-700">{job.title}</p>
                <p className="text-sm text-ink/60">{job.company?.name} &middot; posted by {job.postedBy?.name}</p>
              </div>
              <select className="input w-auto" value={job.status} onChange={(e) => setJobStatus(job._id, e.target.value)}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {tab === 'categories' && (
        <div className="card p-6">
          <form onSubmit={addCategory} className="mb-4 flex gap-2">
            <input className="input" placeholder="New category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            <button type="submit" className="btn-primary shrink-0">Add</button>
          </form>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span key={c._id} className="badge flex items-center gap-2 bg-ink/5 text-ink/70">
                {c.name}
                <button onClick={() => deleteCategory(c._id)} className="text-red-500">&times;</button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
