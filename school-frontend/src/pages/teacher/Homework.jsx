import React, { useState } from 'react';
import api from '../../services/api';
import { BookOpen, CheckCircle, AlertCircle, Save, Paperclip, Clock } from 'lucide-react';

const Homework = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        class_id: '1', // Placeholder
        due_date: '',
        attachment_url: ''
    });
    
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await api.post('/homework', formData);
            setMessage({ type: 'success', text: 'Homework assigned successfully!' });
            setFormData({
                title: '',
                description: '',
                subject: '',
                class_id: '1',
                due_date: '',
                attachment_url: ''
            });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to assign homework.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Assignment Center</h1>
                    <p className="text-gray-500 mt-2 font-medium">Create and broadcast homework tasks to students</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="max-w-4xl">
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
                    <div className="p-10 border-b bg-gray-50/30 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tighter">New Assignment</h2>
                            <p className="text-gray-400 font-bold text-xs mt-1">CLASS SECTION A</p>
                        </div>
                        <BookOpen className="text-gray-100" size={48} />
                    </div>
                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Homework Title</label>
                                <input type="text" required placeholder="e.g. Calculus Integration - Chapter 4" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Subject</label>
                                <input type="text" required placeholder="Mathematics" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Due Date</label>
                                <div className="relative">
                                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input type="date" required value={formData.due_date} onChange={e => setFormData({ ...formData, due_date: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl pl-14 p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Task Instructions</label>
                                <textarea rows="4" placeholder="Describe the homework steps, page numbers, or specific problems to solve..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-indigo-500/20 rounded-3xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-md shadow-sm"></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Reference Materials (URL)</label>
                                <div className="relative">
                                    <Paperclip className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input type="url" placeholder="https://cloud-storage.com/worksheet.pdf" value={formData.attachment_url} onChange={e => setFormData({ ...formData, attachment_url: e.target.value })} className="w-full bg-gray-100/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl pl-14 p-5 outline-none focus:bg-white transition-all font-black text-gray-800 text-lg shadow-sm" />
                                </div>
                            </div>
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-indigo-600 text-white font-black py-6 rounded-[1.5rem] shadow-2xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-xl flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {saving ? 'Assigning...' : <><Save size={24} /> Post Assignment</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Homework;
