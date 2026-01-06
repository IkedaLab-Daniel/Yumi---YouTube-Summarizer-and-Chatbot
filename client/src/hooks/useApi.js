import { useState, useCallback } from "react";

export const useApi = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback( async (apiFunction, options = {}) => {
      const { onSuccess, onError, optimisticData } = options;

      try {
        setLoading(false);
        setError(null);

        if (optimisticData) {
          setData(optimisticData);
        }

        const result = await apiFunction();

        setData(result);

        // > Success callback
        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);

        // > Revert optimistic update on error
        if (optimisticData) {
          setData(null);
        }

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    }, []);

    // > Reset State
    const reset = useCallback(() => {
      setData(null);
      setLoading(false);
      setError(null);
    }, [])

    return { execute, loading, error, data, reset }
};