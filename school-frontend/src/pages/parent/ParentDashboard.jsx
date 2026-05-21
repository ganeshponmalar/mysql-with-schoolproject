import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Users, User, BookOpen, Clock, Award, Bell, MessageCircle, LogOut, FileText, Send, CheckCircle, ChevronDown, Megaphone } from 'lucide-react';

const ParentDashboard = () => {
    const { user, logout } = useAuth();
    const [children, setChildren] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    const [childData, setChildData] = useState({
        profile: null,
        attendance: [],
        results: [],
        assignments: []
    });

    const [notifications, setNotifications] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchChildren();
        fetchNotifications();
        fetchTeachers();
    }, []);

    useEffect(() => {
        if (selectedChildId) {
            fetchChildDetails(selectedChildId);
        }
    }, [selectedChildId]);

    useEffect(() => {
        if (selectedTeacherId) {
            fetchMessages(selectedTeacherId);
        }
    }, [selectedTeacherId]);

    const fetchChildren = async () => {
        try {
            const res = await api.get('/parents/children');
            console.log('[fetchChildren] response', res.data);
            setChildren(res.data.children);
            if (res.data.children?.length > 0) {
                setSelectedChildId(res.data.children[0].id);
            }
        } catch (err) {
            console.error("Error fetching children", err.response?.data || err.message);
        }
    };

    const fetchChildDetails = async (id) => {
        try {
            const [profRes, attRes, resRes, asgnRes] = await Promise.all([
                api.get(`/parents/children/${id}/profile`),
                api.get(`/parents/children/${id}/attendance`),
                api.get(`/parents/children/${id}/results`),
                api.get(`/parents/children/${id}/assignments`)
            ]);
            console.log('[fetchChildDetails] id=', id);
            console.log('[fetchChildDetails] resRes.data=', resRes.data);
            setChildData({
                profile: profRes.data.profile,
                attendance: attRes.data.attendance || [],
                results: resRes.data.results || [],
                assignments: asgnRes.data.assignments || []
            });
        } catch (err) {
            console.error("Error fetching child details", err.response?.data || err.message);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/announcements');
            setNotifications(res.data.data || []);
        } catch (err) {
            console.error("Error fetching notifications", err);
        }
    };

    const fetchTeachers = async () => {
        try {
            const res = await api.get('/parents/teachers');
            setTeachers(res.data.teachers || []);
        } catch (err) {
            console.error("Error fetching teachers", err);
        }
    };

    const fetchMessages = async (tId) => {
        try {
            const res = await api.get(`/parents/messages/${tId}`);
            setMessages(res.data.messages || []);
        } catch (err) {
            console.error("Error fetching messages", err);
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTeacherId) return;
        try {
            await api.post(`/parents/messages/${selectedTeacherId}`, { content: newMessage });
            setNewMessage('');
            fetchMessages(selectedTeacherId);
        } catch (err) {
            console.error("Error sending message", err);
        }
    };

    const selectedChild = children.find(c => c.id === selectedChildId);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <User size={18} /> },
        { id: 'attendance', label: 'Attendance', icon: <Clock size={18} /> },
        { id: 'results', label: 'Exam Results', icon: <Award size={18} /> },
        { id: 'assignments', label: 'Homework', icon: <FileText size={18} /> },
        { id: 'notifications', label: 'Announcements', icon: <Bell size={18} /> },
        { id: 'messages', label: 'Teacher Chat', icon: <MessageCircle size={18} /> }
    ];

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Top Navigation Bar */}
            <div className="bg-teal-600 text-white shadow-md p-4 px-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Users size={28} />
                    <h1 className="text-2xl font-bold">Parent Portal</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-semibold">{user?.name} (Parent)</span>
                    <button onClick={logout} className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 px-4 py-2 rounded-lg transition-colors shadow">
                        <LogOut size={16} /> Sign out
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <div className="w-64 bg-white shadow-xl flex flex-col pt-6 z-10 hidden md:flex">
                    <div className="px-6 mb-6">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Viewing Child</label>
                        <div className="relative">
                            <select
                                className="w-full bg-teal-50 border border-teal-100 text-teal-800 rounded-xl p-3 font-semibold appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-teal-500"
                                value={selectedChildId || ''}
                                onChange={(e) => {
                                    const nextId = Number(e.target.value);
                                    console.log('[ParentDashboard] selectedChildId changed to', nextId);
                                    setSelectedChildId(nextId);
                                }}
                            >
                                {children.length === 0 && <option value="">No Children Linked</option>}
                                {children.map(c => (
                                    <option key={c.id} value={c.id}>{c.user_name} (Roll: {c.rollNumber})</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-teal-600 pointer-events-none" size={18} />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto w-full px-4 space-y-1">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4 px-2 block">Menu</div>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === tab.id ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 font-bold' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
                    {!selectedChildId && activeTab !== 'notifications' && activeTab !== 'messages' ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Users size={64} className="mb-4 text-gray-300" />
                            <h2 className="text-2xl font-bold text-gray-500">Welcome to Parent Portal</h2>
                            <p>No student accounts are currently linked to your profile.</p>
                        </div>
                    ) : (
                        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Overview Tab */}
                            {activeTab === 'overview' && childData.profile && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-4xl shadow-xl font-bold">
                                            {childData.profile.name?.charAt(0) || 'S'}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">{childData.profile.name}</h2>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">Section</p>
                                                    <p className="font-semibold text-lg">{childData.profile.section}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">Roll Number</p>
                                                    <p className="font-semibold text-lg">{childData.profile.rollNumber}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">Date of Birth</p>
                                                    <p className="font-semibold text-lg">{new Date(childData.profile.dateOfBirth).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">Admission</p>
                                                    <p className="font-semibold text-lg">{new Date(childData.profile.admissionDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="bg-white/20 p-3 rounded-xl"><Clock size={24} /></div>
                                            </div>
                                            <h3 className="text-indigo-100 font-medium">Recent Attendance</h3>
                                            <p className="text-3xl font-extrabold mt-1">
                                                {childData.attendance.slice(0, 5).filter(a => a.status === 'Present').length} / {Math.min(5, childData.attendance.length)}
                                            </p>
                                            <p className="text-sm text-indigo-100 mt-2">Present in last 5 days</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-6 text-white shadow-lg">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="bg-white/20 p-3 rounded-xl"><Award size={24} /></div>
                                            </div>
                                            <h3 className="text-rose-100 font-medium">Latest Exam</h3>
                                            <p className="text-3xl font-extrabold mt-1">
                                                {childData.results.length > 0 ? `${childData.results[0].marks}/${childData.results[0].total_marks}` : 'N/A'}
                                            </p>
                                            <p className="text-sm text-rose-100 mt-2">{childData.results[0]?.subject_name || childData.results[0]?.subject || 'No exams yet'}</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-lg">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="bg-white/20 p-3 rounded-xl"><CheckCircle size={24} /></div>
                                            </div>
                                            <h3 className="text-amber-100 font-medium">Assignments</h3>
                                            <p className="text-3xl font-extrabold mt-1">{childData.assignments.length}</p>
                                            <p className="text-sm text-amber-100 mt-2">Total submissions</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Attendance Tab */}
                            {activeTab === 'attendance' && (
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Clock className="text-teal-500" /> Attendance History</h2>
                                    {childData.attendance.length === 0 ? <p className="text-gray-500 text-center py-8">No attendance records found.</p> : (
                                        <div className="overflow-hidden rounded-2xl border border-gray-200">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-100">
                                                    {childData.attendance.map(r => (
                                                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 font-medium text-gray-800">{new Date(r.date).toLocaleDateString()}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-4 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm ${r.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                    {r.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Results Tab */}
                            {activeTab === 'results' && (
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Award className="text-rose-500" /> Exam Results</h2>
                                    {childData.results.length === 0 ? <p className="text-gray-500 text-center py-8">No exam results found.</p> : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {childData.results.map(r => (
                                                <div key={r.id} className="bg-white border-2 border-gray-100 hover:border-rose-200 rounded-2xl p-6 transition-all shadow-sm group">
                                                    <p className="text-rose-500 font-bold mb-1">{r.exam_name}</p>
                                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{r.subject_name || r.subject}</h3>
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <p className="text-sm text-gray-400">Score Achieved</p>
                                                            <p className={`text-4xl font-extrabold ${r.marks > 75 ? 'text-green-500' : r.marks > 40 ? 'text-amber-500' : 'text-red-500'}`}>{r.marks}<span className="text-lg text-gray-400 font-medium">/100</span></p>
                                                        </div>
                                                        <div className="text-right text-sm text-gray-400">
                                                            {new Date(r.exam_date).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Assignments Tab */}
                            {activeTab === 'assignments' && (
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><BookOpen className="text-blue-500" /> Homework & Assignments</h2>
                                    {childData.assignments.length === 0 ? <p className="text-gray-500 text-center py-8">No homework assigned yet.</p> : (
                                        <div className="space-y-4">
                                            {childData.assignments.map(a => (
                                                <div key={a.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <div className="flex justify-between">
                                                        <h3 className="text-lg font-bold text-gray-800">{a.title}</h3>
                                                        <span className="text-sm text-gray-500 font-bold bg-white px-3 py-1 rounded-lg border shadow-sm">Due: {new Date(a.due_date).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-gray-600 mt-2 mb-4">{a.description}</p>
                                                    {a.submission_text && (
                                                        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100">
                                                            <p className="font-bold text-sm mb-1 flex items-center gap-1"><CheckCircle size={14} /> Submission</p>
                                                            <p className="text-sm">{a.submission_text}</p>
                                                            {a.marks_given !== null && <p className="text-sm font-bold text-green-600 mt-2">Graded: {a.marks_given}%</p>}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Bell className="text-amber-500" /> School Announcements</h2>
                                    <div className="space-y-6">
                                        {notifications.length === 0 ? <p className="text-gray-500 text-center py-8">No new announcements.</p> : notifications.map(n => (
                                            <div key={n.id} className="p-6 border-l-4 border-amber-500 bg-amber-50/30 rounded-r-2xl">
                                                <h3 className="font-bold text-amber-900 text-lg mb-2">{n.title}</h3>
                                                <p className="text-gray-700 whitespace-pre-wrap">{n.content}</p>
                                                <p className="text-xs text-amber-600/70 mt-4 font-semibold">{new Date(n.created_at).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Messages Tab */}
                            {activeTab === 'messages' && (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex h-[600px] overflow-hidden">
                                    {/* Teachers List */}
                                    <div className="w-1/3 bg-gray-50 border-r border-gray-100 flex flex-col">
                                        <div className="p-4 bg-gray-100/50 font-bold text-gray-600 border-b">Teachers</div>
                                        <div className="overflow-y-auto flex-1">
                                            {teachers.map(t => (
                                                <div
                                                    key={t.user_id}
                                                    onClick={() => setSelectedTeacherId(t.user_id)}
                                                    className={`p-4 cursor-pointer border-b border-gray-100 transition-colors flex items-center gap-3 ${selectedTeacherId === t.user_id ? 'bg-teal-50 border-l-4 border-l-teal-500' : 'hover:bg-white'}`}
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-teal-200 text-teal-700 flex items-center justify-center font-bold">
                                                        {t.teacherName?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold ${selectedTeacherId === t.user_id ? 'text-teal-700' : 'text-gray-800'}`}>{t.teacherName}</p>
                                                        <p className="text-xs text-gray-500">{t.subject}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {teachers.length === 0 && <p className="p-4 text-gray-500">No teachers found.</p>}
                                        </div>
                                    </div>

                                    {/* Chat Area */}
                                    <div className="w-2/3 flex flex-col">
                                        {selectedTeacherId ? (
                                            <>
                                                <div className="p-4 bg-white border-b shadow-sm z-10 flex items-center gap-3">
                                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                                        <MessageCircle className="text-teal-500" /> Chatting with Teacher
                                                    </h3>
                                                </div>
                                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                                                    {messages.length === 0 && <p className="text-center text-gray-400 py-10">No messages yet. Send one to start the conversation.</p>}
                                                    {messages.map((m, i) => {
                                                        const isMe = m.sender_id === user.id;
                                                        return (
                                                            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                                <div className={`max-w-[75%] p-3 rounded-2xl ${isMe ? 'bg-teal-600 text-white rounded-tr-sm' : 'bg-white border rounded-tl-sm shadow-sm'}`}>
                                                                    <p>{m.content}</p>
                                                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-teal-200' : 'text-gray-400'}`}>
                                                                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <div className="p-4 bg-white border-t">
                                                    <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                                                        <input
                                                            type="text"
                                                            className="flex-1 border bg-gray-50 rounded-full pl-6 pr-14 py-3 outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                                                            placeholder="Type your message..."
                                                            value={newMessage}
                                                            onChange={(e) => setNewMessage(e.target.value)}
                                                        />
                                                        <button type="submit" disabled={!newMessage.trim()} className="absolute right-2 top-2 bottom-2 bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full transition-all disabled:opacity-50 disabled:hover:bg-teal-500 shadow-md flex items-center justify-center aspect-square">
                                                            <Send size={16} className="-ml-0.5 mt-0.5" />
                                                        </button>
                                                    </form>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
                                                <MessageCircle size={48} className="mb-4 text-gray-300" />
                                                <p className="font-semibold text-lg">Select a teacher to start messaging</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
