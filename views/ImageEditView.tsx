
import React, { useState, useRef, useCallback } from 'react';
import { editImage, fileToBase64 } from '../services/geminiService';
import Button from '../components/Button';
import Input from '../components/Input';
import Spinner from '../components/Spinner';

const ImageEditView: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setEditedImage(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleEdit = async () => {
    if (!file || !prompt) {
      setError('Please select an image and enter a prompt.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const base64Image = await fileToBase64(file);
      const resultImageUrl = await editImage(base64Image, file.type, prompt);
      setEditedImage(resultImageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const triggerFileSelect = useCallback(() => fileInputRef.current?.click(), []);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white mb-2">AI Image Editor</h2>
        <p className="text-center text-gray-400 mb-6">Upload an image and describe your desired changes.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Controls Column */}
          <div className="space-y-6">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <Button onClick={triggerFileSelect} variant="secondary" className="w-full">
              {originalImage ? 'Change Image' : 'Select an Image'}
            </Button>
            
            <Input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Add a retro filter"
              disabled={isLoading || !originalImage}
            />

            <Button onClick={handleEdit} disabled={isLoading || !originalImage || !prompt.trim()} className="w-full">
              {isLoading ? 'Generating...' : 'Apply Edit'}
            </Button>

            {error && <p className="text-red-500 bg-red-900/50 p-3 rounded-md text-center">{error}</p>}
          </div>

          {/* Image Display Column */}
          <div className="space-y-4">
             {!originalImage && (
                <div className="aspect-square w-full bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                    Your images will appear here
                </div>
             )}
             {originalImage && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-300">Original</h3>
                  <img src={originalImage} alt="Original" className="rounded-lg shadow-md w-full object-contain" />
                </div>
             )}
            {isLoading && (
                 <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Edited</h3>
                    <div className="aspect-square w-full bg-gray-700 rounded-lg flex items-center justify-center">
                        <Spinner />
                    </div>
                </div>
            )}
            {editedImage && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Edited</h3>
                <img src={editedImage} alt="Edited" className="rounded-lg shadow-md w-full object-contain" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditView;
