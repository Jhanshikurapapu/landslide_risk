import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, MapPin as MapPinIcon } from 'lucide-react';
import PropTypes from 'prop-types';
import { searchLocations } from '../../services/mockLocationService';

const LocationSelector = ({ onSearch, onUseCurrentLocation, isLoading, currentLat, currentLng }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim() && showSuggestions) {
                setIsSearching(true);
                try {
                    const results = await searchLocations(query);
                    setSuggestions(results);
                } catch (error) {
                    console.error("Geocoding failed", error);
                    setSuggestions([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSuggestions([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [query, showSuggestions]);

    const handleSelectSuggestion = (place) => {
        setQuery(place.display_name);
        setShowSuggestions(false);
        setSuggestions([]);
        onSearch({
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon),
            name: place.display_name
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim() && suggestions.length > 0) {
            handleSelectSuggestion(suggestions[0]);
        }
    };

    return (
        <div className="glass-panel p-6 card-lift cursor-default group" ref={wrapperRef}>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-['Outfit'] opacity-80">
                Location Selection
            </h3>

            <div className="relative mb-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-500"
                            placeholder="Search coordinates or place..."
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                        />
                        {isSearching && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] hover-scale glow-effect"
                        disabled={isLoading || isSearching}
                    >
                        Search
                    </button>
                </form>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden max-h-60 overflow-y-auto">
                        {suggestions.map((place) => (
                            <button
                                key={place.place_id}
                                type="button"
                                className="w-full text-left px-5 py-3 hover:bg-slate-700/60 flex items-start gap-3 border-b border-slate-700/30 last:border-0 transition-colors group/item"
                                onClick={() => handleSelectSuggestion(place)}
                            >
                                <MapPinIcon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0 group-hover/item:text-emerald-400" />
                                <span className="text-sm text-slate-300 group-hover/item:text-white line-clamp-2 leading-tight">
                                    {place.display_name}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={onUseCurrentLocation}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 py-3 rounded-xl text-sm font-bold transition-all border border-teal-500/20 hover-scale"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                Use Browser Geolocation
            </button>

            <div className="mt-4 flex items-center justify-between text-xs font-mono bg-slate-900/50 p-2 rounded-lg border border-white/5">
                <span className="text-slate-400">LAT: <span className="text-emerald-400 ml-1">{currentLat ? currentLat.toFixed(4) : '--.----'}</span></span>
                <span className="text-slate-400">LNG: <span className="text-teal-400 ml-1">{currentLng ? currentLng.toFixed(4) : '--.----'}</span></span>
            </div>
        </div>
    );
};

LocationSelector.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onUseCurrentLocation: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    currentLat: PropTypes.number,
    currentLng: PropTypes.number,
};

export default LocationSelector;
