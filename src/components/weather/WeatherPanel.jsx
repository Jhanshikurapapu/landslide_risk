import React from 'react';
import { CloudRain, Thermometer, Droplets, Wind } from 'lucide-react';
import PropTypes from 'prop-types';

const WeatherPanel = ({ weather }) => {
    if (!weather) return null;

    return (
        <div className="glass-panel p-6 card-lift cursor-default group">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 font-['Outfit'] opacity-80">Live Weather Conditions</h3>

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 group-hover:bg-emerald-500/20 transition-colors">
                        <CloudRain className="w-10 h-10 text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-4xl font-black text-white font-['Outfit']">{weather.temperature}°C</div>
                        <div className="text-sm text-teal-400 font-bold tracking-wide uppercase">{weather.condition}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-400 font-medium">Precipitation</div>
                    <div className="font-bold text-teal-400 text-lg">25mm</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl">
                    <Droplets className="w-5 h-5 text-teal-400" />
                    <div>
                        <div className="text-xs text-slate-400">Humidity</div>
                        <div className="font-bold text-white">{weather.humidity}%</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl">
                    <Wind className="w-5 h-5 text-emerald-400" />
                    <div>
                        <div className="text-xs text-slate-400">Wind</div>
                        <div className="font-bold text-white">{weather.windSpeed} km/h</div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase">3-Day Forecast</h4>
                <div className="flex justify-between">
                    {weather.forecast.map((day, idx) => (
                        <div key={idx} className="text-center bg-slate-800/30 px-4 py-2 rounded-lg border border-transparent hover:border-emerald-500/30 transition-colors">
                            <div className="text-xs text-slate-400 mb-1 font-medium">{day.day}</div>
                            <div className="font-bold text-emerald-400 text-sm">{day.temp}°C</div>
                            <div className="text-[10px] text-teal-500">{day.rainfall}mm</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

WeatherPanel.propTypes = {
    weather: PropTypes.object
};

export default WeatherPanel;
