import { createContext, useContext, useState, useCallback } from "react";
import { chatService } from "../services/chatService";

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const summarize_video = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatService.summarize(params);
      setChats(prevChats => [...prevChats, response.data]);
      console.log(`>> Added response to chat[]`, response.data)
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [])

  const value = {
    chats,
    loading,
    error,
    summarize_video,
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