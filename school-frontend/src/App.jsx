import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import Students from './pages/admin/Students';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherProfile from './pages/teacher/TeacherProfile';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import Teachers from './pages/admin/Teachers';

const Unauthorized = () => <div className="flex h-screen items-center justify-center text-red-500 font-bold bg-red-50 text-2xl">Unauthorized Access</div>;

const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
  if (user.role === 'student') return <Navigate to="/student" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route path="/" element={<RootRedirect />} />

            {/* Admin Base */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }>
              <Route path="students" element={<Students />} />
              <Route path="teachers" element={<Teachers />} />
            </Route>

            {/* Teacher Base */}
            <Route path="/teacher" element={
              <ProtectedRoute roles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }>
              <Route path="profile" element={<TeacherProfile />} />
              <Route path="manage-teachers" element={<Teachers />} />
            </Route>

            {/* Student Base */}
            <Route path="/student" element={
              <ProtectedRoute roles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }>
              <Route path="profile" element={<StudentProfile />} />
              <Route path="manage-students" element={<Students />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App;
