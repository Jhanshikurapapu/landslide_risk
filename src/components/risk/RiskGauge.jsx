import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';

const RiskGauge = ({ value }) => {
    const data = [
        { value: value },
        { value: 100 - value }
    ];

    const activeColor = '#3b82f6'; // Crisis Monitoring Blue

    return (
        <div className="bg-[#161a23] p-6 rounded-2xl border border-white/5 h-full relative font-['Inter'] shadow-2xl">
            <h3 className="text-base font-bold text-slate-200 mb-2 tracking-wide flex justify-between items-center">
                <span>Severity of Impact</span>
                <span className="text-slate-500 cursor-pointer text-xl mb-2">···</span>
            </h3>
            <p className="text-[#64748b] text-[11px] font-medium leading-relaxed mb-6 pr-8">
                Based on infrastructure damage, economic losses, & population displacement.
            </p>
            
            <div className="h-44 relative flex flex-col items-center justify-center -mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            startAngle={90}
                            endAngle={-270}
                            innerRadius={65}
                            outerRadius={75}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={40}
                        >
                            <Cell key="val" fill={activeColor} style={{ filter: `drop-shadow(0 0 10px rgba(59,130,246,0.5))` }} />
                            <Cell key="rem" fill="#2d3343" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                    <span className="text-[40px] font-bold text-white tracking-tight font-['Inter']">{value}<span className="text-[20px]">%</span></span>
                    <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">SEVERE</span>
                </div>
            </div>
            
            <div className="flex items-center justify-between px-2 mt-2">
                <div className="flex flex-col items-center">
                    <span className="text-white text-xs font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span> 22</span>
                    <span className="text-[#64748b] text-[9px] font-bold uppercase tracking-widest mt-1">MINIMAL</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-white text-xs font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span> 38</span>
                    <span className="text-[#64748b] text-[9px] font-bold uppercase tracking-widest mt-1">MODERATE</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-white text-xs font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full"></span> 35</span>
                    <span className="text-[#64748b] text-[9px] font-bold uppercase tracking-widest mt-1">SEVERE</span>
                </div>
            </div>
        </div>
    );
};

RiskGauge.propTypes = {
    value: PropTypes.number.isRequired
};

export default RiskGauge;
