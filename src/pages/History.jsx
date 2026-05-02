import React, { useEffect, useState } from 'react';
import HistoryTable from '../components/history/HistoryTable';
import { getRiskAssessmentHistory } from '../services/mockRiskService';
import { Clock } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getRiskAssessmentHistory();
                setHistory(data);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 glass-panel rounded-xl glow-effect border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover-scale">
                    <Clock className="w-7 h-7" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white font-['Outfit'] mb-1">Assessment History</h1>
                    <p className="text-slate-400">Archive of past risk assessments and generated reports.</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-500">Loading history records...</div>
            ) : (
                <HistoryTable history={history} />
            )}
        </div>
    );
};

export default History;
