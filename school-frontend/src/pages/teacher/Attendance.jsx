import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CheckCircle, XCircle, Clock, AlertCircle, Save, Calendar } from 'lucide-react';

const Attendance = () => {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/students');
            setStudents(res.data.students);
            // Initialize attendance state
            const initialAttendance = {};
            res.data.students.forEach(s => {
                initialAttendance[s.id] = { status: 'present', remarks: '' };
            });
            setAttendance(initialAttendance);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], status }
        }));
    };

    const handleRemarksChange = (studentId, remarks) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], remarks }
        }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        setMessage(null);
        try {
            // In a real app, you might want to send bulk or individual. The API POST /api/attendance handles one.
            // For simplicity in this demo, let's just loop or implement a bulk one.
            // Since the requested API plan said POST /api/attendance (singular), I'll loop or suggest a bulk one later.
            // Let's assume the teacher marks one by one or we iterate.

            const promises = Object.entries(attendance).map(([studentId, data]) => {
                return api.post('/attendance', {
                    student_id: studentId,
                    class_id: 1, // Placeholder: in real app, select class
                    date: date,
                    status: data.status,
                    remarks: data.remarks
                });
            });

            await Promise.all(promises);
            setMessage({ type: 'success', text: 'Attendance recorded for all students!' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to save some or all attendance records.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-gray-500 animate-pulse">Loading Academic Records...</div>;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Attendance Registry</h1>
                    <p className="text-gray-500 mt-2 font-medium">Daily status tracking for Class Section A</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                    <Calendar className="text-secondary" size={20} />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border-none outline-none font-bold text-gray-700"
                    />
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest border-b">
                        <tr>
                            <th className="px-10 py-6">Student Name</th>
                            <th className="px-8 py-6 text-center">Status</th>
                            <th className="px-10 py-6">Remarks</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {students.map((student) => (
                            <tr key={student.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center font-black text-secondary text-lg">
                                            {student.studentName?.charAt(0) || 'S'}
                                        </div>
                                        <div>
                                            <div className="font-black text-gray-900 leading-tight">{student.studentName}</div>
                                            <div className="text-xs font-bold text-gray-400 mt-0.5">Roll: {student.rollNumber}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex justify-center gap-2">
                                        {[
                                            { label: 'Present', value: 'present', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
                                            { label: 'Absent', value: 'absent', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
                                            { label: 'Late', value: 'late', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
                                            { label: 'Leave', value: 'leave', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => handleStatusChange(student.id, opt.value)}
                                                className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 group/btn
                                                    ${attendance[student.id]?.status === opt.value
                                                        ? `${opt.bg} border-${opt.color.split('-')[1]}-500/50 shadow-sm`
                                                        : 'border-transparent text-gray-300 hover:text-gray-400 hover:bg-gray-50'}`}
                                            >
                                                <opt.icon size={20} className={attendance[student.id]?.status === opt.value ? opt.color : 'text-current'} />
                                                <span className="text-[10px] font-black uppercase tracking-tighter">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-10 py-6">
                                    <input
                                        type="text"
                                        placeholder="Add note..."
                                        value={attendance[student.id]?.remarks || ''}
                                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                                        className="w-full bg-gray-100/50 border-none rounded-xl p-3 text-sm font-bold text-gray-600 outline-none focus:bg-white focus:ring-2 focus:ring-secondary/20 transition-all"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-8 bg-gray-50/50 border-t flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-secondary text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : <><Save size={20} /> Commit Attendance</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
