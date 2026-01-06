import { useState, useEffect, useCallback } from "react";

export const useFetch = (fetchFunction, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const executeFetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFunction();

      setData(result);
      return result;

    } catch (err) {
      setError(err.message || "An error occurred");
      console.log("Fetch Error:", err)
      throw err;
    } finally {
      setLoading(false)
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (immediate) {
      executeFetch();
    }
  }, [...dependencies, immediate]);

  // > ReFetch function for manual refetching
  const refetch = useCallback(() => {
    return executeFetch();
  }, [executeFetch]);

  return { data, loading, error, refetch };
};