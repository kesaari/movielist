import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Api } from "./Api";

interface GuestSessionContextType {
  guestSessionId: string | null;
}

const GuestSessionContext = createContext<GuestSessionContextType | undefined>(undefined);

interface GuestSessionProviderProps {
  children: ReactNode;
}

// const key = "2176ee0575aeb26423d516f34f7ee67f";

export const GuestSessionProvider: React.FC<GuestSessionProviderProps> = ({ children }) => {
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);
  const api = new Api();

  useEffect(() => {
    const initSession = async () => {
      try {
        const newSession = await api.fetchGuestSession();
        setGuestSessionId(newSession);
      } catch (err) {
        console.error('Ошибка создания гостевой сессии: ошибка контекста', err);
      }
    };

    initSession();
  }, []);

  return (
    <GuestSessionContext.Provider value={{ guestSessionId }}>
      {children}
    </GuestSessionContext.Provider>
  );
};

export const useGuestSession = () => {
  const context = useContext(GuestSessionContext);
  if (context === undefined) {
    throw new Error("Контекст гостевой сессии не работает!");
  }
  return context.guestSessionId;
};