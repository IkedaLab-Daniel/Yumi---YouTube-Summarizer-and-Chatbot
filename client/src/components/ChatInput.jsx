import { useState } from 'react';
import './ChatInput.css';

const ChatInput = ({ onSend, loading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter YouTube URL..."
        disabled={loading}
      />
      <button type="submit" disabled={loading || !input.trim()}>
        {loading ? 'Processing...' : 'Send'}
      </button>
    </form>
  );
};

export default ChatInput;
