import { Link, Outlet } from 'react-router-dom';
import { Users, BookOpen, Clock, Settings, GraduationCap, DollarSign, Bell, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
                <div className="p-6 border-b flex items-center gap-3">
                    <div className="bg-primary text-white p-2 text-xl rounded-lg font-bold"><GraduationCap /></div>
                    <span className="font-bold text-xl text-gray-800">EduAdmin</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-600 rounded-xl font-medium transition-colors"><LayoutDashboard size={20} /> Dashboard</Link>
                    <Link to="/admin/students" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"><Users size={20} /> Students</Link>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"><BookOpen size={20} /> Teachers</a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"><Clock size={20} /> Classes</a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"><DollarSign size={20} /> Fees</a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"><Bell size={20} /> Announcements</a>
                </nav>
                <div className="p-4 border-t">
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">Sign Out</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white border-b sticky top-0 z-10 px-8 py-4 flex justify-between items-center bg-opacity-80 backdrop-blur-md">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Portal</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 hidden sm:block">Logged in as <b>{user?.name || 'Administrator'}</b></span>
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-primary font-bold shadow-sm blur-0">{user?.name?.charAt(0) || 'A'}</div>
                    </div>
                </header>

                <div>
                    <Outlet />
                    {/* Default Dashboard View if no subroute matches */}
                    {window.location.pathname === '/admin' && (
                        <div className="p-8 space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between"><h3 className="text-gray-500 font-medium">Total Students</h3><Users className="text-blue-500" /></div>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">1,245</p>
                                    <span className="text-sm text-green-500 font-medium">+12 this month</span>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between"><h3 className="text-gray-500 font-medium">Total Teachers</h3><BookOpen className="text-purple-500" /></div>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">86</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between"><h3 className="text-gray-500 font-medium">Active Classes</h3><Clock className="text-amber-500" /></div>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">42</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between"><h3 className="text-gray-500 font-medium">Fees Collected</h3><DollarSign className="text-green-500" /></div>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">$24.5k</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
export default AdminDashboard;
