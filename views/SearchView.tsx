
import React, { useState } from 'react';
import { searchWithGoogle } from '../services/geminiService';
import { GroundingMetadata } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Spinner from '../components/Spinner';

const SearchView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<GroundingMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setMetadata(null);

    try {
      const { text, metadata } = await searchWithGoogle(prompt);
      setResult(text);
      setMetadata(metadata);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white mb-2">Grounded Search</h2>
        <p className="text-center text-gray-400 mb-6">Get up-to-date answers from Gemini, grounded in Google Search.</p>
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Who won the latest F1 race?"
            className="flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !prompt.trim()}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>

        {isLoading && <div className="mt-8"><Spinner /></div>}
        
        {error && <p className="mt-6 text-red-500 bg-red-900/50 p-3 rounded-md text-center">{error}</p>}

        {result && (
          <div className="mt-8 p-6 bg-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">Result:</h3>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap">{result}</div>
            
            {metadata && metadata.groundingChunks.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-300 mb-2">Sources:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {metadata.groundingChunks.map((chunk, index) =>
                    chunk.web ? (
                      <li key={index}>
                        <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          {chunk.web.title || chunk.web.uri}
                        </a>
                      </li>
                    ) : null
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;
