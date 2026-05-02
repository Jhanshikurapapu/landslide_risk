import React, { useEffect, useState } from 'react';
import MapView from '../components/map/MapView';
import { getHistoricalEvents } from '../services/mockHistoricalService';
import { AlertTriangle } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getHistoricalEvents();
                // Map events to markers format
                const markers = data.map(event => ({
                    lat: event.lat,
                    lng: event.lng,
                    popupText: (
                        <div>
                            <strong>{event.name} ({event.year})</strong>
                            <br />
                            Severity: {event.severity}
                            <br />
                            <span className="text-xs">{event.description}</span>
                        </div>
                    )
                }));
                setEvents(markers);
            } catch (error) {
                console.error("Failed to load events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 glass-panel rounded-xl glow-effect text-orange-400 bg-orange-500/10 border-orange-500/30 hover-scale">
                    <AlertTriangle className="w-7 h-7" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white font-['Outfit'] mb-1">Historical Landslide Events</h1>
                    <p className="text-slate-400">Geospatial database of known major landslide incidents.</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-500">Loading event data...</div>
            ) : (
                <div className="glass-panel p-6 rounded-2xl border-white/10 slide-up delay-100 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <MapView
                        lat={34.05}
                        lng={-118.25}
                        markers={events}
                    />
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Legend or list could go here */}
                        <div className="text-sm text-slate-400 font-medium">
                            Showing <span className="text-orange-400 font-bold">{events.length}</span> recorded major events in the region.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
