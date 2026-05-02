// Simulating API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getRiskAnalysis = async (lat, lng) => {
    await delay(800); // Simulate network latency

    // Deterministic pseudo-random based on coordinates
    // We use a fallback of 0 just in case lat/lng are undefined
    const safeLat = lat || 0;
    const safeLng = lng || 0;
    const seed = Math.abs(safeLat * 100 + safeLng * 100);
    const modValue = seed % 100;
    
    // Higher modValue -> higher risk.
    const isHighRisk = modValue > 75;
    const isWatch = modValue > 40 && !isHighRisk;

    let overallRisk = isHighRisk ? 75 + (modValue % 20) : (isWatch ? 40 + (modValue % 30) : 10 + (modValue % 25));
    let riskLevel = isHighRisk ? 'High Alert' : (isWatch ? 'Watch' : 'Safe');
    let envScore = isHighRisk ? 20 + (modValue % 20) : (isWatch ? 50 + (modValue % 20) : 75 + (modValue % 20));

    return {
        overallRisk: Math.floor(overallRisk),
        riskLevel: riskLevel,
        environmentalScore: Math.floor(envScore), // Lower is worse
        proximityScore: Math.floor(isHighRisk ? 80 + (modValue%15) : 30 + (modValue%20)), // Higher is worse
        weatherScore: Math.floor(isHighRisk ? 75 + (modValue%20) : 40 + (modValue%30)), // Higher is worse (more rain)
        trend: [
            { day: 'Mon', risk: overallRisk - 15, historicalAvg: overallRisk - 10 },
            { day: 'Tue', risk: overallRisk - 10, historicalAvg: overallRisk - 12 },
            { day: 'Wed', risk: overallRisk - 5, historicalAvg: overallRisk - 8 },
            { day: 'Thu', risk: overallRisk, historicalAvg: overallRisk - 5 },
            { day: 'Fri', risk: overallRisk + 5, historicalAvg: overallRisk - 5 },
            { day: 'Sat', risk: overallRisk + 8, historicalAvg: overallRisk - 4 },
            { day: 'Sun', risk: overallRisk + 10, historicalAvg: overallRisk - 2 },
        ].map(t => ({ 
            day: t.day, 
            risk: Math.min(100, Math.max(0, Math.floor(t.risk))),
            historicalAvg: Math.min(100, Math.max(0, Math.floor(t.historicalAvg)))
        })),
        factors: {
            rainfallIntensity: isHighRisk ? 85 : (isWatch ? 50 : 20),
            slopeAngle: Math.floor(30 + (modValue % 50)),
            vegetation: isHighRisk ? 25 : (isWatch ? 55 : 85),
            soilMoisture: isHighRisk ? 88 : (isWatch ? 60 : 35),
            temperature: Math.floor(15 + (modValue % 20)),
            windSpeed: Math.floor(10 + (modValue % 40))
        }
    };
};

let historyDB = [
    { id: 101, date: '2023-10-25', coordinates: '34.05, -118.25', riskLevel: 'High Alert', location: 'Santa Monica Mountains' },
    { id: 102, date: '2023-10-24', coordinates: '34.02, -118.40', riskLevel: 'Watch', location: 'Beverly Hills' },
    { id: 103, date: '2023-10-23', coordinates: '33.98, -118.30', riskLevel: 'Safe', location: 'Culver City' },
    { id: 104, date: '2023-10-22', coordinates: '34.10, -118.15', riskLevel: 'Warning', location: 'Pasadena' },
    { id: 105, date: '2023-10-21', coordinates: '34.08, -118.35', riskLevel: 'Safe', location: 'West Hollywood' },
];

export const getRiskAssessmentHistory = async () => {
    await delay(500);
    return [...historyDB].sort((a, b) => b.id - a.id);
};

export const saveRiskAssessmentToHistory = async (record) => {
    await delay(200);
    const newRecord = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...record
    };
    historyDB.push(newRecord);
    return newRecord;
};
