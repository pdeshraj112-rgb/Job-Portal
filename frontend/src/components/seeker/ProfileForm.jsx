import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

export default function ProfileForm() {
  const { user, updateUserLocal } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    skills: (user?.skills || []).join(', '),
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const { data } = await api.put('/users/profile', payload);
      updateUserLocal(data);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <h2 className="font-display text-lg font-700">My profile</h2>
      <div>
        <label className="label">Full name</label>
        <input className="input" name="name" value={form.name} onChange={handleChange} />
      </div>
      <div>
        <label className="label">Headline</label>
        <input className="input" name="headline" value={form.headline} onChange={handleChange} placeholder="e.g. Frontend Developer" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Phone</label>
          <input className="input" name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div>
          <label className="label">Location</label>
          <input className="input" name="location" value={form.location} onChange={handleChange} />
        </div>
      </div>
      <div>
        <label className="label">Skills (comma separated)</label>
        <input className="input" name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
      </div>
      <div>
        <label className="label">About</label>
        <textarea className="input" rows={4} name="bio" value={form.bio} onChange={handleChange} />
      </div>
      <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save profile'}</button>
      {message && <p className="text-sm text-ink/60">{message}</p>}
    </form>
  );
}
