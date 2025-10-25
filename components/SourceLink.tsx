
import React from 'react';
import type { GroundingChunk } from '../types';

interface SourceLinkProps {
  source: GroundingChunk;
  index: number;
}

const SourceLink: React.FC<SourceLinkProps> = ({ source, index }) => {
  const linkData = source.web || source.maps;
  const reviewSnippets = source.maps?.placeAnswerSources?.[0]?.reviewSnippets || [];

  if (!linkData) return null;

  return (
    <div className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200">
        <a
            href={linkData.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3"
        >
            <span className="flex-shrink-0 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
            <span className="text-blue-400 hover:underline truncate">{linkData.title}</span>
        </a>
        {reviewSnippets.length > 0 && (
            <div className="mt-2 pl-9 space-y-2">
                {reviewSnippets.map((snippet, sIndex) => (
                    <div key={sIndex} className="text-sm text-gray-400 border-l-2 border-gray-600 pl-3">
                        <p className="italic">"{snippet.text}"</p>
                        <a href={snippet.uri} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs hover:underline mt-1 block">
                            Read review
                        </a>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export default SourceLink;
