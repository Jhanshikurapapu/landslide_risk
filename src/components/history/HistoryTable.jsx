import React from 'react';
import PropTypes from 'prop-types';

const HistoryTable = ({ history }) => {
    if (!history || history.length === 0) {
        return <div className="p-8 text-center text-slate-500">No assessment history found.</div>;
    }

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/10 slide-up overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-slate-900/50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Coordinates</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Risk Level</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {history.map((record) => (
                            <tr key={record.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">{record.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200 font-medium">{record.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">{record.coordinates}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-full border 
                        ${record.riskLevel === 'High Alert' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                                            record.riskLevel === 'Warning' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                                                record.riskLevel === 'Watch' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                                                    'bg-green-500/10 text-green-400 border-green-500/30'}`}>
                                        {record.riskLevel}
                                    </span>
                                </td>
                                <td 
                                    className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400 hover:text-emerald-300 cursor-pointer font-bold"
                                    onClick={() => alert(`Retrieving Full Diagnostic Report #${record.id}...\n\nStatus: Secure Data Loaded Successfully.`)}
                                >
                                    View Report
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

HistoryTable.propTypes = {
    history: PropTypes.array
};

export default HistoryTable;
