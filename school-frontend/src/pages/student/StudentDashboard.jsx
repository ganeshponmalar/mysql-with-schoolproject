import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Book, Award, Clock, DollarSign, CheckCircle, User, Users, Bell, LogOut, ChevronRight, FileText, Megaphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('overview');
    const [data, setData] = useState({
        attendance: [],
        results: [],
        homework: [],
        announcements: [],
        profile: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [attRes, resRes, hwRes, annRes, profRes] = await Promise.all([
                api.get('/student/attendance'),
                api.get('/student/results'),
                api.get('/student/homework'),
                api.get('/announcements'),
                api.get('/student/profile')
            ]);
            setData({
                attendance: attRes.data.attendance || [],
                results: resRes.data.results || [],
                homework: hwRes.data.homework || [],
                announcements: annRes.data.data || [],
                profile: profRes.data.students?.[0] || null
            });
        } catch (err) {
            console.error("Dashboard data fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Clock },
        { id: 'attendance', label: 'Attendance', icon: CheckCircle },
        { id: 'results', label: 'Exams', icon: Award },
        { id: 'homework', label: 'Homework', icon: Book },
        { id: 'announcements', label: 'Notices', icon: Bell },
    ];

    if (loading) return <div className="h-screen flex items-center justify-center font-black text-gray-300 animate-pulse text-2xl uppercase tracking-widest bg-white">Syncing Student Profile...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row h-screen overflow-hidden">
            {/* Minimalist Premium Sidebar */}
            <aside className="w-full md:w-24 lg:w-72 bg-white border-r border-gray-100 flex flex-col items-center py-8 z-30 transition-all">
                <div className="mb-12 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-tr from-primary to-indigo-600 rounded-[2rem] shadow-2xl flex items-center justify-center text-white font-black text-2xl mb-4 transform hover:rotate-12 transition-transform">
                        {user.name.charAt(0)}
                    </div>
                    <span className="hidden lg:block font-black text-xl tracking-tight text-gray-800">{user.name.split(' ')[0]}</span>
                    <span className="hidden lg:block text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Student Portal</span>
                </div>

                <nav className="flex-1 w-full px-4 space-y-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center justify-center lg:justify-start gap-4 p-4 rounded-3xl transition-all group
                                ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-2xl shadow-primary/40'
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <tab.icon size={24} className={`transition-transform ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="hidden lg:block font-black text-md tracking-tight">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="pt-8 border-t w-full px-4 border-gray-50 flex flex-col gap-4">
                    <Link to="/student/profile" className="hidden lg:flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors px-4">
                        <User size={14} /> My Identity
                    </Link>
                    <Link to="/student/notifications" className="hidden lg:flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors px-4">
                        <Bell size={14} /> Notifications
                    </Link>
                    <button onClick={logout} className="w-full flex items-center justify-center lg:justify-start gap-4 p-4 rounded-3xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all">
                        <LogOut size={24} />
                        <span className="hidden lg:block font-black text-md">Exit App</span>
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-12">
                <div className="max-w-6xl mx-auto space-y-12">

                    {/* Header */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-gray-400 font-black text-xs uppercase tracking-[0.3em] mb-2">Student Dashboard</h2>
                            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                            </h1>
                        </div>
                        <div className="hidden lg:block text-right">
                            <p className="text-gray-800 font-black text-lg">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            <p className="text-gray-400 font-bold text-xs">Section {data.profile?.section || 'A'}</p>
                        </div>
                    </div>

                    {/* Overview Content */}
                    {activeTab === 'overview' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="bg-white p-8 rounded-[3rem] shadow-3xl shadow-gray-200/20 border border-gray-50 border-l-[12px] border-l-primary group hover:-translate-y-2 transition-transform">
                                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Attendance</p>
                                    <h3 className="text-4xl font-black text-gray-900 mt-2">
                                        {data.attendance.length > 0
                                            ? Math.round((data.attendance.filter(a => a.status === 'present').length / data.attendance.length) * 100)
                                            : '0'}%
                                    </h3>
                                    <div className="h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${Math.round((data.attendance.filter(a => a.status === 'present').length / (data.attendance.length || 1)) * 100)}%` }}></div>
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-[3rem] shadow-3xl shadow-gray-200/20 border border-gray-50 border-l-[12px] border-l-green-500 group hover:-translate-y-2 transition-transform">
                                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Exam Result</p>
                                    <h3 className="text-4xl font-black text-gray-900 mt-2">
                                        {data.results[0]?.marks || '---'}<span className="text-lg text-gray-300">/100</span>
                                    </h3>
                                    <p className="text-xs font-bold text-gray-400 mt-2">{data.results[0]?.subject || 'No exams yet'}</p>
                                </div>
                                <div className="bg-white p-8 rounded-[3rem] shadow-3xl shadow-gray-200/20 border border-gray-50 border-l-[12px] border-l-amber-500 group hover:-translate-y-2 transition-transform">
                                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Tasks</p>
                                    <h3 className="text-4xl font-black text-gray-900 mt-2">{data.homework.length}</h3>
                                    <p className="text-xs font-bold text-gray-400 mt-2">Active Assignments</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-2xl font-black text-gray-900 tracking-tighter">Recent Homework</h4>
                                        <Link to="#" onClick={() => setActiveTab('homework')} className="text-primary font-black text-xs uppercase tracking-widest">View All</Link>
                                    </div>
                                    <div className="space-y-4">
                                        {data.homework.slice(0, 3).map(hw => (
                                            <div key={hw.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] group hover:bg-gray-100 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-white rounded-2xl text-amber-500 shadow-sm"><FileText size={20} /></div>
                                                    <div>
                                                        <p className="font-black text-gray-900 text-sm">{hw.title}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{hw.subject} • Due {new Date(hw.due_date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight size={18} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-2xl font-black text-gray-900 tracking-tighter">Latest Notices</h4>
                                        <Link to="#" onClick={() => setActiveTab('announcements')} className="text-primary font-black text-xs uppercase tracking-widest">Read All</Link>
                                    </div>
                                    <div className="space-y-4">
                                        {data.announcements.slice(0, 2).map(ann => (
                                            <div key={ann.id} className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Megaphone size={16} className="text-primary" />
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{ann.priority} Priority</span>
                                                </div>
                                                <p className="font-black text-gray-900 text-md leading-tight">{ann.title}</p>
                                                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{ann.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Attendance Tab */}
                    {activeTab === 'attendance' && (
                        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
                                    <tr>
                                        <th className="px-10 py-6">Date</th>
                                        <th className="px-10 py-6">Day</th>
                                        <th className="px-10 py-6">Status</th>
                                        <th className="px-10 py-6">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {data.attendance.length === 0 ? (
                                        <tr><td colSpan="4" className="text-center p-20 font-black text-gray-300 uppercase tracking-widest">No Records Found</td></tr>
                                    ) : data.attendance.map((att) => (
                                        <tr key={att.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-10 py-6 font-black text-gray-900">{new Date(att.date).toLocaleDateString()}</td>
                                            <td className="px-10 py-6 text-xs font-bold text-gray-500 uppercase">{new Date(att.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                                            <td className="px-10 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest 
                                                     ${att.status === 'present' ? 'bg-green-100 text-green-600' :
                                                        att.status === 'absent' ? 'bg-red-100 text-red-600' :
                                                            att.status === 'late' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {att.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-sm text-gray-400 italic">"{att.remarks || '---'}"</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Results Tab */}
                    {activeTab === 'results' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                            {data.results.length === 0 ? (
                                <div className="md:col-span-2 text-center p-20 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 font-black text-gray-300">NO EXAM RESULTS PUBLISHED YET</div>
                            ) : data.results.map(res => (
                                <div key={res.id} className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/20 border border-gray-50 space-y-6 group hover:shadow-2xl transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-primary font-black text-xs uppercase tracking-widest mb-1">{res.exam_name}</p>
                                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{res.subject}</h3>
                                        </div>
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span className="text-xl font-black leading-none">{res.grade || '--'}</span>
                                            <span className="text-[8px] font-black uppercase tracking-tighter mt-1 opacity-50">Grade</span>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t flex justify-between items-end">
                                        <div>
                                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Marks Obtained</p>
                                            <p className="text-4xl font-black text-gray-900 mt-1">{res.marks}<span className="text-lg text-gray-300">/{res.total_marks}</span></p>
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(res.exam_date).toLocaleDateString()}</p>
                                    </div>
                                    {res.remarks && (
                                        <div className="bg-gray-50 p-4 rounded-xl text-xs font-bold text-gray-500 border-l-4 border-l-primary italic">
                                            "{res.remarks}"
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Homework Tab */}
                    {activeTab === 'homework' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            {data.homework.length === 0 ? (
                                <div className="text-center p-20 bg-white rounded-[3.5rem] border-4 border-dashed border-gray-100 font-black text-gray-300">NO PENDING ASSIGNMENTS</div>
                            ) : data.homework.map(hw => (
                                <div key={hw.id} className="bg-white p-10 rounded-[3.5rem] shadow-xl shadow-gray-200/20 border border-gray-100 flex flex-col lg:flex-row gap-10">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="px-4 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest">{hw.subject}</span>
                                            <span className="flex items-center gap-1.5 text-red-500 font-black text-[10px] uppercase tracking-widest">
                                                <Clock size={12} /> DUE {new Date(hw.due_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{hw.title}</h3>
                                        <p className="text-gray-500 font-medium leading-relaxed">{hw.description}</p>
                                    </div>
                                    <div className="lg:w-72 flex flex-col gap-4">
                                        {hw.attachment_url && (
                                            <a href={hw.attachment_url} target="_blank" rel="noopener noreferrer" className="bg-gray-100 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-gray-200 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="text-gray-400 group-hover:text-primary transition-colors" />
                                                    <span className="font-black text-xs uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">Resources</span>
                                                </div>
                                                <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-all" />
                                            </a>
                                        )}
                                        <button className="bg-primary text-white font-black py-6 rounded-[2rem] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs">Submit Task</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Announcements Tab */}
                    {activeTab === 'announcements' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            {data.announcements.length === 0 ? (
                                <div className="text-center p-20 bg-white rounded-[3.5rem] border-4 border-dashed border-gray-100 font-black text-gray-300">STAY TUNED FOR UPDATES</div>
                            ) : data.announcements.map(ann => (
                                <div key={ann.id} className={`bg-white p-10 rounded-[3.5rem] shadow-xl shadow-gray-200/20 border-l-[12px] 
                                    ${ann.priority === 'high' ? 'border-l-red-500' : ann.priority === 'medium' ? 'border-l-amber-500' : 'border-l-blue-500'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest 
                                            ${ann.priority === 'high' ? 'bg-red-50 text-red-500' : ann.priority === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'}`}>
                                            {ann.priority} PRIORITY
                                        </span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(ann.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">{ann.title}</h3>
                                    <p className="text-gray-600 font-medium leading-relaxed text-lg">{ann.message}</p>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
