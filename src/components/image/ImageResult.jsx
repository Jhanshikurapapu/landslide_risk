import React from 'react';
import { ScanSearch, CheckCircle, XCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const ImageResult = ({ result, imageUrl }) => {
    if (!result && !imageUrl) return null;

    const isHighRisk = result?.riskLevel === 'High';

    return (
        <div className="glass-panel p-6 card-lift cursor-default group h-full flex flex-col">
            {imageUrl && (
                <div className="mb-6 rounded-xl overflow-hidden border border-white/10 relative bg-slate-900 group/image">
                    <img 
                        src={imageUrl} 
                        alt="Satellite Analysis Prevew" 
                        className={`w-full h-48 object-cover transition-opacity duration-500 ${result ? 'opacity-50 blur-[2px] group-hover/image:blur-none group-hover/image:opacity-100' : 'opacity-80'}`}
                    />
                    {!result && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                            <span className="text-white font-bold bg-emerald-600/80 px-4 py-2 rounded-full text-sm flex items-center gap-2 glow-effect">
                                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                                Awaiting Topography Scan...
                            </span>
                        </div>
                    )}
                </div>
            )}
            
            {result && (
                <div className="flex items-start gap-5 flex-1">
                    {/* Animated Confidence Ring */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            {/* Background circle */}
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                            {/* Foreground circle (Animated) */}
                            <path 
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                fill="none" 
                                stroke={isHighRisk ? '#ef4444' : '#10b981'} 
                                strokeWidth="3" 
                                strokeDasharray={`${result.confidence}, 100`}
                                className="transition-all duration-1000 ease-out"
                                style={{ filter: `drop-shadow(0 0 5px ${isHighRisk ? 'rgba(239,68,68,0.8)' : 'rgba(16,185,129,0.8)'})` }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-black text-white">{result.confidence}%</span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-white text-lg font-['Outfit']">Analysis Report</h3>
                                <p className="text-xs text-emerald-400 font-medium">Neural Net Confidence: {result.confidence}%</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border ${isHighRisk ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                                {result.riskLevel} Risk
                            </span>
                        </div>

                        <div className="space-y-3">
                            {result.featuresDetected.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-2 rounded-lg border border-white/5">
                                    {isHighRisk ? <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                                    <span className="font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 p-4 bg-emerald-900/20 rounded-xl text-sm text-slate-300 border border-emerald-500/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                            <span className="font-bold text-emerald-400 uppercase tracking-wider text-xs block mb-1">Recommendation:</span>
                            {result.recommendation}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

ImageResult.propTypes = {
    result: PropTypes.object,
    imageUrl: PropTypes.string
};

export default ImageResult;
