import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Book, Award, Clock, DollarSign, CheckCircle, User, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="flex h-screen bg-gray-50 text-black">
            <div className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {user?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold leading-tight">Hello, {user?.name || 'Student'}</h1>
                            <p className="text-gray-500 text-sm">Student Portal • Academic Year 2024</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link to="/student" className={`px-5 py-2 rounded-xl transition-all font-bold flex items-center gap-2 ${location.pathname === '/student' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                            <Clock size={18} /> Overview
                        </Link>
                        <Link to="/student/manage-students" className={`px-5 py-2 rounded-xl transition-all font-bold flex items-center gap-2 ${location.pathname === '/student/manage-students' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                            <Users size={18} /> All Students
                        </Link>
                        <Link to="/student/profile" className={`px-5 py-2 rounded-xl transition-all font-bold flex items-center gap-2 ${location.pathname === '/student/profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>
                            <User size={18} /> My Profile
                        </Link>
                        <button onClick={logout} className="px-5 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl transition-all font-bold">Sign out</button>
                    </div>
                </div>

                <div className="transition-all duration-300">
                    <Outlet />
                    {location.pathname === '/student' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-2xl p-6 group hover:-translate-y-1 transition-all border border-gray-50">
                                <div className="flex justify-between items-start mb-4"><div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><CheckCircle /></div></div>
                                <h3 className="text-gray-500 font-medium text-sm">Overall Attendance</h3>
                                <p className="text-3xl font-extrabold mt-1 text-gray-800">92%</p>
                            </div>
                            <div className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-2xl p-6 group hover:-translate-y-1 transition-all border border-gray-50">
                                <div className="flex justify-between items-start mb-4"><div className="p-3 bg-green-100 text-green-600 rounded-xl"><Award /></div></div>
                                <h3 className="text-gray-500 font-medium text-sm">Latest Marks</h3>
                                <p className="text-3xl font-extrabold mt-1 text-gray-800">85%</p>
                            </div>
                            <div className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-2xl p-6 group hover:-translate-y-1 transition-all border border-gray-50">
                                <div className="flex justify-between items-start mb-4"><div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Book /></div></div>
                                <h3 className="text-gray-500 font-medium text-sm">Pending Homework</h3>
                                <p className="text-3xl font-extrabold mt-1 text-gray-800">3</p>
                            </div>
                            <div className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-2xl p-6 group hover:-translate-y-1 transition-all border border-gray-50">
                                <div className="flex justify-between items-start mb-4"><div className="p-3 bg-red-100 text-red-600 rounded-xl"><DollarSign /></div></div>
                                <h3 className="text-gray-500 font-medium text-sm">Fees Due</h3>
                                <p className="text-3xl font-extrabold mt-1 text-gray-800">$450</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
