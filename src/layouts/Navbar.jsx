import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, History, Map as MapIcon, ShieldAlert, Home, Radio } from 'lucide-react';
import clsx from 'clsx';

const Navbar = () => {
    const navLinkClass = ({ isActive }) =>
        clsx(
            "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium nav-link-slide",
            isActive
                ? "text-emerald-400 font-bold active"
                : "text-slate-400 hover:text-white"
        );

    return (
        <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-400 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.5)] glow-effect">
                            <ShieldAlert className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold text-white tracking-tight leading-none font-['Outfit'] flex items-center gap-2">
                                LandslideWatch AI
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-wider relative">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    LIVE
                                </span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <NavLink to="/" className={navLinkClass}>
                            <Home className="w-4 h-4" />
                            Overview
                        </NavLink>
                        <NavLink to="/dashboard" className={navLinkClass}>
                            <Radio className="w-4 h-4" />
                            Live Radar
                        </NavLink>
                        <NavLink to="/history" className={navLinkClass}>
                            <History className="w-4 h-4" />
                            Records
                        </NavLink>
                        <NavLink to="/events" className={navLinkClass}>
                            <MapIcon className="w-4 h-4" />
                            Events
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
