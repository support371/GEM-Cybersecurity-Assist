
import React, { useState } from 'react';
import GeminiTask from './components/GeminiTask';
import SearchGrounding from './components/SearchGrounding';
import MapsGrounding from './components/MapsGrounding';

type ActiveView = 'gemini' | 'search' | 'maps';

// Helper component defined outside App to prevent re-renders
const TabButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  activeClass: string;
}> = ({ label, isActive, onClick, activeClass }) => {
  const baseClasses = "px-4 py-2 font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none";
  const inactiveClasses = "text-gray-400 hover:bg-gray-700";
  const activeClasses = `text-white ${activeClass}`;

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {label}
    </button>
  );
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('gemini');

  const renderActiveView = () => {
    switch (activeView) {
      case 'gemini':
        return <GeminiTask />;
      case 'search':
        return <SearchGrounding />;
      case 'maps':
        return <MapsGrounding />;
      default:
        return <GeminiTask />;
    }
  };

  const activeColorClasses = {
      gemini: 'bg-blue-600',
      search: 'bg-green-600',
      maps: 'bg-yellow-600'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400">
              Gemini AI Multi-Tool
            </span>
          </h1>
          <p className="text-gray-400 mt-2">Explore the power of Generative AI with grounded, real-time information.</p>
        </header>

        <main>
          <div className="border-b border-gray-700 flex space-x-2">
            <TabButton 
                label="Content Analysis" 
                isActive={activeView === 'gemini'} 
                onClick={() => setActiveView('gemini')} 
                activeClass={activeColorClasses.gemini}
            />
            <TabButton 
                label="Search Grounding" 
                isActive={activeView === 'search'} 
                onClick={() => setActiveView('search')} 
                activeClass={activeColorClasses.search}
            />
            <TabButton 
                label="Maps Grounding" 
                isActive={activeView === 'maps'} 
                onClick={() => setActiveView('maps')} 
                activeClass={activeColorClasses.maps}
            />
          </div>

          <div className={`p-6 bg-gray-800 rounded-b-lg rounded-r-lg border-t-4 ${
              activeView === 'gemini' ? 'border-blue-600' :
              activeView === 'search' ? 'border-green-600' :
              'border-yellow-600'
          }`}>
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
