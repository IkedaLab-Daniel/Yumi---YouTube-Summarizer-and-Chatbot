import { useState } from 'react';
import './VideoInput.css';

const VideoInput = ({ onSubmit, loading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !loading) {
      onSubmit(url);
    }
  };

  return (
    <div className="video-input-container">
      <div className="video-input-content">
        <h1>YouTube RAG</h1>
        <p>Enter a YouTube URL to get started</p>
        
        <form onSubmit={handleSubmit} className="video-form">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            disabled={loading}
            className="video-input"
          />
          <button type="submit" disabled={loading || !url.trim()} className="submit-button">
            {loading ? 'Processing...' : 'Summarize'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoInput;
