import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Recommendations from './Recommendations';
import { AuthContext } from '../context/AuthContext';

const StatCard = ({ title, value, unit, trend, color }) => (
    <div className="card hover:shadow-md transition-shadow duration-200">
        <h3 className="text-slate-500 text-sm font-medium mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold text-${color}-600`}>{value}</span>
            <span className="text-slate-400 text-sm">{unit}</span>
        </div>
    </div>
);

const Dashboard = () => {
    const [logs, setLogs] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchLogs = async () => {
            if (!user) return;
            try {
                const res = await axios.get(`http://localhost:5000/api/logs?userId=${user.id}`);
                setLogs(res.data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };
        fetchLogs();
    }, [user]);

    const chartData = [...logs].reverse().map(log => ({
        date: new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        systolic: log.systolic,
        diastolic: log.diastolic,
        glucose: log.glucose
    }));

    const latest = logs[0] || {};
    const avgSys = logs.length ? Math.round(logs.reduce((acc, curr) => acc + curr.systolic, 0) / logs.length) : 0;
    const avgDia = logs.length ? Math.round(logs.reduce((acc, curr) => acc + curr.diastolic, 0) / logs.length) : 0;
    const avgGlu = logs.length ? Math.round(logs.reduce((acc, curr) => acc + curr.glucose, 0) / logs.length) : 0;

    if (logs.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Health Overview</h1>
                    <p className="text-slate-500">Track your vitals and monitor your progress.</p>
                </div>
                <div className="card p-8 text-center">
                    <h3 className="text-xl font-medium text-slate-700 mb-2">No Health Logs Yet</h3>
                    <p className="text-slate-500 mb-4">Start logging your blood pressure and glucose to see trends and AI insights.</p>
                    <a href="/log" className="btn-primary inline-block">Log First Entry</a>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Health Overview</h1>
                <p className="text-slate-500">Track your vitals and monitor your progress.</p>
            </div>

            <Recommendations />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Avg Blood Pressure" value={`${avgSys}/${avgDia}`} unit="mmHg" color="emerald" />
                <StatCard title="Avg Glucose" value={avgGlu} unit="mg/dL" color="teal" />
                <StatCard title="Latest Heart Rate" value={latest.heartRate || '-'} unit="bpm" color="rose" />
                <StatCard title="Total Logs" value={logs.length} unit="entries" color="blue" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="card">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Blood Pressure History</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#059669" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Glucose Trends</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="glucose" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGlucose)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Logs Table */}
            <div className="card overflow-hidden p-0">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Blood Pressure</th>
                                <th className="px-6 py-4 font-medium">Glucose</th>
                                <th className="px-6 py-4 font-medium">Heart Rate</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map((log) => {
                                const isHighBP = log.systolic > 140 || log.diastolic > 90;
                                return (
                                    <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(log.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-medium ${isHighBP ? 'text-rose-600' : 'text-slate-700'}`}>
                                                {log.systolic}/{log.diastolic} <span className="text-xs text-slate-400 font-normal">mmHg</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700">
                                            {log.glucose} <span className="text-xs text-slate-400">mg/dL</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700">
                                            {log.heartRate} <span className="text-xs text-slate-400">bpm</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isHighBP ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                                                }`}>
                                                {isHighBP ? 'Attention' : 'Normal'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
