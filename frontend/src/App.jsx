import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SeekerDashboard from './pages/SeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJobPage from './pages/PostJobPage';
import JobApplicantsPage from './pages/JobApplicantsPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/seeker/dashboard"
            element={<ProtectedRoute roles={['seeker']}><SeekerDashboard /></ProtectedRoute>}
          />

          <Route
            path="/employer/dashboard"
            element={<ProtectedRoute roles={['employer', 'admin']}><EmployerDashboard /></ProtectedRoute>}
          />
          <Route
            path="/employer/post-job"
            element={<ProtectedRoute roles={['employer', 'admin']}><PostJobPage /></ProtectedRoute>}
          />
          <Route
            path="/employer/jobs/:id/edit"
            element={<ProtectedRoute roles={['employer', 'admin']}><PostJobPage /></ProtectedRoute>}
          />
          <Route
            path="/jobs/:id/applicants"
            element={<ProtectedRoute roles={['employer', 'admin']}><JobApplicantsPage /></ProtectedRoute>}
          />

          <Route
            path="/admin"
            element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
