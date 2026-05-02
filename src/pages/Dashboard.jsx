import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MapView from '../components/map/MapView';
import LocationSelector from '../components/map/LocationSelector';
import RiskCards from '../components/risk/RiskCards';
import RiskGauge from '../components/risk/RiskGauge';
import RiskTrendChart from '../components/risk/RiskTrendChart';
import RiskFactors from '../components/risk/RiskFactors';
import WeatherPanel from '../components/weather/WeatherPanel';
import WeatherAlert from '../components/weather/WeatherAlert';
import HistoricalProximityCard from '../components/history/HistoricalProximityCard';
import ReportGenerator from '../components/report/ReportGenerator';
import SatelliteUpload from '../components/image/SatelliteUpload';
import ImageResult from '../components/image/ImageResult';

import { getRiskAnalysis, saveRiskAssessmentToHistory } from '../services/mockRiskService';
import { getWeatherData, getWeatherAlerts } from '../services/mockWeatherService';
import { checkHistoricalProximity } from '../services/mockHistoricalService';
import { analyzeSatelliteImage } from '../services/mockImageAnalysisService';
import { getCurrentLocation } from '../services/mockLocationService';

const Dashboard = () => {
    const routeLoc = useLocation();
    
    // Parse URL params for lat/lng
    const getInitialLocation = () => {
        const params = new URLSearchParams(routeLoc.search);
        const lat = parseFloat(params.get('lat'));
        const lng = parseFloat(params.get('lng'));
        if (!isNaN(lat) && !isNaN(lng)) {
            return { lat, lng };
        }
        return { lat: 34.05, lng: -118.25 }; // Default LA
    };

    const [location, setLocation] = useState(getInitialLocation());
    const [loading, setLoading] = useState(true);
    const [riskData, setRiskData] = useState(null);
    const [weather, setWeather] = useState(null);
    const [weatherAlert, setWeatherAlert] = useState(null);
    const [historicalProximity, setHistoricalProximity] = useState(null);
    const [satelliteResult, setSatelliteResult] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Initial load, or when route params change significantly
    useEffect(() => {
        const initLoc = getInitialLocation();
        setLocation(initLoc);
        fetchDashboardData(initLoc.lat, initLoc.lng);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routeLoc.search]);

    const fetchDashboardData = async (lat, lng) => {
        setLoading(true);
        try {
            // Parallel data fetching
            const [risk, weatherData, alertData, historyData] = await Promise.all([
                getRiskAnalysis(lat, lng),
                getWeatherData(lat, lng),
                getWeatherAlerts(lat, lng),
                checkHistoricalProximity(lat, lng)
            ]);

            setRiskData(risk);
            setWeather(weatherData);
            setWeatherAlert(alertData);
            setHistoricalProximity(historyData);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationSelect = (latlng) => {
        setLocation(latlng);
        fetchDashboardData(latlng.lat, latlng.lng);
    };

    const handleSearch = (geocodedLoc) => {
        if (geocodedLoc && typeof geocodedLoc === 'object' && geocodedLoc.lat) {
            setLocation({ lat: geocodedLoc.lat, lng: geocodedLoc.lng });
            fetchDashboardData(geocodedLoc.lat, geocodedLoc.lng);
        }
    };

    const handleUseCurrentLocation = async () => {
        const loc = await getCurrentLocation();
        setLocation(loc);
        fetchDashboardData(loc.lat, loc.lng);
    };

    const handleImageUpload = async (file) => {
        setIsAnalyzing(true);
        // Create object URL for preview
        const objectUrl = URL.createObjectURL(file);
        setUploadedImage(objectUrl);
        setSatelliteResult(null); // Clear previous

        try {
            const result = await analyzeSatelliteImage(file);
            setSatelliteResult(result);
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGenerateReport = async () => {
        try {
            if (riskData) {
                await saveRiskAssessmentToHistory({
                    coordinates: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
                    riskLevel: riskData.riskLevel,
                    location: 'Analyzed Target Zone',
                });
            }
        } catch (error) {
            console.error("Failed to save report to history", error);
        }
    };

    if (loading && !riskData) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center text-emerald-400 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin spinner-glow" />
                <div className="text-xl font-bold font-['Outfit'] animate-pulse">Initializing AI Models...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 fade-in-page">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-white/10 pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-white font-['Outfit'] mb-1">Live Radar Console</h2>
                    <p className="text-slate-400">Monitoring real-time coordinates and associated risk factors</p>
                </div>
            </div>

            {/* Row 1: Risk Summary Cards */}
            <RiskCards riskData={riskData} />

            {/* Row 2: Main Monitoring Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Map */}
                <div className="col-span-2">
                    <MapView
                        lat={location.lat}
                        lng={location.lng}
                        onMapClick={handleLocationSelect}
                        weatherCondition={weather?.condition}
                        riskData={riskData}
                    />
                </div>

                {/* Right: Control Panel */}
                <div className="space-y-6 slide-up delay-100">
                    <LocationSelector
                        onSearch={handleSearch}
                        onUseCurrentLocation={handleUseCurrentLocation}
                        isLoading={loading}
                        currentLat={location.lat}
                        currentLng={location.lng}
                    />
                    <WeatherPanel weather={weather} />
                    <WeatherAlert alert={weatherAlert} />
                </div>
            </div>

            {/* Row 3: Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 slide-up delay-200">
                <RiskGauge value={riskData.overallRisk} />
                <div className="lg:col-span-2">
                    <RiskTrendChart data={riskData.trend} />
                </div>
                <div className="flex flex-col gap-6 h-full">
                    <div className="flex-1">
                        <HistoricalProximityCard analysis={historicalProximity} />
                    </div>
                    <ReportGenerator onGenerate={handleGenerateReport} />
                </div>
            </div>

            {/* Row extra: Risk Factors */}
            <div className="grid grid-cols-1 slide-up delay-300">
                <RiskFactors factors={riskData.factors} />
            </div>

            {/* Row 4: Satellite Analysis */}
            <div className="glass-panel p-6 rounded-2xl border-white/10 slide-up delay-300">
                <h3 className="text-xl font-bold text-white mb-6 font-['Outfit'] flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    Satellite Image Analysis
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <SatelliteUpload onUpload={handleImageUpload} isAnalyzing={isAnalyzing} />
                    {isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center h-64 text-emerald-400 skeleton-shimmer rounded-xl border border-emerald-500/20">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <span className="font-medium animate-pulse">Running Neural Networks...</span>
                        </div>
                    ) : (
                        <ImageResult result={satelliteResult} imageUrl={uploadedImage} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
