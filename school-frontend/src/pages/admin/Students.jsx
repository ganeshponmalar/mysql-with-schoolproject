import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Plus, Edit, Trash2, Search, X, Layers, UserPlus, Cake } from 'lucide-react';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [linkingStudent, setLinkingStudent] = useState(null);
    const [parentEmail, setParentEmail] = useState('');
    const [formData, setFormData] = useState({
        userId: '',
        section: '',
        rollNumber: '',
        dateOfBirth: '',
        admissionDate: '',
        guardianInfo: ''
    });

    const fetchStudents = async () => {
        try {
            const res = await api.get('/students');
            setStudents(res.data.students);
        } catch (err) {
            console.error('Failed to fetch students', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student record?')) return;
        try {
            await api.delete(`/students/${id}`);
            fetchStudents();
        } catch (err) {
            alert('Failed to delete student');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStudent) {
                await api.put(`/students/${editingStudent.id}`, formData);
            } else {
                await api.post('/students', formData);
            }
            setShowModal(false);
            fetchStudents();
            setFormData({ userId: '', section: '', rollNumber: '', dateOfBirth: '', admissionDate: '', guardianInfo: '' });
            setEditingStudent(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleLinkParent = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/students/${linkingStudent.id}/link-parent`, { parentEmail });
            alert(res.data.message);
            setLinkingStudent(null);
            setParentEmail('');
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({
            userId: student.userId,
            section: student.section,
            rollNumber: student.rollNumber,
            dateOfBirth: student.dateOfBirth?.split('T')[0] || '',
            admissionDate: student.admissionDate?.split('T')[0] || '',
            guardianInfo: student.guardianInfo || ''
        });
        setShowModal(true);
    };

    if (loading) return <div className="p-8 text-center text-gray-400 font-medium animate-pulse text-lg">Accessing academic registry...</div>;

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 flex items-center gap-4 tracking-tighter">
                        <Users className="text-primary" size={40} /> Student Registry
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Holistic management of student identities and personal records.</p>
                </div>
                <button
                    onClick={() => { setEditingStudent(null); setShowModal(true); setFormData({ userId: '', section: '', rollNumber: '', dateOfBirth: '', admissionDate: '', guardianInfo: '' }); }}
                    className="bg-primary text-white px-10 py-4 rounded-3xl font-black flex items-center gap-3 shadow-2xl shadow-primary/40 hover:scale-[1.05] active:scale-[0.95] transition-all"
                >
                    <UserPlus size={24} /> Register New Student
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
                <div className="p-8 border-b bg-gray-50/50 flex items-center gap-6">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200"><Search className="text-gray-400" size={24} /></div>
                    <input type="text" placeholder="Filter by name, roll ID or email..." className="bg-transparent border-none outline-none text-lg w-full font-bold text-gray-700" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest border-b">
                            <tr>
                                <th className="px-10 py-6">Identity</th>
                                <th className="px-8 py-6 text-center">Roll ID</th>
                                <th className="px-8 py-6 text-center">Section</th>
                                <th className="px-8 py-6">Birth Date</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 text-gray-300">
                                            <Users size={64} className="opacity-10" />
                                            <span className="text-xl font-bold">No student records found.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.map(s => (
                                <tr key={s.id} className="hover:bg-primary/[0.02] transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-gradient-to-tr from-primary/20 to-indigo-50 text-primary rounded-2xl flex items-center justify-center font-black shadow-inner border border-primary/10 text-xl">
                                                {s.studentName?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-gray-900 font-black text-xl tracking-tight">{s.studentName}</div>
                                                <div className="text-gray-400 text-sm font-bold">{s.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center"><span className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-xl font-black text-sm border border-gray-200">#{s.rollNumber}</span></td>
                                    <td className="px-8 py-6 text-center"><span className="bg-primary/10 text-primary px-4 py-1.5 rounded-xl font-black text-sm border border-primary/5">{s.section}</span></td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-gray-500 font-black text-sm">
                                            {s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            <button onClick={() => setLinkingStudent(s)} className="p-3.5 text-teal-600 hover:bg-teal-50 rounded-2xl transition-all shadow-sm bg-white border border-teal-100" title="Link Parent"><Users size={20} /></button>
                                            <button onClick={() => handleEdit(s)} className="p-3.5 text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all shadow-sm bg-white border border-indigo-100" title="Edit Student"><Edit size={20} /></button>
                                            <button onClick={() => handleDelete(s.id)} className="p-3.5 text-red-600 hover:bg-red-50 rounded-2xl transition-all shadow-sm bg-white border border-red-100" title="Delete Student"><Trash2 size={20} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
                <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.2)] transform transition-all scale-100 ring-1 ring-black/5">
                    <div className="p-10 border-b flex justify-between items-center bg-gray-50/30">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{editingStudent ? 'Update Dossier' : 'New Enrollment'}</h2>
                            <p className="text-gray-400 mt-1 font-bold text-sm tracking-wide">Syncing data to centralized academic vault.</p>
                        </div>
                        <button onClick={() => setShowModal(false)} className="bg-white p-3 rounded-full shadow-lg text-gray-400 hover:text-red-500 transition-all hover:rotate-90"><X size={24} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Account Reference (User ID)</label>
                            <input type="number" required value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" placeholder="ID Number..." />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Assigned Section</label>
                            <input type="text" required value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" placeholder="e.g. A" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Roll Designation</label>
                            <input type="text" required value={formData.rollNumber} onChange={e => setFormData({ ...formData, rollNumber: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" placeholder="e.g. 101" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Date of Birth</label>
                            <input type="date" required value={formData.dateOfBirth} onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Admission Date</label>
                            <input type="date" required value={formData.admissionDate} onChange={e => setFormData({ ...formData, admissionDate: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Guardian / Family Context</label>
                            <textarea rows="2" value={formData.guardianInfo} onChange={e => setFormData({ ...formData, guardianInfo: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-md shadow-sm" placeholder="Parent details and emergency contact..."></textarea>
                        </div>
                        <div className="md:col-span-2 mt-6 flex gap-6">
                            <button type="submit" className="flex-1 bg-primary text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-xl">
                                {editingStudent ? 'Commit Changes' : 'Finalize Enrollment'}
                            </button>
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-500 font-bold py-5 rounded-[1.5rem] hover:bg-gray-200 transition-all text-xl">Dismiss</button>
                        </div>
                    </form>
                </div>
            </div>}

            {linkingStudent && <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
                <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.2)] transform transition-all scale-100 ring-1 ring-black/5">
                    <div className="p-8 border-b flex justify-between items-center bg-teal-50/50">
                        <div>
                            <h2 className="text-2xl font-black text-teal-900 tracking-tighter">Link Parent Account</h2>
                            <p className="text-teal-600 mt-1 font-bold text-sm">To Student: {linkingStudent.studentName}</p>
                        </div>
                        <button onClick={() => { setLinkingStudent(null); setParentEmail(''); }} className="bg-white p-3 rounded-full shadow-lg text-gray-400 hover:text-red-500 transition-all hover:rotate-90"><X size={24} /></button>
                    </div>
                    <form onSubmit={handleLinkParent} className="p-8">
                        <div className="mb-6">
                            <label className="block text-sm font-black text-gray-700 mb-2">Parent Registered Email</label>
                            <input type="email" required value={parentEmail} onChange={e => setParentEmail(e.target.value)} className="w-full bg-gray-50 border-2 border-transparent focus:border-teal-500 rounded-xl p-4 outline-none transition-all font-bold text-gray-800 text-lg shadow-sm" placeholder="parent@example.com" />
                            <p className="text-xs text-gray-400 mt-2 font-medium">The parent must be registered in the system with the 'parent' role using this email address.</p>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" className="flex-1 bg-teal-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-teal-500/30 hover:bg-teal-600 transition-all text-lg">
                                Link Account
                            </button>
                            <button type="button" onClick={() => { setLinkingStudent(null); setParentEmail(''); }} className="bg-gray-100 text-gray-600 font-bold py-4 px-6 rounded-2xl hover:bg-gray-200 transition-all text-lg">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>}
        </div>
    );
};

export default Students;
