import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, BookOpen, Sparkles, Save, Eye, Share2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { createCoin } from '@zoralabs/coins-sdk';
import { parseEther } from 'viem';
import { localStoryService } from '../lib/localStoryService';

const CreateStoryPage = () => {
  const navigate = useNavigate();
  const { address, isConnected, chain } = useAccount();
  const { sendTransaction, data: hash, isPending: isSendPending, error: sendError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({ hash });
  const { switchChain } = useSwitchChain();

  // Form state
  const [storyTitle, setStoryTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [audience, setAudience] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tokenSupply, setTokenSupply] = useState('1000');
  const [initialPrice, setInitialPrice] = useState('0.01');
  const [tokenSymbol, setTokenSymbol] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auto-generate token symbol from title
  const handleTitleChange = (value: string) => {
    setStoryTitle(value);
    // Generate symbol from title (first 3-5 characters, uppercase, alphanumeric only)
    const symbol = value
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 5)
      .toUpperCase();
    setTokenSymbol(symbol);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', {
      storyTitle,
      description,
      content,
      tokenSupply,
      initialPrice,
      tokenSymbol
    });
    
    if (!address || !storyTitle || !description || !content) {
      setSubmitError('Please fill in all required fields');
      return;
    }

    // Check if we're on the correct network
    if (chain?.id !== baseSepolia.id) {
      try {
        await switchChain({ chainId: baseSepolia.id });
        // Return early to prevent createCoin from executing on wrong network
        // User will need to re-submit after network switch is complete
        setIsSubmitting(false);
        return;
        // Return early to prevent createCoin from executing on wrong network
        // User will need to re-submit after network switch is complete
        setIsSubmitting(false);
        return;
      } catch (error) {
        setSubmitError('Please switch to Base Sepolia network');
        setIsSubmitting(false);
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare the createCoin parameters
      const coinParams = {
        tokenName: storyTitle,
        tokenSymbol: tokenSymbol || 'STORY',
        maxSupply: BigInt(tokenSupply || '1000'),
        mintPrice: parseEther(initialPrice),
        royaltyBps: 500, // 5% royalty
        fundsRecipient: address,
        publicSaleStart: 0n, // Start immediately
        chainId: baseSepolia.id,
      };

      console.log('Creating coin with params:', coinParams);

      // Create the coin using Zora SDK
      const coinTransaction = await createCoin(coinParams);

      console.log('Coin transaction prepared:', coinTransaction);

      // Execute the transaction using sendTransaction
      sendTransaction(coinTransaction);

    } catch (error) {
      console.error('Error creating coin:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to create story token');
      setIsSubmitting(false);
    }
  };

  // Reset form after successful transaction
  useEffect(() => {
    if (isConfirmed) {
      console.log('Story minted successfully!');
      console.log('Story minted successfully!');
      // Save story to database after successful minting
      saveStoryToDatabase(receipt);
      setIsSubmitting(false);
    }
  }, [isConfirmed, receipt]);

  const saveStoryToDatabase = async (transactionReceipt?: any) => {
    if (!hash || !address) return;

    try {
      const storyData = {
        title: storyTitle,
        description,
        content,
        genre: genre || '',
        audience: audience || '',
        creator_address: address,
        transaction_hash: hash,
        token_symbol: tokenSymbol || 'STORY',
        token_supply: tokenSupply,
        initial_price: initialPrice,
      };

      const savedStory = await localStoryService.createStory(storyData);
      
      if (savedStory) {
        console.log('Story saved to localStorage:', savedStory);
        
        // If we have a transaction receipt with contract address, update the story
        if (transactionReceipt?.contractAddress) {
          const updated = await localStoryService.updateStoryTokenAddress(
            hash, 
            transactionReceipt.contractAddress
          );
          if (updated) {
            console.log('Story token address updated:', transactionReceipt.contractAddress);
          }
        }
        
        // Navigate to library after successful save
        setTimeout(() => {
          console.log('Redirecting to Library page...');
          navigate('/stories');
        }, 2000); // Wait 2 seconds to show success message
        
        // If we have a transaction receipt with contract address, update the story
        if (transactionReceipt?.contractAddress) {
          const updated = await localStoryService.updateStoryTokenAddress(
            hash, 
            transactionReceipt.contractAddress
          );
          if (updated) {
            console.log('Story token address updated:', transactionReceipt.contractAddress);
          }
        }
        
        // Navigate to library after successful save
        setTimeout(() => {
          console.log('Redirecting to Library page...');
          navigate('/stories');
        }, 2000); // Wait 2 seconds to show success message
      } else {
        console.warn('Failed to save story to localStorage');
      }
    } catch (error) {
      console.error('Error saving story to localStorage:', error);
    }
  };

  // Handle send errors
  useEffect(() => {
    if (sendError) {
      setSubmitError(sendError.message);
      setIsSubmitting(false);
    }
  }, [sendError]);

  const isProcessing = isSubmitting || isSendPending || isConfirming;

  if (!isConnected) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600">Please connect your wallet to create stories.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Your Story</h1>
              <p className="text-gray-600">Transform your creativity into a valuable digital asset</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Connected as:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-medium">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Network:</span>
              <span className={`px-2 py-1 rounded font-medium ${
                chain?.id === baseSepolia.id 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {chain?.name || 'Unknown'}
              </span>
              {chain?.id !== baseSepolia.id && (
                <button
                  onClick={() => switchChain({ chainId: baseSepolia.id })}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Switch to Base Sepolia
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {isConfirmed && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Story Token Minted Successfully!</p>
                <p className="text-sm text-green-600">
                  Your story "{storyTitle}" has been minted as an ERC-20 token on Base Sepolia.
                </p>
                {hash && (
                  <a
                    href={`https://sepolia.basescan.org/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    View transaction on BaseScan
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Story Creation Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Form Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-900">Story Details</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    type="button"
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    Save Draft
                  </button>
                  <button 
                    type="button"
                    className="px-3 py-1 text-sm text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    Preview
                  </button>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title *
                </label>
                <input
                  type="text"
                  value={storyTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter your story title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Token Symbol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token Symbol
                </label>
                <input
                  type="text"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                  placeholder="STORY"
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-generated from title, or customize</p>
              </div>

              {/* Genre & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre
                  </label>
                  <select 
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select genre...</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="sci-fi">Science Fiction</option>
                    <option value="romance">Romance</option>
                    <option value="mystery">Mystery</option>
                    <option value="thriller">Thriller</option>
                    <option value="horror">Horror</option>
                    <option value="literary">Literary Fiction</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select 
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select audience...</option>
                    <option value="young-adult">Young Adult</option>
                    <option value="adult">Adult</option>
                    <option value="teen">Teen</option>
                    <option value="all-ages">All Ages</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Description *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a compelling description of your story..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              {/* Story Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Content *
                </label>
                <textarea
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your story here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none font-mono"
                  required
                />
              </div>

              {/* Token Settings */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Token Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Token Supply
                    </label>
                    <input
                      type="number"
                      value={tokenSupply}
                      onChange={(e) => setTokenSupply(e.target.value)}
                      placeholder="1000"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">Total number of tokens to mint</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Price (ETH)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={initialPrice}
                      onChange={(e) => setInitialPrice(e.target.value)}
                      placeholder="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">Price per token in ETH</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {isProcessing && (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {isSendPending && 'Preparing transaction...'}
                      {isConfirming && 'Confirming transaction...'}
                      {isSubmitting && 'Creating coin...'}
                    </span>
                  )}
                  {!isProcessing && (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Ready to mint
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    type="button"
                    className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Save Draft
                  </button>
                  <button 
                    type="submit"
                    disabled={isProcessing || !storyTitle || !description || !content}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={(e) => {
                      console.log('Button clicked');
                      // The form submission will be handled by the form's onSubmit
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 inline mr-2" />
                        Mint Story Token
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Success</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Write a compelling title that captures attention</li>
            <li>• Include a detailed description to help readers understand your story</li>
            <li>• Choose appropriate token supply and pricing for your audience</li>
            <li>• Make sure you're connected to Base Sepolia testnet</li>
            <li>• Proofread your content before minting</li>
          </ul>
        </div>

        {/* Network Info */}
        <div className="mt-4 bg-yellow-50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <div className="text-xs text-yellow-800">
              <p className="font-medium mb-1">Base Sepolia Testnet</p>
              <p>This is a testnet deployment. Tokens minted here have no real value and are for testing purposes only.</p>
              <p className="mt-1">Get testnet ETH from: <a href="https://www.alchemy.com/faucets/base-sepolia" target="_blank" rel="noopener noreferrer" className="underline">Base Sepolia Faucet</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryPage;