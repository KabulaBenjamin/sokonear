// src/components/AIChat.tsx
import React, { useState } from 'react';
import axios from 'axios';

const AIChat: React.FC = () => {
  const [userMessage, setUserMessage] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!userMessage.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/ai/assistant', {
        prompt: userMessage,
      });
      setAssistantResponse(response.data.reply);
    } catch (err: any) {
      console.error('AI error:', err);
      setError('Failed to get response from AI assistant.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">AI Assistant</h2>
      <div className="mb-4">
        <textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Ask me anything..."
          className="w-full p-2 border rounded h-24"
        ></textarea>
      </div>
      <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? 'Asking...' : 'Ask'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {assistantResponse && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <p className="text-gray-700">{assistantResponse}</p>
        </div>
      )}
    </div>
  );
};

export default AIChat;