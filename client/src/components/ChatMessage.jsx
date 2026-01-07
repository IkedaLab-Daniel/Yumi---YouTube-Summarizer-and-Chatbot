import './ChatMessage.css';

const ChatMessage = ({ message, type }) => {
  return (
    <div className={`message ${type}`}>
      <div className="message-content">
        {type === 'user' && (
          <>
            <strong>Video URL:</strong>
            <p>{message.video_url}</p>
          </>
        )}
        {type === 'assistant' && (
          <>
            <strong>Summary:</strong>
            <p>{message.summary}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
