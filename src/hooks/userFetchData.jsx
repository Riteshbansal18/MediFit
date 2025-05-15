import { useEffect, useState } from "react";

const useFetchData = (url) => {
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip if URL is not valid
    if (!url || typeof url !== 'string') {
      setError(new Error("Invalid URL provided"));
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching data from:", url); // Debug log
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log("Response status:", res.status); // Debug log
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.message || 
            `Request failed with status ${res.status}`
          );
        }

        const result = await res.json();
        console.log("Received data:", result); // Debug log
        
        if (!result) {
          throw new Error("Received empty response");
        }
        
        setData(result);
      } catch (error) {
        console.error("Fetch error details:", {
          error,
          url,
          time: new Date().toISOString()
        });
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup function if needed
    };
  }, [url]);

  return {
    data,
    loading,
    error,
  };
};

export default useFetchData;