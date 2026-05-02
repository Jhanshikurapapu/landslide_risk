import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';
import L from 'leaflet';
import MapController from './MapController';

// Fix for default marker
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Animated DivIcons based on risk level
const createAnimatedIcon = (riskLevel) => {
    let colorClass = 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'; // Safe
    if (riskLevel === 'High Alert' || riskLevel === 'High') colorClass = 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]';
    else if (riskLevel === 'Watch' || riskLevel === 'Medium') colorClass = 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]';

    return new L.DivIcon({
        className: 'custom-div-icon',
        html: `<div class="w-5 h-5 rounded-full ${colorClass} pulse-marker border-2 border-white"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

const MapView = ({ lat, lng, onMapClick, markers = [], weatherCondition = '', riskData = null }) => {
    const position = [lat, lng];

    let overlayClass = '';
    if (weatherCondition.includes('Rain') || weatherCondition.includes('Heavy')) {
        overlayClass = 'rain-overlay-animation';
    } else if (weatherCondition.includes('Storm')) {
        overlayClass = 'storm-lightning-effect';
    } else if (weatherCondition.includes('Wind') || weatherCondition === 'Cloudy') {
        overlayClass = 'wind-flow-animation';
    }

    // Attempt to parse out high risk for heatmap styling if available from markers or weather
    const hasHighRisk = markers.some(m => m.riskLevel === 'High') || currentRiskLevelByWeather(weatherCondition) === 'High';
    const heatColor = hasHighRisk ? '#ef4444' : '#10b981';

    return (
        <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl z-0 relative group glass-panel border-white/10">
            
            {/* CSS Environmental Overlay */}
            {overlayClass && (
                <div className={`env-overlay ${overlayClass}`} />
            )}

            {/* Floating Filter Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-[999] bg-[#111622]/90 backdrop-blur-xl px-6 py-3 rounded-xl border border-white/10 flex flex-wrap items-center justify-between shadow-2xl transition-all">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-base">⚠️</span>
                        <span className="text-slate-400 text-sm font-bold">Overall Risk : <span className="text-white text-lg ml-1">{riskData?.overallRisk || 0}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-blue-400 text-base">💧</span>
                        <span className="text-slate-400 text-sm font-bold">Moisture : <span className="text-white text-lg ml-1">{riskData?.factors?.soilMoisture || 0}%</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-teal-400 text-base">🌧️</span>
                        <span className="text-slate-400 text-sm font-bold">Rainfall : <span className="text-white text-lg ml-1">{riskData?.factors?.rainfallIntensity || 0}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-orange-400 text-base">🏔️</span>
                        <span className="text-slate-400 text-sm font-bold">Slope : <span className="text-white text-lg ml-1">{riskData?.factors?.slopeAngle || 0}°</span></span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Damage Ratio</span>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={riskData?.overallRisk || 0} 
                        readOnly 
                        className="w-32 h-1 bg-slate-700 appearance-none rounded-full accent-blue-500 pointer-events-none"
                    />
                </div>
            </div>

            <div className="w-full h-full map-3d-tilt bg-[#0a0f18] pb-16">
                <MapContainer
                    center={position}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%", backgroundColor: '#0a0f18' }}
                >
                    <ChangeView center={position} zoom={13} />

                    <LayersControl position="topright">
                        <LayersControl.BaseLayer name="Dark Matrix">
                            <TileLayer
                                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer checked name="Street Map (OSM) (Default)">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Satellite (Esri)">
                            <TileLayer
                                attribution='Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP'
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Topographic">
                            <TileLayer
                                attribution='Map data: &copy; <a href="https://www.opentopomap.org">OpenTopoMap</a>'
                                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>

                    {/* Simulated Heatmap based on target location */}
                    <Circle center={position} pathOptions={{ fillColor: heatColor, fillOpacity: 0.1, color: heatColor, weight: 1 }} radius={2000} />
                    <Circle center={position} pathOptions={{ fillColor: heatColor, fillOpacity: 0.2, color: 'transparent' }} radius={800} />

                    {/* Target location marker */}
                    <Marker position={position} icon={createAnimatedIcon(hasHighRisk ? 'High' : 'Safe')}>
                        <Popup className="glass-popup">
                            <div className="font-bold text-slate-800">Target Coordinates</div>
                            <div className="text-xs text-slate-500">{lat.toFixed(4)}, {lng.toFixed(4)}</div>
                        </Popup>
                    </Marker>

                    {/* Surrounding registered markers */}
                    {markers.map((marker, idx) => (
                        <Marker key={idx} position={[marker.lat, marker.lng]} icon={createAnimatedIcon(marker.riskLevel)}>
                            <Popup className="glass-popup">{marker.popupText}</Popup>
                        </Marker>
                    ))}

                    <MapController onMapClick={onMapClick} />
                </MapContainer>
            </div>
        </div>
    );
};

// Helper to determine baseline hazard
const currentRiskLevelByWeather = (cond) => {
    if (cond.includes('Storm')) return 'High';
    if (cond.includes('Rain')) return 'Medium';
    return 'Safe';
};

MapView.propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    onMapClick: PropTypes.func,
    markers: PropTypes.array,
    weatherCondition: PropTypes.string
};

export default MapView;
