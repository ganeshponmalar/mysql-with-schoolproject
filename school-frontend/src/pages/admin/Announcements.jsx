import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Megaphone, CheckCircle, AlertCircle, Trash2, Send, ShieldAlert, ShieldCheck, Info } from 'lucide-react';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        target_role: 'all',
        priority: 'medium',
        expiry_date: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/announcements');
            setAnnouncements(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await api.post('/announcements', formData);
            setMessage({ type: 'success', text: 'Announcement broadcasted successfully!' });
            setFormData({
                title: '',
                message: '',
                target_role: 'all',
                priority: 'medium',
                expiry_date: ''
            });
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to post announcement.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        try {
            await api.delete(`/announcements/${id}`);
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-1000">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Communications Hub</h1>
                    <p className="text-gray-500 mt-2 font-medium">Broadcast urgent updates and school-wide announcements</p>
                </div>
                <Megaphone size={60} className="text-gray-100 mb-2" />
            </div>

            {message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-1">
                    <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden sticky top-8">
                        <div className="p-10 border-b bg-gray-50/50">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tighter">New Broadcast</h2>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Target specific roles or everyone</p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 space-y-6">
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Title</label>
                                <input type="text" required placeholder="Summer Break Schedule" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-50 border-2 border-transparent focus:border-cyan-500/20 rounded-2xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Target Audience</label>
                                <select value={formData.target_role} onChange={e => setFormData({ ...formData, target_role: e.target.value })} className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 outline-none font-black text-gray-700 shadow-sm">
                                    <option value="all">Everyone (All Roles)</option>
                                    <option value="teacher">Teachers Only</option>
                                    <option value="student">Students Only</option>
                                    <option value="parent">Parents Only</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Priority</label>
                                    <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 outline-none font-black text-gray-700 shadow-sm">
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Expiry Date</label>
                                    <input type="date" value={formData.expiry_date} onChange={e => setFormData({ ...formData, expiry_date: e.target.value })} className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 outline-none font-black text-gray-700 shadow-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Message Content</label>
                                <textarea rows="4" required placeholder="Type your message here..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full bg-gray-50 border-2 border-transparent focus:border-cyan-500/20 rounded-3xl p-5 outline-none focus:bg-white transition-all font-black text-gray-800 shadow-sm"></textarea>
                            </div>
                            <button disabled={saving} className="w-full bg-cyan-600 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-cyan-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-xl flex items-center justify-center gap-3 disabled:opacity-50">
                                {saving ? 'Broadcasting...' : <><Send size={24} /> Dispatch Message</>}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="xl:col-span-2 space-y-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] px-4">Active Announcements</h3>
                    {loading ? (
                        <div className="text-center p-20 font-black text-gray-300 animate-pulse">Scanning frequencies...</div>
                    ) : announcements.length === 0 ? (
                        <div className="bg-gray-50 border-4 border-dashed rounded-[3rem] p-20 text-center text-gray-300 font-black">No active announcements found.</div>
                    ) : (
                        announcements.map((ann) => (
                            <div key={ann.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start group hover:shadow-xl transition-all border-l-[12px]" style={{ borderLeftColor: ann.priority === 'high' ? '#ef4444' : ann.priority === 'medium' ? '#f59e0b' : '#3b82f6' }}>
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ann.priority === 'high' ? 'bg-red-50 text-red-500' : ann.priority === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'}`}>
                                            {ann.priority} Priority
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                            To: {ann.target_role}
                                        </span>
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900 tracking-tighter">{ann.title}</h4>
                                    <p className="text-gray-500 font-medium leading-relaxed">{ann.message}</p>
                                    <div className="pt-4 flex items-center gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        <div className="flex items-center gap-2">Posted: {new Date(ann.created_at).toLocaleDateString()}</div>
                                        {ann.expiry_date && <div className="flex items-center gap-2">Expires: {new Date(ann.expiry_date).toLocaleDateString()}</div>}
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(ann.id)} className="p-4 rounded-2xl bg-red-50 text-red-200 hover:text-red-500 hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100">
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Announcements;
