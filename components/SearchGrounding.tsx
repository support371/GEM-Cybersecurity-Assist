
import React, { useState, useCallback } from 'react';
import { runSearchQuery } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import SourceLink from './SourceLink';
import type { GeminiResponse } from '../types';

const SearchGrounding: React.FC = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<GeminiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = useCallback(async () => {
        if (!query.trim()) {
            setError('Please enter a question.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult(null);
        
        try {
            const response = await runSearchQuery(query);
            setResult(response);
        } catch (err: any) {
             setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [query]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-green-400 mb-2">Search Grounding</h2>
                <p className="text-gray-400">Ask a question about recent events or up-to-date topics. Gemini will use Google Search to provide an accurate, current answer.</p>
            </div>
            
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
                    placeholder="e.g., Who won the latest F1 race?"
                    className="flex-grow bg-gray-800 border border-gray-600 rounded-md p-3 focus:ring-green-500 focus:border-green-500 placeholder-gray-500"
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isLoading ? <LoadingSpinner /> : 'Ask'}
                </button>
            </div>

            {error && <p className="text-red-400 text-center">{error}</p>}
            
            {result && (
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-green-300 mb-2">Answer</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{result.text}</p>
                    </div>
                    {result.sources.length > 0 && (
                        <div>
                            <h3 className="text-md font-semibold text-gray-400 mb-2">Sources</h3>
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

export default SearchGrounding;
