import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const SendNotification = () => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        recipientGroup: 'all'
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await api.post('/notifications', formData);
            if (response.data.success) {
                setStatus({ type: 'success', message: 'Notification sent successfully!' });
                setFormData({ title: '', message: '', recipientGroup: 'all' });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to send notification'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
                <div className="p-8 bg-gradient-to-r from-secondary to-blue-600">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Send className="animate-bounce" /> Send Notification
                    </h2>
                    <p className="text-blue-100 mt-2">Broadcast messages to students, teachers, or everyone.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {status.message && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            <span className="font-medium">{status.message}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 ml-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter notification title..."
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 ml-1">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="5"
                            placeholder="Type your message here..."
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all resize-none"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 ml-1">Recipient Group</label>
                            <select
                                name="recipientGroup"
                                value={formData.recipientGroup}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all appearance-none cursor-pointer"
                            >
                                <option value="all">Everyone</option>
                                <option value="students">Students Only</option>
                                <option value="teachers">Teachers Only</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-[60px] bg-secondary hover:bg-opacity-90 text-white font-bold rounded-2xl shadow-lg shadow-secondary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : <><Send size={20} /> Send Broadast</>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendNotification;
