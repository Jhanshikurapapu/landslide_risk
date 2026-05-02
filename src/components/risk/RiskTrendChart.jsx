import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';

const RiskTrendChart = ({ data }) => {
    return (
        <div className="bg-[#161a23] p-6 rounded-2xl border border-white/5 h-full flex flex-col font-['Inter'] shadow-2xl relative">
            <div className="flex justify-between items-start mb-6">
                <div className="max-w-[60%]">
                    <h3 className="text-base font-bold text-slate-200 mb-2 flex items-center gap-2">
                        Forecast by AI <span className="text-slate-500 cursor-pointer text-xl -mt-1">···</span>
                    </h3>
                    <p className="text-[#64748b] text-[11px] font-medium leading-relaxed pr-2">
                        This line chart predicts risk levels over time, aiding scientific decision-making for risk management in vulnerable areas.
                    </p>
                </div>
                <div className="flex flex-col items-end text-right">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">• INCREASE</span>
                        <span className="bg-[#1e293b] text-slate-300 text-[10px] px-1.5 py-0.5 rounded font-bold">+0.34 %</span>
                    </div>
                    <span className="text-[32px] font-bold text-white tracking-tight">26.3<span className="text-xl">%</span></span>
                </div>
            </div>

            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRiskBlue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                            dy={10}
                            tickFormatter={(v, i) => `0${i+1} ${v}`}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                            tickFormatter={(v) => `${v}%`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15, 23, 42, 0.95)', color: '#fff' }}
                            itemStyle={{ fontWeight: 600 }}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="risk"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorRiskBlue)"
                            strokeWidth={2}
                            activeDot={{ r: 4, strokeWidth: 2, fill: '#1e293b', stroke: '#3b82f6' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

RiskTrendChart.propTypes = {
    data: PropTypes.array.isRequired
};

export default RiskTrendChart;
