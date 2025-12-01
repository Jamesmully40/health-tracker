import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LogForm = () => {
    const [formData, setFormData] = useState({
        systolic: '',
        diastolic: '',
        glucose: '',
        heartRate: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/logs', { ...formData, userId: user.id });
            navigate('/');
        } catch (error) {
            console.error('Error logging data:', error);
            alert('Failed to log data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-lg">
            <div className="card">
                <div className="mb-8 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Log Health Data</h2>
                    <p className="text-slate-500 mt-2">Enter your latest vitals to track your progress.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Systolic</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="systolic"
                                    value={formData.systolic}
                                    onChange={handleChange}
                                    className="input-field pr-12"
                                    placeholder="120"
                                    required
                                />
                                <span className="absolute right-4 top-3.5 text-slate-400 text-sm">mmHg</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Diastolic</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="diastolic"
                                    value={formData.diastolic}
                                    onChange={handleChange}
                                    className="input-field pr-12"
                                    placeholder="80"
                                    required
                                />
                                <span className="absolute right-4 top-3.5 text-slate-400 text-sm">mmHg</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Blood Glucose</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="glucose"
                                value={formData.glucose}
                                onChange={handleChange}
                                className="input-field pr-12"
                                placeholder="95"
                                required
                            />
                            <span className="absolute right-4 top-3.5 text-slate-400 text-sm">mg/dL</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Heart Rate</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="heartRate"
                                value={formData.heartRate}
                                onChange={handleChange}
                                className="input-field pr-12"
                                placeholder="72"
                                required
                            />
                            <span className="absolute right-4 top-3.5 text-slate-400 text-sm">bpm</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full btn-primary flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            'Save Entry'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LogForm;
