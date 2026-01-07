import { createContext, useContext, useState, useCallback } from "react";
import { chatService } from "../services/chatService";

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const summarize_video = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatService.summarize(params);
      setCurrentVideo({
        url: params.video_url,
        summary: response.data.summary
      });
      setMessages([
        {
          type: 'summary',
          content: response.data.summary,
          timestamp: new Date()
        }
      ]);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to summarize video');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const askQuestion = useCallback(async (question) => {
    if (!currentVideo) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Add user question to messages
      setMessages(prev => [...prev, {
        type: 'question',
        content: question,
        timestamp: new Date()
      }]);

      const response = await chatService.ask({
        video_url: currentVideo.url,
        question: question
      });

      // Add assistant answer to messages
      setMessages(prev => [...prev, {
        type: 'answer',
        content: response.data.answer,
        timestamp: new Date()
      }]);

      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to get answer');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentVideo]);

  const resetChat = useCallback(() => {
    setCurrentVideo(null);
    setMessages([]);
    setError(null);
  }, []);

  const value = {
    currentVideo,
    messages,
    loading,
    error,
    summarize_video,
    askQuestion,
    resetChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error('useChatContext must be used withing a ChatProvider')
  }

  return context;
};