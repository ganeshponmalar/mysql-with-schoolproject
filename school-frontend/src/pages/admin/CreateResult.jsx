import React, { useState } from 'react';
import api from '../../services/api';

const CreateResult = () => {
    const [formData, setFormData] = useState({
        student_id: '',
        exam_name: '',
        subject: '',
        marks: '',
        total_marks: '',
        grade: '',
        remarks: '',
        exam_date: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        console.log('[CreateResult] Submitting form data:', formData);
        console.log('[CreateResult] student_id type:', typeof formData.student_id, 'value:', formData.student_id);

        try {
            const res = await api.post('/results', formData);
            console.log('[CreateResult] Success response:', res.data);
            setStatus({ type: 'success', message: res.data.message || 'Result created successfully' });
            setFormData({
                student_id: '',
                exam_name: '',
                subject: '',
                marks: '',
                total_marks: '',
                grade: '',
                remarks: '',
                exam_date: ''
            });
        } catch (error) {
            console.error('[CreateResult] Error response:', error.response?.data || error.message);
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to create exam result'
            });
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
                <div className="p-8 bg-gradient-to-r from-secondary to-blue-600">
                    <h2 className="text-3xl font-bold text-white">Create Exam Result</h2>
                    <p className="text-blue-100 mt-2">Record exam results for students.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {status.message && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <span className="font-medium">{status.message}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <input
                            type="number"
                            name="student_id"
                            placeholder="Student ID"
                            value={formData.student_id}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-secondary/40"
                            required
                        />
                        <input
                            type="text"
                            name="exam_name"
                            placeholder="Exam Name"
                            value={formData.exam_name}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-secondary/40"
                            required
                        />
                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-secondary/40"
                            required
                        />
                        <input
                            type="number"
                            name="marks"
                            placeholder="Marks"
                            value={formData.marks}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-secondary/40"
                            required
                        />
                        <input
                            type="number"
                            name="total_marks"
                            placeholder="Total Marks"
                            value={formData.total_marks}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-secondary/40"
                            required
                        />
                        <input
                            type="text"
                            name="grade"
                            placeholder="Grade"
                            value={formData.grade}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-secondary/40"
                        />
                        <input
                            type="date"
                            name="exam_date"
                            value={formData.exam_date}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-secondary/40"
                        />
                        <textarea
                            name="remarks"
                            placeholder="Remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-secondary/40 min-h-[150px] resize-none"
                        />
                    </div>

                    <button type="submit" className="w-full bg-secondary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all">
                        Submit Result
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateResult;
