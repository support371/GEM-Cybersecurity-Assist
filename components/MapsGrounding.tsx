
import React, { useState, useEffect, useCallback } from 'react';
import { runMapsQuery } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import SourceLink from './SourceLink';
import type { GeminiResponse } from '../types';

interface Location {
    latitude: number;
    longitude: number;
}

const MapsGrounding: React.FC = () => {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState<Location | null>(null);
    const [result, setResult] = useState<GeminiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [locationStatus, setLocationStatus] = useState('Fetching location...');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setLocationStatus('Location acquired successfully.');
                },
                (err) => {
                    setError('Could not get location. Please enable location permissions in your browser.');
                    setLocationStatus('Location access denied.');
                    console.error(err);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            setLocationStatus('Geolocation not supported.');
        }
    }, []);

    const handleSearch = useCallback(async () => {
        if (!query.trim()) {
            setError('Please enter a question.');
            return;
        }
        if (!location) {
            setError('Cannot search without your location. Please grant permission and refresh.');
            return;
        }

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await runMapsQuery(query, location);
            setResult(response);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [query, location]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">Maps Grounding</h2>
                <p className="text-gray-400">Find places and get information grounded in Google Maps data. Your current location is used to provide relevant results.</p>
                <p className="text-xs text-gray-500 mt-1">{locationStatus}</p>
            </div>
            
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
                    placeholder="e.g., Good coffee shops near me"
                    className="flex-grow bg-gray-800 border border-gray-600 rounded-md p-3 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-500"
                    disabled={!location}
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading || !location}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isLoading ? <LoadingSpinner /> : 'Find'}
                </button>
            </div>

            {error && <p className="text-red-400 text-center">{error}</p>}
            
            {result && (
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-yellow-300 mb-2">Results</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{result.text}</p>
                    </div>
                    {result.sources.length > 0 && (
                        <div>
                            <h3 className="text-md font-semibold text-gray-400 mb-2">Places & Sources</h3>
                            <div className="space-y-2">
                                {result.sources.map((source, index) => (
                                    <SourceLink key={index} source={source} index={index} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MapsGrounding;
