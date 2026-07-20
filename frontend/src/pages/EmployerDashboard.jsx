import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ManageJobs from '../components/employer/ManageJobs';

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyForm, setCompanyForm] = useState({ name: '', website: '', industry: '', location: '', description: '' });
  const [savingCompany, setSavingCompany] = useState(false);
  const [companyMsg, setCompanyMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [jobsRes, companyRes] = await Promise.all([
        api.get('/jobs/employer/mine'),
        api.get('/companies/mine'),
      ]);
      setJobs(jobsRes.data);
      setCompany(companyRes.data);
      if (companyRes.data) {
        setCompanyForm({
          name: companyRes.data.name || '',
          website: companyRes.data.website || '',
          industry: companyRes.data.industry || '',
          location: companyRes.data.location || '',
          description: companyRes.data.description || '',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCompanySave = async (e) => {
    e.preventDefault();
    setSavingCompany(true);
    setCompanyMsg('');
    try {
      if (company) {
        const { data } = await api.put(`/companies/${company._id}`, companyForm);
        setCompany(data);
      } else {
        const { data } = await api.post('/companies', companyForm);
        setCompany(data);
      }
      setCompanyMsg('Company profile saved.');
    } catch (err) {
      setCompanyMsg(err.message);
    } finally {
      setSavingCompany(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-800">Employer dashboard</h1>
        <Link to="/employer/post-job" className="btn-primary">Post a job</Link>
      </div>

      {loading ? (
        <div className="card h-40 animate-pulse bg-ink/5" />
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 font-display text-lg font-700">Company profile</h2>
            <form onSubmit={handleCompanySave} className="card grid gap-4 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Company name</label>
                <input required className="input" value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Website</label>
                <input className="input" value={companyForm.website} onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })} />
              </div>
              <div>
                <label className="label">Industry</label>
                <input className="input" value={companyForm.industry} onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Location</label>
                <input className="input" value={companyForm.location} onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Description</label>
                <textarea className="input" rows={3} value={companyForm.description} onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={savingCompany} className="btn-primary">
                  {savingCompany ? 'Saving...' : 'Save company'}
                </button>
                {companyMsg && <span className="ml-3 text-sm text-ink/60">{companyMsg}</span>}
              </div>
            </form>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-700">Your job postings</h2>
            <ManageJobs jobs={jobs} onChange={setJobs} />
          </section>
        </div>
      )}
    </div>
  );
}
