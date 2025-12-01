import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const isActive = (path) => {
        return location.pathname === path
            ? "text-emerald-600 bg-emerald-50 font-semibold"
            : "text-slate-600 hover:text-emerald-600 hover:bg-slate-50";
    };

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            HealthTracker
                        </span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${isActive('/')}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/log"
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${isActive('/log')}`}
                        >
                            Log Health
                        </Link>
                        <button
                            onClick={logout}
                            className="px-4 py-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
