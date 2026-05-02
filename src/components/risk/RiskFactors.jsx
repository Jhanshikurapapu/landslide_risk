import React from 'react';
import PropTypes from 'prop-types';

const FactorBar = ({ label, value, color }) => (
    <div className="mb-4">
        <div className="flex justify-between mb-1">
            <span className="text-xs font-bold text-slate-400 tracking-wider">{label}</span>
            <span className="text-xs font-black text-white">{value}%</span>
        </div>
        <div className="w-full bg-slate-800/50 rounded-full h-2 border border-slate-700/50 overflow-hidden">
            <div
                className={`h-full rounded-full ${color} shadow-[0_0_10px_${color.split('-')[1]}]`}
                style={{ width: `${value}%` }}
            ></div>
        </div>
    </div>
)

FactorBar.propTypes = {
    label: PropTypes.string,
    value: PropTypes.number,
    color: PropTypes.string
}

const RiskFactors = ({ factors }) => {
    return (
        <div className="glass-panel p-6 card-lift cursor-default group">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 font-['Outfit'] opacity-80">Risk Contributing Factors</h3>

            <FactorBar label="Rainfall Intensity" value={factors.rainfallIntensity} color="bg-emerald-500" />
            <FactorBar label="Slope Instability" value={factors.slopeAngle} color="bg-orange-500" />
            <FactorBar label="Vegetation Index (NDVI)" value={factors.vegetation} color="bg-emerald-500" />
            <FactorBar label="Soil Moisture" value={factors.soilMoisture} color="bg-teal-500" />
        </div>
    );
};

RiskFactors.propTypes = {
    factors: PropTypes.object
};

export default RiskFactors;
