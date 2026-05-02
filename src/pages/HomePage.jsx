import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Search, MapPin, Activity, History, Map as MapIcon, ChevronRight, Loader2, Globe, Cpu, Database, Mail } from 'lucide-react';
import { getCurrentLocation, searchLocations } from '../services/mockLocationService';

const HomePage = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const wrapperRef = useRef(null);

    // Number counters logic
    const [accuracy, setAccuracy] = useState(0);
    const [regions, setRegions] = useState(0);

    useEffect(() => {
        const accTimer = setInterval(() => setAccuracy(v => v < 98 ? v + 1 : 98), 20);
        const regTimer = setInterval(() => setRegions(v => v < 1450 ? v + 25 : 1450), 20);
        return () => { clearInterval(accTimer); clearInterval(regTimer); }
    }, []);

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
        navigate(`/dashboard?lat=${place.lat}&lng=${place.lon}`);
    };

    const handleUseCurrentLocation = async () => {
        setIsLocating(true);
        try {
            const loc = await getCurrentLocation();
            navigate(`/dashboard?lat=${loc.lat}&lng=${loc.lng}`);
        } catch (error) {
            console.error("Location error", error);
        } finally {
            setIsLocating(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim() && suggestions.length > 0) {
            handleSelectSuggestion(suggestions[0]);
        }
    };

    return (
        <div className="flex flex-col w-full fade-in-page">
            
            {/* HERO SECTION */}
            <section className="min-h-[85vh] flex flex-col justify-center relative overflow-hidden rounded-3xl mt-4 shadow-2xl glass-panel border-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&q=80')] opacity-[0.05] bg-cover bg-center blend-overlay"></div>
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-emerald-600 opacity-20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[40%] bg-teal-500 opacity-20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 font-medium text-sm mb-8 slide-up">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </span>
                        Live Global Satellite Network Active
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight slide-up delay-100">
                        Predict. Prevent. <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-teal-400 text-neon-cyan">
                            Protect lives.
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl font-light slide-up delay-200">
                        Advanced AI-driven landslide risk prediction system. Harnessing global weather data, topographical mapping, and real-time satellite imagery to deliver critical early warnings.
                    </p>

                    <div className="w-full max-w-3xl relative slide-up delay-300" ref={wrapperRef}>
                        <form onSubmit={handleSubmit} className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-16 pr-36 py-6 bg-slate-900/50 border border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-lg shadow-2xl backdrop-blur-xl"
                                placeholder="Enter a location, coordinates, or region..."
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center">
                                 <button
                                    type="submit"
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2 hover-scale glow-effect"
                                    disabled={isSearching}
                                >
                                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin"/> : "Analyze"}
                                </button>
                            </div>
                        </form>

                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-50 w-full mt-4 bg-slate-800/95 backdrop-blur-3xl border border-slate-700 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden max-h-60 overflow-y-auto text-left py-2">
                                {suggestions.map((place) => (
                                    <button
                                        key={place.place_id}
                                        type="button"
                                        className="w-full text-left px-6 py-4 hover:bg-slate-700/50 flex items-start gap-4 transition-colors group"
                                        onClick={() => handleSelectSuggestion(place)}
                                    >
                                        <MapPin className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0 group-hover:text-teal-400 transition-colors" />
                                        <span className="text-base text-slate-300 group-hover:text-white transition-colors line-clamp-2 leading-tight">
                                            {place.display_name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex items-center gap-4 text-sm text-slate-500 slide-up delay-300">
                        <span>or</span>
                        <button 
                            onClick={handleUseCurrentLocation}
                            disabled={isLocating}
                            className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors font-medium hover:underline bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-full"
                        >
                            {isLocating ? <Loader2 className="w-4 h-4 animate-spin"/> : <MapPin className="w-4 h-4" />}
                            Detect My Location automatically
                        </button>
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="py-20 relative z-10 w-full max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
                    <div className="p-4 slide-up">
                        <div className="text-5xl font-black text-white font-['Outfit'] mb-2">{accuracy}%</div>
                        <div className="text-slate-400 font-medium uppercase tracking-widest text-sm">Prediction Accuracy</div>
                    </div>
                    <div className="p-4 slide-up delay-100">
                        <div className="text-5xl font-black text-white font-['Outfit'] mb-2">{regions}+</div>
                        <div className="text-slate-400 font-medium uppercase tracking-widest text-sm">Regions Monitored</div>
                    </div>
                    <div className="p-4 slide-up delay-200">
                        <div className="text-5xl font-black text-white font-['Outfit'] mb-2">24/7</div>
                        <div className="text-slate-400 font-medium uppercase tracking-widest text-sm">Active AI Surveillance</div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="py-16 relative z-10 w-full max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Powered by Next-Gen AI</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">Our platform merges complex meteorological APIs, real-time satellite vision, and topographical history to foresee structural land failures.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    <div className="glass-panel p-8 card-lift group cursor-default">
                        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl w-fit mb-6 transition-colors group-hover:bg-emerald-500/20">
                            <Activity className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 font-['Outfit'] group-hover:text-emerald-400 transition-colors">Real-Time Risk Analysis</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Combines live local weather forecasts, soil saturation indexes, and seismic data to calculate risk probability metrics instantly.
                        </p>
                    </div>

                    <div className="glass-panel p-8 card-lift group cursor-default">
                        <div className="bg-teal-500/10 border border-teal-500/30 p-4 rounded-2xl w-fit mb-6 transition-colors group-hover:bg-teal-500/20">
                            <Globe className="w-8 h-8 text-teal-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 font-['Outfit'] group-hover:text-teal-400 transition-colors">Interactive Topography</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Examine precise location risks globally using varying terrain layers, satellite perspectives, and fluid 3D spatial rendering.
                        </p>
                    </div>

                    <div className="glass-panel p-8 card-lift group cursor-default">
                        <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-2xl w-fit mb-6 transition-colors group-hover:bg-indigo-500/20">
                            <Cpu className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 font-['Outfit'] group-hover:text-indigo-400 transition-colors">Advanced AI Vision</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Upload custom satellite or drone imagery to deploy our computer vision models to detect unstable terrain immediately.
                        </p>
                    </div>

                </div>
            </section>

            {/* CONTACT / CTA SECTION */}
            <section className="py-24 relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
                <div className="p-12 glass-panel rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/20 blur-3xl rounded-full"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-white mb-6">Need Enterprise Solutions?</h2>
                        <p className="text-slate-400 mb-8 max-w-xl mx-auto text-lg">
                            We provide API access and dedicated monitoring channels for government agencies, NGOs, and enterprise construction firms.
                        </p>
                        <button className="bg-white text-slate-900 hover:bg-slate-200 px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover-scale flex items-center gap-2 mx-auto">
                            <Mail className="w-5 h-5"/>
                            Contact Support Team
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
