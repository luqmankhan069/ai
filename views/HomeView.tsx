
import React from 'react';
import { SearchIcon } from '../components/icons/SearchIcon';
import { ImageIcon } from '../components/icons/ImageIcon';

interface HomeViewProps {
  setView: (view: 'search' | 'imageEdit') => void;
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-blue-500/50 hover:bg-gray-700 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
  >
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0 bg-blue-600 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  </div>
);

const HomeView: React.FC<HomeViewProps> = ({ setView }) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">Welcome to the Gemini Creative Suite</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          Leverage the power of Gemini for cutting-edge search and image creation. Choose a tool below to get started.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <FeatureCard
          title="Grounded Search"
          description="Ask complex questions and get up-to-date, accurate answers grounded in Google Search."
          icon={<SearchIcon />}
          onClick={() => setView('search')}
        />
        <FeatureCard
          title="AI Image Editor"
          description="Upload an image and use simple text prompts to perform powerful AI-driven edits."
          icon={<ImageIcon />}
          onClick={() => setView('imageEdit')}
        />
      </div>
    </div>
  );
};

export default HomeView;
