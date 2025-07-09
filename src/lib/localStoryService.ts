// Local story service using localStorage to simulate database storage
export interface Story {
  id: string;
  title: string;
  description: string;
  content: string;
  genre: string;
  audience: string;
  creator_address: string;
  transaction_hash: string;
  token_address?: string;
  token_symbol: string;
  token_supply: string;
  initial_price: string;
  created_at: string;
  updated_at: string;
}

export interface StoryInsert {
  title: string;
  description: string;
  content: string;
  genre: string;
  audience: string;
  creator_address: string;
  transaction_hash: string;
  token_address?: string;
  token_symbol: string;
  token_supply: string;
  initial_price: string;
}

const STORAGE_KEY = 'ridmint_stories';

// Helper function to load stories from localStorage
const loadStoriesFromStorage = (): Story[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading stories from localStorage:', error);
    return [];
  }
};

// Helper function to save stories to localStorage
const saveStoriesToStorage = (stories: Story[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  } catch (error) {
    console.error('Error saving stories to localStorage:', error);
  }
};

// Generate a unique ID for new stories
const generateId = (): string => {
  return crypto.randomUUID();
};

// Local story service
export const localStoryService = {
  // Insert a new story after minting
  async createStory(storyData: StoryInsert): Promise<Story | null> {
    try {
      const stories = loadStoriesFromStorage();
      
      const newStory: Story = {
        id: generateId(),
        ...storyData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      stories.push(newStory);
      saveStoriesToStorage(stories);

      console.log('Story saved to localStorage:', newStory);
      return newStory;
    } catch (error) {
      console.error('Error creating story:', error);
      return null;
    }
  },

  // Get all stories for the library
  async getAllStories(): Promise<Story[]> {
    try {
      const stories = loadStoriesFromStorage();
      // Sort by created_at in descending order (newest first)
      return stories.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
  },

  // Get stories by creator
  async getStoriesByCreator(creatorAddress: string): Promise<Story[]> {
    try {
      const stories = loadStoriesFromStorage();
      const creatorStories = stories.filter(story => 
        story.creator_address.toLowerCase() === creatorAddress.toLowerCase()
      );
      // Sort by created_at in descending order (newest first)
      return creatorStories.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error) {
      console.error('Error fetching creator stories:', error);
      return [];
    }
  },

  // Get a single story by ID
  async getStoryById(id: string): Promise<Story | null> {
    try {
      const stories = loadStoriesFromStorage();
      const story = stories.find(story => story.id === id);
      return story || null;
    } catch (error) {
      console.error('Error fetching story:', error);
      return null;
    }
  },

  // Update story with token address after deployment
  async updateStoryTokenAddress(transactionHash: string, tokenAddress: string): Promise<boolean> {
    try {
      const stories = loadStoriesFromStorage();
      const storyIndex = stories.findIndex(story => story.transaction_hash === transactionHash);
      
      if (storyIndex === -1) {
        console.warn('Story not found for transaction hash:', transactionHash);
        return false;
      }

      stories[storyIndex].token_address = tokenAddress;
      stories[storyIndex].updated_at = new Date().toISOString();
      
      saveStoriesToStorage(stories);
      console.log('Story token address updated:', stories[storyIndex]);
      return true;
    } catch (error) {
      console.error('Error updating story token address:', error);
      return false;
    }
  },

  // Clear all stories (useful for development/testing)
  async clearAllStories(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('All stories cleared from localStorage');
    } catch (error) {
      console.error('Error clearing stories:', error);
    }
  },

  // Get storage statistics
  getStorageStats(): { totalStories: number, storageSize: string } {
    try {
      const stories = loadStoriesFromStorage();
      const storageData = localStorage.getItem(STORAGE_KEY) || '';
      const sizeInBytes = new Blob([storageData]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      
      return {
        totalStories: stories.length,
        storageSize: `${sizeInKB} KB`
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return { totalStories: 0, storageSize: '0 KB' };
    }
  }
};