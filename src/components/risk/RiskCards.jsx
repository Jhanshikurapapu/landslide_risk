import React from 'react';
import { AlertTriangle, Droplets, Mountain, Wind } from 'lucide-react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// eslint-disable-next-line no-unused-vars
const Card = ({ title, value, unit, icon: Icon, color, subtitle }) => (
    <div className="bg-[#161a23] p-6 rounded-2xl border border-white/5 relative overflow-hidden font-['Inter'] shadow-2xl group flex flex-col justify-between">
        <div>
            <div className="flex justify-between items-start mb-2">
                <h4 className="text-slate-200 text-sm font-bold flex items-center gap-2">
                    {title}
                </h4>
                <span className="text-slate-500 cursor-pointer -mt-2 text-xl">···</span>
            </div>
            <p className="text-[#64748b] text-[10px] font-medium leading-relaxed mb-6 pr-4">
                {subtitle || `Tracking real-time predictive measurements for ${title.toLowerCase()} factors.`}
            </p>
        </div>
        
        <div className="mt-auto">
            <div className="flex items-center gap-4">
                <span className="text-[36px] font-bold text-white tracking-tight leading-none group-hover:text-blue-400 transition-colors">{value}</span>
                {unit && <span className="text-[#e2e8f0] font-bold text-[10px] bg-[#2d3343] px-2 py-1 rounded shadow-sm">{unit}</span>}
            </div>
        </div>
    </div>
);

Card.propTypes = {
    title: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    unit: PropTypes.string,
    icon: PropTypes.elementType,
    trend: PropTypes.string,
    color: PropTypes.string,
    subtitle: PropTypes.string
};

const RiskCards = ({ riskData }) => {
    if (!riskData) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card
                title="Overall Risk"
                value={riskData.riskLevel}
                icon={AlertTriangle}
                color="bg-status-danger"
            />
            <Card
                title="Environmental Score"
                value={riskData.environmentalScore}
                unit="/ 100"
                icon={Mountain}
                color="bg-status-warning"
            />
            <Card
                title="Soil Saturation"
                value={riskData.factors.soilMoisture}
                unit="%"
                icon={Droplets}
                color="bg-emerald-500"
            />
            <Card
                title="Weather Impact"
                value={riskData.weatherScore}
                unit="/ 100"
                icon={Wind}
                color="bg-status-watch"
            />
        </div>
    );
};

RiskCards.propTypes = {
    riskData: PropTypes.object
};

export default RiskCards;
