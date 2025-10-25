
import React, { useState, useCallback } from 'react';
import { runGenericTask } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const GeminiTask: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [task, setTask] = useState('summarize');
    const [model, setModel] = useState<'gemini-2.5-pro' | 'gemini-2.5-flash'>('gemini-2.5-flash');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const taskPrompts: { [key: string]: string } = {
        summarize: "Summarize the following text concisely:",
        proofread: "Proofread the following text for grammar and spelling errors, providing a corrected version:",
        keywords: "Extract the main keywords from the following text, providing a comma-separated list:",
        eli5: "Explain the following text like I'm 5 years old:",
    };

    const handleGenerate = useCallback(async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to analyze.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult('');

        const fullPrompt = `${taskPrompts[task]}\n\n---\n\n${inputText}`;

        try {
            const response = await runGenericTask(fullPrompt, model);
            setResult(response);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [inputText, task, model, taskPrompts]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-blue-400 mb-2">Content Analysis & Editing</h2>
                <p className="text-gray-400">Use Gemini to analyze, summarize, or edit your text. Choose a task and a model that fits your needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="task" className="block text-sm font-medium text-gray-300 mb-1">Task</label>
                    <select
                        id="task"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="summarize">Summarize</option>
                        <option value="proofread">Proofread</option>
                        <option value="keywords">Extract Keywords</option>
                        <option value="eli5">Explain Like I'm 5</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-1">Model</label>
                    <select
                        id="model"
                        value={model}
                        onChange={(e) => setModel(e.target.value as 'gemini-2.5-pro' | 'gemini-2.5-flash')}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="gemini-2.5-flash">Gemini Flash (Faster)</option>
                        <option value="gemini-2.5-pro">Gemini Pro (More Complex Tasks)</option>
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="inputText" className="block text-sm font-medium text-gray-300 mb-1">Your Text</label>
                <textarea
                    id="inputText"
                    rows={8}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                    placeholder="Paste your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
            </div>
            
            <div className="flex justify-center">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full md:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isLoading ? <LoadingSpinner /> : 'Generate'}
                </button>
            </div>

            {error && <p className="text-red-400 text-center">{error}</p>}

            {result && (
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">Result</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{result}</p>
                </div>
            )}
        </div>
    );
};

export default GeminiTask;
