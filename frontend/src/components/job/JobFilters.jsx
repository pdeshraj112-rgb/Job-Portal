import { useState, useEffect } from 'react';
import api from '../../services/api';

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const experienceLevels = ['Entry', 'Mid', 'Senior', 'Lead'];

export default function JobFilters({ filters, onChange }) {
  const [categories, setCategories] = useState([]);
  const [local, setLocal] = useState(filters);

  useEffect(() => {
    api.get('/jobs/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => setLocal(filters), [filters]);

  const update = (key, value) => setLocal((prev) => ({ ...prev, [key]: value }));

  const apply = (e) => {
    e.preventDefault();
    onChange({ ...local, page: 1 });
  };

  const reset = () => {
    const cleared = { keyword: '', location: '', jobType: '', experienceLevel: '', category: '', page: 1 };
    setLocal(cleared);
    onChange(cleared);
  };

  return (
    <form onSubmit={apply} className="card space-y-4 p-5">
      <div>
        <label className="label">Keyword</label>
        <input
          className="input"
          placeholder="Job title, skill..."
          value={local.keyword || ''}
          onChange={(e) => update('keyword', e.target.value)}
        />
      </div>
      <div>
        <label className="label">Location</label>
        <input
          className="input"
          placeholder="City or 'Remote'"
          value={local.location || ''}
          onChange={(e) => update('location', e.target.value)}
        />
      </div>
      <div>
        <label className="label">Job type</label>
        <select className="input" value={local.jobType || ''} onChange={(e) => update('jobType', e.target.value)}>
          <option value="">All types</option>
          {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Experience</label>
        <select className="input" value={local.experienceLevel || ''} onChange={(e) => update('experienceLevel', e.target.value)}>
          <option value="">Any level</option>
          {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Category</label>
        <select className="input" value={local.category || ''} onChange={(e) => update('category', e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn-primary flex-1">Apply</button>
        <button type="button" onClick={reset} className="btn-secondary flex-1">Reset</button>
      </div>
    </form>
  );
}
