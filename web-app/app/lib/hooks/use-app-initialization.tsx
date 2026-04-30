import { useState, useEffect } from "react";

export function useAppInitialization(delay = 800) {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isInitializing;
}
