import React, { useState, useEffect } from 'react';
import { BookOpen, User, Calendar, ExternalLink, Search, Filter, TrendingUp, Eye, Heart } from 'lucide-react';
import { localStoryService, Story } from '../lib/localStoryService';

const StoryLibraryPage = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('');

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    try {
      const fetchedStories = await localStoryService.getAllStories();
      setStories(fetchedStories);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || story.genre === selectedGenre;
    const matchesAudience = !selectedAudience || story.audience === selectedAudience;
    
    return matchesSearch && matchesGenre && matchesAudience;
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGenreColor = (genre: string) => {
    const colors: { [key: string]: string } = {
      fantasy: 'bg-purple-100 text-purple-800',
      'sci-fi': 'bg-blue-100 text-blue-800',
      romance: 'bg-pink-100 text-pink-800',
      mystery: 'bg-gray-100 text-gray-800',
      thriller: 'bg-red-100 text-red-800',
      horror: 'bg-orange-100 text-orange-800',
      literary: 'bg-green-100 text-green-800',
      other: 'bg-yellow-100 text-yellow-800'
    };
    return colors[genre] || 'bg-gray-100 text-gray-800';
  };

  const genres = ['fantasy', 'sci-fi', 'romance', 'mystery', 'thriller', 'horror', 'literary', 'other'];
  const audiences = ['young-adult', 'adult', 'teen', 'all-ages'];

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Story Library</h1>
              <p className="text-gray-600">Discover and support amazing stories from talented creators</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Total Stories</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stories.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Active Creators</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {new Set(stories.map(s => s.creator_address)).size}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Genres Available</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {new Set(stories.map(s => s.genre).filter(Boolean)).size}
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search stories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>
                      {genre.charAt(0).toUpperCase() + genre.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Audiences</option>
                  {audiences.map(audience => (
                    <option key={audience} value={audience}>
                      {audience.charAt(0).toUpperCase() + audience.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {stories.length === 0 ? 'No Stories Yet' : 'No Stories Found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {stories.length === 0 
                ? 'Be the first to mint a story and share it with the world!'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {stories.length === 0 && (
              <button 
                onClick={() => window.location.href = '/create-story'}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Create Your First Story
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div key={story.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Story Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {story.title}
                    </h3>
                    {story.genre && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGenreColor(story.genre)}`}>
                        {story.genre.charAt(0).toUpperCase() + story.genre.slice(1)}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {story.description}
                  </p>

                  {/* Creator Info */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatAddress(story.creator_address)}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(story.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Token Info */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Token:</span>
                        <span className="font-medium text-gray-900 ml-1">{story.token_symbol}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Supply:</span>
                        <span className="font-medium text-gray-900 ml-1">{story.token_supply}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Price:</span>
                        <span className="font-medium text-gray-900 ml-1">{story.initial_price} ETH</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium">
                      <Heart className="w-4 h-4 inline mr-1" />
                      Support Creator
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <a
                      href={`https://sepolia.basescan.org/tx/${story.transaction_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Local Storage Info */}
        {stories.length === 0 && (
          <div className="mt-8 bg-green-50 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-2">💾 Local Storage</h3>
            <div className="text-sm text-green-800 space-y-2">
              <p>Stories are stored locally in your browser using localStorage:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Data persists between browser sessions</li>
                <li>Stories are only visible on this device/browser</li>
                <li>Clear browser data will remove all stories</li>
                <li>Clear browser data will remove all stories</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryLibraryPage;