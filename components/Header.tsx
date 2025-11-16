
import React from 'react';
import { User } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { ImageIcon } from './icons/ImageIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { HomeIcon } from './icons/HomeIcon';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  setView: (view: 'home' | 'search' | 'imageEdit') => void;
  currentView: 'home' | 'search' | 'imageEdit';
}

const NavButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {children}
  </button>
);


const Header: React.FC<HeaderProps> = ({ user, onLogout, setView, currentView }) => {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white cursor-pointer" onClick={() => setView('home')}>Gemini Suite</h1>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                 <NavButton onClick={() => setView('home')} isActive={currentView === 'home'}>
                    <HomeIcon />
                    <span>Home</span>
                </NavButton>
                <NavButton onClick={() => setView('search')} isActive={currentView === 'search'}>
                    <SearchIcon />
                    <span>Search</span>
                </NavButton>
                <NavButton onClick={() => setView('imageEdit')} isActive={currentView === 'imageEdit'}>
                    <ImageIcon />
                    <span>Image Editor</span>
                </NavButton>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-300 mr-4 hidden sm:block">Welcome, {user.username}</span>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            >
              <LogoutIcon />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
