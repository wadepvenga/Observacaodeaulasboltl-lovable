import React, { useState } from 'react';
import { setApiKey, testConnection } from '../services/gemini';
import { logger } from '../services/logger';

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit }) => {
  const [apiKey, setApiKeyState] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }
    setError(null);
    setTesting(true);
    setAvailableModels([]);

    try {
      setApiKey(apiKey);
      const result = await testConnection();
      logger.info('Connection test result', result);
      setAvailableModels(result.availableModels || []);
      onSubmit(apiKey);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate API key';
      setError(errorMessage);
      logger.error('API key validation failed', { error: errorMessage });
      
      // Clear the API key input if it's expired or invalid
      if (errorMessage.includes('expired') || errorMessage.includes('Invalid API key')) {
        setApiKeyState('');
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">How to get your API key:</h3>
        <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
          <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
          <li>Log in with your Google account</li>
          <li>Click "Get API key" in the top right</li>
          <li>Create a new key or use an existing one</li>
          <li>Copy the API key and paste it below</li>
        </ol>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKeyState(e.target.value);
              setError(null);
            }}
            placeholder="Enter your Gemini API key"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          {error?.includes('expired') && (
            <p className="mt-2 text-sm text-blue-600">
              Visit the <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a> to renew your API key.
            </p>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          disabled={!apiKey.trim() || testing}
        >
          {testing ? 'Testing Connection...' : 'Save & Test API Key'}
        </button>
      </form>
      
      {availableModels.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">Available Models:</h3>
          <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
            {availableModels.map((model, index) => (
              <li key={index}>{model}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};