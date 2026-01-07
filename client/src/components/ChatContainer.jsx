import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import './ChatContainer.css';

const ChatContainer = ({ messages, videoUrl }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="video-info">
        <p className="video-label">Video:</p>
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="video-link">
          {videoUrl}
        </a>
      </div>
      
      <div className="messages">
        {messages.map((message, index) => {
          if (message.type === 'summary') {
            return (
              <div key={index} className="summary-message">
                <div className="summary-header">
                  <strong>📝 Video Summary</strong>
                </div>
                <p>{message.content}</p>
              </div>
            );
          } else if (message.type === 'question') {
            return (
              <ChatMessage 
                key={index}
                message={{ content: message.content }} 
                type="user" 
              />
            );
          } else if (message.type === 'answer') {
            return (
              <ChatMessage 
                key={index}
                message={{ content: message.content }} 
                type="assistant" 
              />
            );
          }
          return null;
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;
