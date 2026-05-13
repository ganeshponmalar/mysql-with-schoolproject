import React, { useState, useEffect } from 'react';
import { Bell, Clock, Search, Filter, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            if (response.data.success) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
                        <Bell className="text-primary animate-pulse" /> Notifications
                    </h2>
                    <p className="text-gray-500 mt-1">Stay updated with the latest news from your teachers.</p>
                </div>
            </div>

            <div className="grid gap-6">
                {notifications.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">No Notifications Yet</h3>
                        <p className="text-gray-500 mt-2">When teachers send updates, they will appear here.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100 hover:border-primary/20 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-800">{notification.title}</h3>
                                        <div className="flex items-center gap-2 text-gray-400 text-xs mt-1 font-medium bg-gray-50 px-2 py-0.5 rounded-lg w-fit">
                                            <Clock size={12} />
                                            {formatDate(notification.created_at)}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${notification.recipient_group === 'all' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    {notification.recipient_group}
                                </span>
                            </div>
                            <div className="text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-50 italic">
                                "{notification.message}"
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentNotifications;
