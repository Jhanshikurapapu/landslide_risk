import React from 'react';
import { History, CheckCircle2, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const HistoricalProximityCard = ({ analysis }) => {
    if (!analysis) return null;

    return (
        <div className="glass-panel p-6 card-lift cursor-default group h-full">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 font-['Outfit'] opacity-80">Historical Analysis</h3>

            <div className={`p-5 rounded-2xl border ${analysis.isClose ? 'bg-orange-500/10 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]'} transition-colors duration-300`}>
                <div className="flex items-center gap-3 mb-3">
                    {analysis.isClose ? (
                        <AlertCircle className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
                    ) : (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                    )}
                    <span className={`font-black uppercase tracking-wider text-sm ${analysis.isClose ? 'text-orange-400' : 'text-emerald-400'}`}>
                        {analysis.isClose ? 'Historical Landslide Nearby' : 'No Recent History'}
                    </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed opacity-90">
                    {analysis.message}
                </p>
            </div>
        </div>
    );
};

HistoricalProximityCard.propTypes = {
    analysis: PropTypes.object
};

export default HistoricalProximityCard;
