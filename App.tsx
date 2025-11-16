
import React, { useState, useCallback } from 'react';
import AuthView from './views/AuthView';
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import ImageEditView from './views/ImageEditView';
import Header from './components/Header';
import { User } from './types';

type View = 'home' | 'search' | 'imageEdit';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');

  const handleLogin = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('home');
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setCurrentView('home');
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'search':
        return <SearchView />;
      case 'imageEdit':
        return <ImageEditView />;
      case 'home':
      default:
        return <HomeView setView={setCurrentView} />;
    }
  };

  if (!user) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header user={user} onLogout={handleLogout} setView={setCurrentView} currentView={currentView} />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
