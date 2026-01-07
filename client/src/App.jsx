import './App.css';
import { useChatContext } from './context/ChatContext';
import ChatContainer from './components/ChatContainer';
import ChatInput from './components/ChatInput';

const App = () => {
  const { chats, loading, error, summarize_video } = useChatContext();

  const handleSend = async (videoUrl) => {
    try {
      await summarize_video({ video_url: videoUrl });
    } catch (err) {
      console.error('Failed to summarize video:', err);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>YouTube RAG Chat</h1>
      </header>
      <ChatContainer chats={chats} />
      <ChatInput onSend={handleSend} loading={loading} />
    </div>
  );
};

export default App;
