import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!user) return;
            try {
                const res = await axios.get(`/api/ai/recommendations?userId=${user.id}`);
                setRecommendations(res.data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };
        fetchRecommendations();
    }, [user]);

    if (recommendations.length === 0) return null;

    return (
        <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 mb-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className="text-lg font-bold text-indigo-900">AI Health Insights</h2>
            </div>

            <div className="space-y-4">
                {recommendations.map((rec, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">{rec.category}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${rec.severity === 'high' ? 'bg-rose-100 text-rose-700' :
                                rec.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                                    'bg-emerald-100 text-emerald-700'
                                }`}>
                                {rec.severity === 'high' ? 'Attention Needed' : rec.severity === 'medium' ? 'Moderate' : 'Good'}
                            </span>
                        </div>
                        <p className="text-slate-800 font-medium mb-1">{rec.message}</p>
                        <p className="text-sm text-slate-500 italic">💡 Tip: {rec.action}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recommendations;
