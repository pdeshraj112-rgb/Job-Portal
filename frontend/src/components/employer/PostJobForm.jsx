import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const experienceLevels = ['Entry', 'Mid', 'Senior', 'Lead'];

const emptyForm = {
  title: '', description: '', responsibilities: '', requirements: '', location: '',
  jobType: 'Full-time', experienceLevel: 'Entry', salaryMin: '', salaryMax: '',
  skills: '', vacancies: 1, applicationDeadline: '', category: '',
};

export default function PostJobForm({ initialJob, onSaved }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [hasCompany, setHasCompany] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/jobs/categories').then(({ data }) => setCategories(data)).catch(() => {});
    api.get('/companies/mine').then(({ data }) => setHasCompany(!!data)).catch(() => setHasCompany(false));
  }, []);

  useEffect(() => {
    if (initialJob) {
      setForm({
        title: initialJob.title || '',
        description: initialJob.description || '',
        responsibilities: (initialJob.responsibilities || []).join('\n'),
        requirements: (initialJob.requirements || []).join('\n'),
        location: initialJob.location || '',
        jobType: initialJob.jobType || 'Full-time',
        experienceLevel: initialJob.experienceLevel || 'Entry',
        salaryMin: initialJob.salaryMin || '',
        salaryMax: initialJob.salaryMax || '',
        skills: (initialJob.skills || []).join(', '),
        vacancies: initialJob.vacancies || 1,
        applicationDeadline: initialJob.applicationDeadline
          ? new Date(initialJob.applicationDeadline).toISOString().slice(0, 10)
          : '',
        category: initialJob.category?._id || initialJob.category || '',
      });
    }
  }, [initialJob]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        responsibilities: form.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean),
        requirements: form.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        salaryMin: Number(form.salaryMin) || 0,
        salaryMax: Number(form.salaryMax) || 0,
        vacancies: Number(form.vacancies) || 1,
      };

      let result;
      if (initialJob) {
        const { data } = await api.put(`/jobs/${initialJob._id}`, payload);
        result = data;
      } else {
        const { data } = await api.post('/jobs', payload);
        result = data;
      }
      if (onSaved) onSaved(result);
      else navigate('/employer/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasCompany) {
    return (
      <div className="card p-6 text-sm">
        <p className="mb-3 text-ink/70">You need to create a company profile before posting jobs.</p>
        <a href="/employer/dashboard" className="btn-primary inline-block">Go to dashboard</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <h2 className="font-display text-lg font-700">{initialJob ? 'Edit job' : 'Post a new job'}</h2>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <div>
        <label className="label">Job title</label>
        <input className="input" name="title" value={form.title} onChange={handleChange} required />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input" rows={5} name="description" value={form.description} onChange={handleChange} required />
      </div>

      <div>
        <label className="label">Responsibilities (one per line)</label>
        <textarea className="input" rows={3} name="responsibilities" value={form.responsibilities} onChange={handleChange} />
      </div>

      <div>
        <label className="label">Requirements (one per line)</label>
        <textarea className="input" rows={3} name="requirements" value={form.requirements} onChange={handleChange} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Location</label>
          <input className="input" name="location" value={form.location} onChange={handleChange} required />
        </div>
        <div>
          <label className="label">Category</label>
          <select className="input" name="category" value={form.category} onChange={handleChange}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Job type</label>
          <select className="input" name="jobType" value={form.jobType} onChange={handleChange}>
            {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Experience level</label>
          <select className="input" name="experienceLevel" value={form.experienceLevel} onChange={handleChange}>
            {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Min salary</label>
          <input className="input" type="number" name="salaryMin" value={form.salaryMin} onChange={handleChange} />
        </div>
        <div>
          <label className="label">Max salary</label>
          <input className="input" type="number" name="salaryMax" value={form.salaryMax} onChange={handleChange} />
        </div>
        <div>
          <label className="label">Vacancies</label>
          <input className="input" type="number" min="1" name="vacancies" value={form.vacancies} onChange={handleChange} />
        </div>
        <div>
          <label className="label">Application deadline</label>
          <input className="input" type="date" name="applicationDeadline" value={form.applicationDeadline} onChange={handleChange} />
        </div>
      </div>

      <div>
        <label className="label">Skills (comma separated)</label>
        <input className="input" name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js" />
      </div>

      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? 'Saving...' : initialJob ? 'Update job' : 'Publish job'}
      </button>
    </form>
  );
}
