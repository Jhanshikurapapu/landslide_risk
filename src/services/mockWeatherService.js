// Real-time API via Open-Meteo (No API Key required)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getWeatherData = async (lat, lng) => {
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat || 34.05}&longitude=${lng || -118.25}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`);
        
        if (!res.ok) {
            throw new Error("Failed to fetch weather. Using fallback.");
        }
        
        const data = await res.json();
        const current = data.current_weather;
        const temp = Math.round(current.temperature);
        const windSpeed = Math.round(current.windspeed);
        
        // WMO Weather interpretation codes
        let condition = 'Sunny';
        const code = current.weathercode;
        if (code >= 95) condition = 'Storm';
        else if (code >= 61) condition = 'Heavy Rain';
        else if (code >= 51) condition = 'Rain';
        else if (code >= 1) condition = 'Cloudy';

        // Getting current humidity from hourly data (first value approx)
        const humidity = data.hourly?.relative_humidity_2m?.[0] || 50;

        return {
            temperature: temp,
            humidity: humidity,
            windSpeed: windSpeed,
            condition: condition,
            forecast: [
                { day: 'Today', rainfall: data.hourly?.precipitation?.[12] || 0, temp: temp },
                { day: 'Tomorrow', rainfall: data.hourly?.precipitation?.[36] || 0, temp: temp - 2 },
                { day: 'Next', rainfall: data.hourly?.precipitation?.[60] || 0, temp: temp + 1 },
            ]
        };
    } catch(err) {
        // Fallback if offline/failed
        return {
            temperature: 25, humidity: 60, windSpeed: 10, condition: 'Cloudy',
            forecast: [ { day: 'Today', rainfall: 5, temp: 25 }, { day: 'Tomorrow', rainfall: 10, temp: 24 }, { day: 'Next', rainfall: 0, temp: 26 } ]
        };
    }
};

export const getWeatherAlerts = async (lat, lng) => {
    // Keep deterministic alert based on location for showcase purposes
    await delay(300);
    const hash = Math.abs(Math.sin((lat || 1) * (lng || 1))) * 100;

    if (hash > 80) {
        return {
            severity: 'red',
            message: 'Extreme severe storm warning! Imminent landslide risk in vulnerable topography. Execute evacuation protocols immediately.'
        };
    } else if (hash > 60) {
        return {
            severity: 'orange',
            message: 'Heavy rainfall expected within 24–48 hours. Soil saturation levels approaching critical threshold.'
        };
    } else if (hash > 40) {
        return {
            severity: 'yellow',
            message: 'Moderate rain warning. Ground conditions stable but monitor local updates.'
        };
    }
    
    return null; // No alerts
};
