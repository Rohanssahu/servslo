// src/utils/useAsync.ts
import { useEffect, useState } from 'react';

export function useAsync<T>(fn: () => Promise<T>, deps: any[]) {
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fn().then((d) => mounted && setData(d)).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading };
}
