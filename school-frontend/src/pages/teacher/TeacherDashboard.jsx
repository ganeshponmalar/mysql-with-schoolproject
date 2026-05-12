import React from 'react';
import { Calendar, CheckCircle, FileText, Activity, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, Outlet } from 'react-router-dom';

const TeacherDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="flex h-screen bg-gray-50">
            <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
                <div className="p-6 border-b flex items-center gap-3">
                    <span className="font-bold text-xl text-gray-800 flex items-center gap-2"><Calendar className="text-secondary" /> EduTeacher</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/teacher" className="flex items-center gap-3 px-4 py-3 bg-secondary bg-opacity-10 text-secondary rounded-xl font-medium"><Activity size={20} /> Overview</Link>
                    <Link to="/teacher/profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl"><User size={20} /> Profile</Link>
                    <Link to="/teacher/manage-teachers" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl"><FileText size={20} /> Manage Teachers</Link>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl"><CheckCircle size={20} /> Attendance</a>
                </nav>
                <div className="p-4 border-t">
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">Sign Out</button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto">
                <Outlet />
                {window.location.pathname === '/teacher' && (
                    <div className="p-8 space-y-6">
                        <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'Teacher'}!</h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-secondary relative overflow-hidden group hover:-translate-y-1 transition-transform">
                                <h3 className="text-gray-500 font-medium">Today's Classes</h3>
                                <p className="text-4xl font-extrabold text-gray-800 mt-2">4</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                                <h3 className="text-gray-500 font-medium">Pending Assignments</h3>
                                <p className="text-4xl font-extrabold text-gray-800 mt-2">12</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-green-500 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                                <h3 className="text-gray-500 font-medium">Overall Attendance %</h3>
                                <p className="text-4xl font-extrabold text-gray-800 mt-2">94%</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
export default TeacherDashboard;
