import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, CheckCircle, AlertTriangle, Printer, ExternalLink, Bell } from 'lucide-react';
import api from '../../services/api';

const StudentFeeBoard = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyFees();
    }, []);

    const fetchMyFees = async () => {
        try {
            const response = await api.get('/fees/my');
            if (response.data.success) {
                setFees(response.data.fees);
            }
        } catch (error) {
            console.error('Error fetching fees:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="bg-gradient-to-br from-primary/10 to-indigo-50 p-8 rounded-[2rem] border border-primary/5 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <Bell className="text-primary animate-bounce-slow" size={36} /> Fee Notification Board
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg font-medium">Keep track of your academic fees, due dates, and payment history.</p>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12">
                    <DollarSign size={200} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {fees.length === 0 ? (
                    <div className="bg-white p-20 rounded-[2rem] text-center border shadow-sm flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle size={48} className="text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">Clear Records!</h3>
                        <p className="text-gray-500 mt-2 max-w-sm">No fee records found for your account. You're all caught up or no fees have been assigned yet.</p>
                    </div>
                ) : (
                    fees.map(fee => (
                        <div
                            key={fee.id}
                            className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group"
                        >
                            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                <div className="p-8 md:w-1/3 bg-gray-50/50 flex flex-col justify-center">
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Total Due</p>
                                    <p className="text-5xl font-black text-primary tracking-tighter flex items-center gap-1">
                                        <span className="text-3xl opacity-50">$</span>{fee.amount}
                                    </p>
                                </div>
                                <div className="p-8 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Clock size={20} /></div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Due Date</p>
                                                <p className="font-bold text-gray-700">{formatDate(fee.due_date)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${fee.payment_date ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                                <CheckCircle size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Date</p>
                                                <p className="font-bold text-gray-700">{fee.payment_date ? formatDate(fee.payment_date) : 'Pending'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between items-start sm:items-end">
                                        <span className={`px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-sm ${fee.status === 'paid' ? 'bg-green-500 text-white' :
                                                fee.status === 'overdue' ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-400 text-white'
                                            }`}>
                                            {fee.status}
                                        </span>
                                        <div className="flex gap-3 mt-4">
                                            <button className="flex items-center gap-2 text-primary font-bold hover:underline text-sm"><Printer size={16} /> Print Receipt</button>
                                            <button className="flex items-center gap-2 text-gray-400 hover:text-gray-700 font-bold text-sm"><ExternalLink size={16} /> View Details</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentFeeBoard;
