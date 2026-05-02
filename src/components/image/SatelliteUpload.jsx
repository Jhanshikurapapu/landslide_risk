import React from 'react';
import { UploadCloud } from 'lucide-react';
import PropTypes from 'prop-types';

const SatelliteUpload = ({ onUpload, isAnalyzing }) => {
    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div
            className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer bg-slate-900/40 relative overflow-hidden group"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <input
                type="file"
                id="satellite-upload"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
                disabled={isAnalyzing}
            />
            <label htmlFor="satellite-upload" className="cursor-pointer flex flex-col items-center relative z-10 transition-transform group-hover:scale-105 duration-300">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.2)] mb-5">
                    <UploadCloud className="w-10 h-10 text-emerald-400 group-hover:animate-bounce" />
                </div>
                <h3 className="font-bold text-white font-['Outfit'] text-lg">Upload Satellite Imagery</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
                    Drag & drop or click to upload drone/satellite imagery for AI Topography Analysis.
                </p>
            </label>
        </div>
    );
};

SatelliteUpload.propTypes = {
    onUpload: PropTypes.func.isRequired,
    isAnalyzing: PropTypes.bool
};

export default SatelliteUpload;
