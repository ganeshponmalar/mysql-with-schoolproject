import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Trash2, Edit2, CheckCircle, AlertCircle, Calendar, User } from 'lucide-react';
import api from '../../services/api';

const ManageFees = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        studentId: '',
        amount: '',
        dueDate: '',
        paymentDate: '',
        status: 'pending'
    });
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            const response = await api.get('/fees/all');
            if (response.data.success) {
                setFees(response.data.fees);
            }
        } catch (error) {
            console.error('Error fetching fees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage({ type: '', text: '' });

        try {
            const response = await api.post('/fees', formData);
            if (response.data.success) {
                setStatusMessage({ type: 'success', text: 'Fee created successfully!' });
                setFormData({ studentId: '', amount: '', dueDate: '', paymentDate: '', status: 'pending' });
                setShowForm(false);
                fetchFees();
            }
        } catch (error) {
            setStatusMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to create fee'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this fee record?')) return;
        try {
            const response = await api.delete(`/fees/${id}`);
            if (response.data.success) {
                fetchFees();
            }
        } catch (error) {
            console.error('Error deleting fee:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <DollarSign className="text-secondary" size={36} /> Manage Student Fees
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg font-medium">Track and manage fee records for all students.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-6 py-3 bg-secondary text-white font-bold rounded-2xl shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
                >
                    {showForm ? 'Cancel' : <><Plus size={20} /> Create New Fee</>}
                </button>
            </div>

            {statusMessage.text && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${statusMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {statusMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold">{statusMessage.text}</span>
                </div>
            )}

            {showForm && (
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 animate-in zoom-in-95 duration-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 underline decoration-secondary decoration-4 underline-offset-8">Fee Details</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-600 ml-1">Student Roll Number or ID</label>
                            <input
                                type="text" name="studentId" value={formData.studentId} onChange={handleChange} required
                                placeholder="e.g. 101 or UUID"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-600 ml-1">Amount ($)</label>
                            <input
                                type="number" name="amount" value={formData.amount} onChange={handleChange} required
                                placeholder="0.00"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-600 ml-1">Due Date</label>
                            <input
                                type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-600 ml-1">Payment Date (Optional)</label>
                            <input
                                type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <button type="submit" disabled={loading} className="px-10 py-4 bg-secondary text-white font-bold rounded-2xl shadow-lg shadow-secondary/10 hover:opacity-90 disabled:opacity-50 transition-all">
                                {loading ? 'Processing...' : 'Save Fee Record'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-left border-b border-gray-100">
                                <th className="px-8 py-5 font-bold text-gray-400 text-sm uppercase tracking-wider">Student</th>
                                <th className="px-8 py-5 font-bold text-gray-400 text-sm uppercase tracking-wider">Amount</th>
                                <th className="px-8 py-5 font-bold text-gray-400 text-sm uppercase tracking-wider">Due Date</th>
                                <th className="px-8 py-5 font-bold text-gray-400 text-sm uppercase tracking-wider">Status</th>
                                <th className="px-8 py-5 font-bold text-gray-400 text-sm uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {fees.map(fee => (
                                <tr key={fee.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                                                {fee.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{fee.name}</p>
                                                <p className="text-gray-400 text-sm">Roll: {fee.roll_number}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-mono font-bold text-gray-700">${fee.amount}</td>
                                    <td className="px-8 py-6 text-gray-500 flex items-center gap-2"><Calendar size={16} /> {formatDate(fee.due_date)}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${fee.status === 'paid' ? 'bg-green-100 text-green-600' :
                                                fee.status === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            {fee.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(fee.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {fees.length === 0 && (
                        <div className="p-20 text-center text-gray-400 font-medium">No fee records found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageFees;
