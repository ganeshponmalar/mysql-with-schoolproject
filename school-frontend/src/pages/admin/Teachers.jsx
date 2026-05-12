import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Pencil as Edit, Trash2, Search, X, UserPlus, Briefcase, GraduationCap, BookOpen, Library } from 'lucide-react';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [formData, setFormData] = useState({
        teacherId: '',
        teacherName: '',
        subject: '',
        department: '',
        qualification: '',
        user_id: ''
    });

    const fetchTeachers = async () => {
        try {
            const res = await api.get('/teachers');
            setTeachers(res.data.teachers);
        } catch (err) {
            console.error('Failed to fetch teachers', err);
            // Ignore 404 since it might just mean no teachers yet
            if (err.response?.status === 404) {
                setTeachers([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this teacher record?')) return;
        try {
            await api.delete(`/teachers/${id}`);
            fetchTeachers();
        } catch (err) {
            alert('Failed to delete teacher');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTeacher) {
                await api.put(`/teachers/${editingTeacher.id}`, formData);
            } else {
                await api.post('/teachers', formData);
            }
            setShowModal(false);
            fetchTeachers();
            setFormData({ teacherId: '', teacherName: '', subject: '', department: '', qualification: '', user_id: '' });
            setEditingTeacher(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (teacher) => {
        setEditingTeacher(teacher);
        setFormData({
            teacherId: teacher.teacherId,
            teacherName: teacher.teacherName,
            subject: teacher.subject,
            department: teacher.department,
            qualification: teacher.qualification,
            user_id: teacher.user_id || ''
        });
        setShowModal(true);
    };

    if (loading) return <div className="p-8 text-center text-gray-400 font-medium animate-pulse text-lg">Accessing academic faculty...</div>;

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 flex items-center gap-4 tracking-tighter">
                        <Library className="text-primary" size={40} /> Faculty Directory
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Holistic management of teaching staff and faculty profiles.</p>
                </div>
                <button
                    onClick={() => { setEditingTeacher(null); setShowModal(true); setFormData({ teacherId: '', teacherName: '', subject: '', department: '', qualification: '', user_id: '' }); }}
                    className="bg-primary text-white px-10 py-4 rounded-3xl font-black flex items-center gap-3 shadow-2xl shadow-primary/40 hover:scale-[1.05] active:scale-[0.95] transition-all"
                >
                    <UserPlus size={24} /> Appoint Faculty
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
                <div className="p-8 border-b bg-gray-50/50 flex items-center gap-6">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200"><Search className="text-gray-400" size={24} /></div>
                    <input type="text" placeholder="Filter by name, ID or department..." className="bg-transparent border-none outline-none text-lg w-full font-bold text-gray-700" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest border-b">
                            <tr>
                                <th className="px-10 py-6">Faculty Identity</th>
                                <th className="px-8 py-6 text-center">Teacher ID</th>
                                <th className="px-8 py-6 text-center">Department</th>
                                <th className="px-8 py-6 text-center">Subject</th>
                                <th className="px-8 py-6">Qualification</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {teachers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 text-gray-300">
                                            <Briefcase size={64} className="opacity-10" />
                                            <span className="text-xl font-bold">No faculty records found.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : teachers.map(t => (
                                <tr key={t.id} className="hover:bg-primary/[0.02] transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-gradient-to-tr from-purple-100 to-primary/10 text-primary rounded-2xl flex items-center justify-center font-black shadow-inner border border-primary/10 text-xl">
                                                {t.teacherName?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-gray-900 font-black text-xl tracking-tight">{t.teacherName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center"><span className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-xl font-black text-sm border border-gray-200">#{t.teacherId}</span></td>
                                    <td className="px-8 py-6 text-center"><span className="bg-primary/10 text-primary px-4 py-1.5 rounded-xl font-black text-sm border border-primary/5">{t.department}</span></td>
                                    <td className="px-8 py-6 text-center font-bold text-gray-600">{t.subject}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-indigo-500 font-black text-sm bg-indigo-50 px-3 py-1 rounded-xl w-fit">
                                            <GraduationCap size={16} /> {t.qualification}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            <button onClick={() => handleEdit(t)} className="p-3.5 text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all shadow-sm bg-white border border-indigo-100"><Edit size={20} /></button>
                                            <button onClick={() => handleDelete(t.id)} className="p-3.5 text-red-600 hover:bg-red-50 rounded-2xl transition-all shadow-sm bg-white border border-red-100"><Trash2 size={20} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.2)] transform transition-all scale-100 ring-1 ring-black/5">
                        <div className="p-10 border-b flex justify-between items-center bg-gray-50/30">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{editingTeacher ? 'Update Dossier' : 'New Appointment'}</h2>
                                <p className="text-gray-400 mt-1 font-bold text-sm tracking-wide">Syncing data to centralized academic vault.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="bg-white p-3 rounded-full shadow-lg text-gray-400 hover:text-red-500 transition-all hover:rotate-90"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Staff Reference (ID)</label>
                                <input type="number" required value={formData.teacherId} onChange={e => setFormData({ ...formData, teacherId: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" placeholder="ID Number..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Account Reference (User ID)</label>
                                <input type="number" value={formData.user_id} onChange={e => setFormData({ ...formData, user_id: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" placeholder="Optional User ID..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Full Name</label>
                                <input type="text" required value={formData.teacherName} onChange={e => setFormData({ ...formData, teacherName: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" placeholder="e.g. Jane Doe" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Assigned Subject</label>
                                <input type="text" required value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" placeholder="e.g. Mathematics" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Department</label>
                                <input type="text" required value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" placeholder="e.g. Sciences" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Qualification</label>
                                <input type="text" required value={formData.qualification} onChange={e => setFormData({ ...formData, qualification: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" placeholder="e.g. Ph.D. in Physics" />
                            </div>

                            <div className="md:col-span-2 mt-6 flex gap-6">
                                <button type="submit" className="flex-1 bg-primary text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-xl">
                                    {editingTeacher ? 'Commit Changes' : 'Finalize Appointment'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-500 font-bold py-5 rounded-[1.5rem] hover:bg-gray-200 transition-all text-xl">Dismiss</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Teachers;
