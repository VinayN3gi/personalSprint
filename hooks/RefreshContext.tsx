import React, { createContext, useContext, useState, useCallback } from "react";

interface RefreshContextType {
  refreshToken: boolean;
  triggerRefresh: () => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider = ({ children }: { children: React.ReactNode }) => {
  const [refreshToken, setRefreshToken] = useState(false);

  const triggerRefresh = useCallback(() => {
    setRefreshToken(prev => !prev);
  }, []);

  return (
    <RefreshContext.Provider value={{ refreshToken: refreshToken, triggerRefresh: triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error("useRefresh must be used within a RefreshProvider");
  }
  return context;
};
