const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const searchLocations = async (query) => {
    if (!query) return [];
    
    try {
        // Try Nominatim first (Good for addresses, POIs, and specific locations)
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1&email=support@landsliderisk.com`, {
            headers: { 'Accept-Language': 'en-US,en;q=0.9' }
        });
        const data = await res.json();
        
        if (data && data.length > 0) {
            return data.map(place => ({
                place_id: place.place_id,
                lat: place.lat,
                lon: place.lon,
                display_name: place.display_name
            }));
        }

        // Fallback to Open-Meteo (Excellent for cities and towns)
        const fallbackRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`);
        const fallbackData = await fallbackRes.json();
        
        if (fallbackData.results && fallbackData.results.length > 0) {
            return fallbackData.results.map(place => ({
                place_id: place.id.toString(),
                lat: place.latitude.toString(),
                lon: place.longitude.toString(),
                display_name: `${place.name}${place.admin1 ? `, ${place.admin1}` : ''}${place.country ? `, ${place.country}` : ''}`
            }));
        }
        
        return [];
    } catch (error) {
        console.error("Geocoding failed", error);
        return [];
    }
};

export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            console.warn("Geolocation not supported. Using fallback.");
            resolve({ lat: 34.05, lng: -118.25 }); // Default LA
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({ 
                    lat: position.coords.latitude, 
                    lng: position.coords.longitude 
                });
            },
            (error) => {
                console.warn("Geolocation permission denied or failed. Using fallback.", error);
                resolve({ lat: 34.05, lng: -118.25 });
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    });
};
