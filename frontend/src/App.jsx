import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import ProtectedRoute from './admin/ProtectedRoute';
import Overview from './admin/Overview';
import ProfileEditor from './admin/sections/ProfileEditor';
import AboutEditor from './admin/sections/AboutEditor';
import SkillsEditor from './admin/sections/SkillsEditor';
import ExperienceEditor from './admin/sections/ExperienceEditor';
import EducationEditor from './admin/sections/EducationEditor';
import CertificationsEditor from './admin/sections/CertificationsEditor';
import ProjectsEditor from './admin/sections/ProjectsEditor';
import MessagesInbox from './admin/sections/MessagesInbox';
import SettingsEditor from './admin/sections/SettingsEditor';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="profile" element={<ProfileEditor />} />
        <Route path="about" element={<AboutEditor />} />
        <Route path="skills" element={<SkillsEditor />} />
        <Route path="experience" element={<ExperienceEditor />} />
        <Route path="education" element={<EducationEditor />} />
        <Route path="certifications" element={<CertificationsEditor />} />
        <Route path="projects" element={<ProjectsEditor />} />
        <Route path="messages" element={<MessagesInbox />} />
        <Route path="settings" element={<SettingsEditor />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
