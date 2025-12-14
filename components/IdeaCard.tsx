import React from 'react';
import { Idea } from '../types';
import { Tag } from './UIComponents';
import { ChevronRight, Sparkles } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
  onClick: (idea: Idea) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onClick }) => {
  return (
    <div 
      onClick={() => onClick(idea)}
      className="bg-ios-card p-4 rounded-[20px] shadow-ios-card mb-4 active:bg-gray-50 transition-colors cursor-pointer border border-gray-100 relative overflow-hidden"
    >
      {idea.aiGenerated && (
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Sparkles className="w-12 h-12 text-ios-blue" />
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <h3 className="font-semibold text-lg text-gray-900 leading-tight mb-1">{idea.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
            {idea.description}
          </p>
          <div className="flex flex-wrap gap-y-2">
            {idea.tags.map((tag, idx) => (
              <Tag key={idx} text={tag} />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-full text-gray-300 pt-2">
          <ChevronRight size={20} />
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-400 font-medium">
          by {idea.author}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(idea.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default IdeaCard;
