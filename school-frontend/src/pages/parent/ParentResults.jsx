import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import api from '../../services/api';

const ParentResults = ({ studentId }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (studentId) {
            fetchResults();
        }
    }, [studentId]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('[ParentResults] Fetching results for studentId:', studentId);

            const res = await api.get(`/parents/children/${studentId}/results`);
            console.log('[ParentResults] API response:', res.data);

            setResults(res.data.results || []);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch results';
            console.error('[ParentResults] Error:', errorMsg);
            setError(errorMsg);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <Award className="text-rose-500" size={32} />
                <h1 className="text-3xl font-bold text-gray-800">Exam Results</h1>
            </div>

            {loading && (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">Loading results...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
                    <p className="font-semibold">Error: {error}</p>
                </div>
            )}

            {!loading && results.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <Award size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-semibold">No exam results found</p>
                    <p className="text-gray-400 text-sm mt-2">Results will appear here when exams are graded</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {results.map((result) => (
                        <div
                            key={result.id}
                            className="bg-white shadow-md hover:shadow-lg rounded-2xl p-6 border border-gray-100 transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {result.subject_name || result.subject}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {result.exam_name}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-4xl font-extrabold text-blue-600">
                                        {result.marks}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        out of {result.total_marks}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div>
                                    {result.grade && (
                                        <div className="inline-block">
                                            <span className="text-sm text-gray-500">Grade: </span>
                                            <span className="font-bold text-lg text-green-600">
                                                {result.grade}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-gray-400">
                                    {result.exam_date 
                                        ? new Date(result.exam_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })
                                        : 'N/A'
                                    }
                                </p>
                            </div>

                            {result.remarks && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <p className="text-xs text-gray-500 font-semibold">Remarks</p>
                                    <p className="text-sm text-gray-700 mt-1">{result.remarks}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParentResults;
