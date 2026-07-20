import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// Generic GET hook: useFetch('/jobs', { keyword: 'react' })
export default function useFetch(url, params = {}, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const paramsKey = JSON.stringify(params);

  const refetch = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    try {
      const { data: res } = await api.get(url, { params });
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, paramsKey]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, paramsKey, ...deps]);

  return { data, loading, error, refetch, setData };
}
