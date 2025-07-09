import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import WalletOptionsModal from './components/WalletOptionsModal';
import HomePage from './pages/HomePage';
import CreateStoryPage from './pages/CreateStoryPage';
import StoryLibraryPage from './pages/StoryLibraryPage';

function App() {
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header setShowWalletOptions={setShowWalletOptions} />
      <Routes>
        <Route path="/" element={<HomePage setShowWalletOptions={setShowWalletOptions} />} />
        <Route path="/create-story" element={<CreateStoryPage />} />
        <Route path="/stories" element={<StoryLibraryPage />} />
      </Routes>
      <WalletOptionsModal 
        isOpen={showWalletOptions} 
        onClose={() => setShowWalletOptions(false)} 
      />
    </div>
  );
}

export default App;