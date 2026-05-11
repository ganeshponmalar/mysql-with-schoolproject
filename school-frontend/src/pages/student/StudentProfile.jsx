import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, GraduationCap, Calendar, Phone, BookOpen, Layers, Cake, ShieldCheck } from 'lucide-react';

const StudentProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/students/profile');
                setProfile(res.data.student);
            
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-400 font-black text-xl animate-pulse">Retrieving identity tokens...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-black text-xl">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in zoom-in duration-700">
            <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 ring-1 ring-black/5">
                <div className="bg-gradient-to-br from-indigo-900 via-primary to-purple-800 p-12 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="w-48 h-48 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-center text-7xl font-black border-4 border-white/20 shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-500">
                            {profile.studentName?.charAt(0)}
                        </div>
                        <div className="text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-white/10 mb-4">
                                <ShieldCheck size={14} className="text-emerald-400" /> Authenticated Student
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter mb-4 leading-none">{profile.studentName}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <span className="bg-white text-primary px-5 py-2 rounded-2xl text-sm font-black flex items-center gap-2 shadow-xl shadow-black/10">
                                    <GraduationCap size={18} /> Roll No: {profile.rollNumber}
                                </span>
                                <span className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-2xl text-sm font-black flex items-center gap-2 border border-white/20">
                                    <Layers size={18} /> Section {profile.section}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    <div className="space-y-10 lg:col-span-1">
                        <div className="relative">
                            <div className="h-0.5 w-full bg-gray-100 absolute top-4"></div>
                            <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] bg-white relative inline-block pr-6 z-10 transition-all">Identity Details</h2>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="p-5 bg-orange-50 text-orange-600 rounded-[1.5rem] group-hover:rotate-12 transition-transform duration-300 shadow-sm"><Cake size={28} /></div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Date of Birth</p>
                                <p className="text-2xl font-black text-gray-800 tracking-tight">
                                    {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="p-5 bg-indigo-50 text-indigo-600 rounded-[1.5rem] group-hover:rotate-12 transition-transform duration-300 shadow-sm"><Calendar size={28} /></div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Dossier Registered</p>
                                <p className="text-2xl font-black text-gray-800 tracking-tight">
                                    {new Date(profile.admissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10 lg:col-span-2">
                        <div className="relative">
                            <div className="h-0.5 w-full bg-gray-100 absolute top-4"></div>
                            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] bg-white relative inline-block pr-6 z-10 transition-all">Communication Vault</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex items-center gap-6 group">
                                <div className="p-5 bg-emerald-50 text-emerald-600 rounded-[1.5rem] group-hover:-rotate-12 transition-transform duration-300 shadow-sm"><Mail size={28} /></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Official Email</p>
                                    <p className="text-xl font-black text-gray-800 break-all leading-tight">{profile.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 group">
                                <div className="p-5 bg-amber-50 text-amber-600 rounded-[1.5rem] group-hover:-rotate-12 transition-transform duration-300 shadow-sm"><User size={28} /></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Guardian Context</p>
                                    <p className="text-xl font-black text-gray-800 leading-tight">{profile.guardianInfo || 'Unspecified'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-8 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                            <div className="flex items-center gap-4 text-gray-400">
                                <BookOpen size={40} className="opacity-20 translate-y-1" />
                                <p className="text-sm font-medium italic leading-relaxed">
                                    "Education is not the learning of facts, but the training of the mind to think."
                                    <span className="block not-italic font-black text-[10px] uppercase mt-2 tracking-widest">— Albert Einstein</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
