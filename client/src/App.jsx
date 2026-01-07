import './App.css';
import { useChatContext } from './context/ChatContext';
import VideoInput from './components/VideoInput';
import ChatContainer from './components/ChatContainer';
import ChatInput from './components/ChatInput';

const App = () => {
  const { currentVideo, messages, loading, error, summarize_video, askQuestion, resetChat } = useChatContext();

  const handleVideoSubmit = async (videoUrl) => {
    try {
      await summarize_video({ video_url: videoUrl });
    } catch (err) {
      console.error('Failed to summarize video:', err);
    }
  };

  const handleAskQuestion = async (question) => {
    try {
      await askQuestion(question);
    } catch (err) {
      console.error('Failed to get answer:', err);
    }
  };

  // Show initial video input page if no video has been processed
  if (!currentVideo) {
    return <VideoInput onSubmit={handleVideoSubmit} loading={loading} />;
  }

  // Show chat interface after video is processed
  return (
    <div className="app">
      <header className="app-header">
        <h1>YouTube RAG Chat</h1>
        <button onClick={resetChat} className="new-video-button">
          New Video
        </button>
      </header>
      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}
      <ChatContainer messages={messages} videoUrl={currentVideo.url} />
      <ChatInput onSend={handleAskQuestion} loading={loading} placeholder="Ask a question about the video..." />
    </div>
  );
};

export default App;
