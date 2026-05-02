import React from 'react';
import { AlertOctagon } from 'lucide-react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const WeatherAlert = ({ alert }) => {
    if (!alert) return null;

    const colorStyles = alert.severity === 'red' ? 'bg-red-500/10 text-red-100 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] icon-red-400' :
        alert.severity === 'orange' ? 'bg-orange-500/10 text-orange-100 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)] icon-orange-400' :
            'bg-yellow-500/10 text-yellow-100 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)] icon-yellow-400';

    return (
        <div className={clsx("p-5 rounded-2xl border flex items-start gap-4 mt-6 glass-panel animate-pulse", colorStyles)}>
            <AlertOctagon className={clsx("w-6 h-6 flex-shrink-0 mt-0.5", alert.severity === 'red' ? 'text-red-400' : alert.severity === 'orange' ? 'text-orange-400' : 'text-yellow-400')} />
            <div>
                <h4 className="font-bold text-sm uppercase mb-1 tracking-wider">Active Weather Warning</h4>
                <p className="text-sm leading-relaxed opacity-90">{alert.message}</p>
            </div>
        </div>
    );
};

WeatherAlert.propTypes = {
    alert: PropTypes.object
};

export default WeatherAlert;
