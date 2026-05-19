import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Award, CheckCircle, AlertCircle, Save, ChevronRight, UserPlus } from 'lucide-react';

const Results = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [formData, setFormData] = useState({
        exam_name: '',
        subject: '',
        marks: '',
        total_marks: '100',
        grade: '',
        remarks: '',
        exam_date: new Date().toISOString().split('T')[0]
    });
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
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStudent) return;
        setSaving(true);
        setMessage(null);
        try {
            await api.post('/results', {
                ...formData,
                student_id: selectedStudent.id
            });
            setMessage({ type: 'success', text: `Result recorded for ${selectedStudent.studentName}!` });
            setFormData({
                exam_name: '',
                subject: '',
                marks: '',
                total_marks: '100',
                grade: '',
                remarks: '',
                exam_date: new Date().toISOString().split('T')[0]
            });
            setSelectedStudent(null);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to record the exam result.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-gray-500 animate-pulse">Loading Student Records...</div>;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Academic Performance</h1>
                <p className="text-gray-500 mt-2 font-medium">Record and manage student exam scores and grading</p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Select Student</h3>
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden divide-y">
                        {students.map((student) => (
                            <button
                                key={student.id}
                                onClick={() => setSelectedStudent(student)}
                                className={`w-full text-left p-6 transition-all flex items-center justify-between group
                                    ${selectedStudent?.id === student.id ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm
                                        ${selectedStudent?.id === student.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {student.studentName?.charAt(0) || 'S'}
                                    </div>
                                    <div>
                                        <div className="font-black text-gray-800 leading-tight">{student.studentName}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Roll: {student.rollNumber}</div>
                                    </div>
                                </div>
                                <ChevronRight size={18} className={`transition-transform ${selectedStudent?.id === student.id ? 'translate-x-1 text-blue-500' : 'text-gray-200'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {selectedStudent ? (
                        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/30 border border-gray-100 overflow-hidden ring-1 ring-black/5 animate-in slide-in-from-right-4 duration-500">
                            <div className="p-10 border-b bg-gray-50/30 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Enter Marks</h2>
                                    <p className="text-gray-400 font-bold text-xs mt-1">FOR {selectedStudent.studentName.toUpperCase()}</p>
                                </div>
                                <Award className="text-gray-200" size={40} />
                            </div>
                            <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Exam Name</label>
                                    <input type="text" required placeholder="e.g. Midterm 2024" value={formData.exam_name} onChange={e => setFormData({ ...formData, exam_name: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-blue-500/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Subject</label>
                                    <input type="text" required placeholder="e.g. Mathematics" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-blue-500/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Marks Obtained</label>
                                    <input type="number" required placeholder="85" value={formData.marks} onChange={e => setFormData({ ...formData, marks: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-blue-500/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-3xl shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Total Marks</label>
                                    <input type="number" required placeholder="100" value={formData.total_marks} onChange={e => setFormData({ ...formData, total_marks: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-blue-500/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-3xl shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Final Grade</label>
                                    <input type="text" placeholder="e.g. A+" value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-blue-500/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-2xl shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Exam Date</label>
                                    <input type="date" required value={formData.exam_date} onChange={e => setFormData({ ...formData, exam_date: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-blue-500/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Teacher's Remarks</label>
                                    <textarea rows="3" placeholder="Excellent performance, keep it up!" value={formData.remarks} onChange={e => setFormData({ ...formData, remarks: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-blue-500/20 rounded-3xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-md shadow-sm"></textarea>
                                </div>
                                <div className="md:col-span-2 mt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-blue-600 text-white font-black py-6 rounded-[1.5rem] shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-xl flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {saving ? 'Recording...' : <><Save size={24} /> Submit Result Record</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 space-y-6">
                            <div className="bg-gray-50 p-8 rounded-full">
                                <UserPlus size={60} className="text-gray-200" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-300">Select a Student</h3>
                                <p className="text-gray-300 font-bold max-w-xs mt-2">Pick a student from the sidebar to start recording their latest academic achievements.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Results;
