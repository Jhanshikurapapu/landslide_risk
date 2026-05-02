import React, { useState } from 'react';
import { FileDown, Loader2, Download } from 'lucide-react';

import PropTypes from 'prop-types';

const ReportGenerator = ({ onGenerate }) => {
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
        setGenerating(true);
        if (onGenerate) {
            await onGenerate();
        }
        setTimeout(() => {
            setGenerating(false);
            window.print();
        }, 1000);
    };

    return (
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center card-lift group cursor-default print:hidden">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-full mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <FileDown className="w-8 h-8 text-emerald-400 group-hover:text-emerald-300" />
            </div>
            <h3 className="font-bold text-white mb-2 font-['Outfit']">Assessment Report</h3>
            <p className="text-xs text-slate-400 mb-6 px-4">Generate and save a comprehensive PDF report of current risk metrics.</p>

            <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] hover-scale glow-effect w-full justify-center transition-all"
            >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {generating ? 'Processing...' : 'Download PDF'}
            </button>
        </div>
    );
};

export default ReportGenerator;
