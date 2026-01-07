import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import './ChatContainer.css';

const ChatContainer = ({ chats }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  return (
    <div className="chat-container">
      {chats.length === 0 ? (
        <div className="empty-state">
          <h2>Hellor</h2>
        </div>
      ) : (
        <div className="messages">
          {chats.map((chat, index) => (
            <div key={index}>
              <ChatMessage message={{ video_url: chat.video_url }} type="user" />
              <ChatMessage message={{ summary: chat.summary }} type="assistant" />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
