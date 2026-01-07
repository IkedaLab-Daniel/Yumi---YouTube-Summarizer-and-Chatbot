import { chatService } from "../services/chatService";
import { useFetch } from "./useFetch";

export const useChat = (params = {}) => {
  const { data: chats, loading, error, refetch} = useFetch(
    () => chatService.summarize(params),
    [JSON.stringify(params)],
    true
  );

  return {
    chats,
    loading,
    error,
    refetch,
  };
};