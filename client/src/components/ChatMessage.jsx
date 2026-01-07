import './ChatMessage.css';

const ChatMessage = ({ message, type }) => {
  return (
    <div className={`message ${type}`}>
      <div className="message-content">
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
