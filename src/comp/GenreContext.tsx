import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {Api} from "./Api";

interface GenreContextType {
  genres: any[];
}

const GenreContext = createContext<GenreContextType | undefined>(undefined);

interface GenreProviderProps {
  children: ReactNode;
}

const key = "2176ee0575aeb26423d516f34f7ee67f"

export const GenreProvider: React.FC<GenreProviderProps> = ({ children }) => {
  const [genres, setGenres] = useState<any[]>([]);
  const api = new Api(key);

  const fetchGenres = async () => {
    try {
      const data = await api.fetchGenres();
      setGenres(data);
    } catch (err) {
      console.error("Ошибка запроса жанров", err);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <GenreContext.Provider value={{ genres }}>
      {children}
    </GenreContext.Provider>
  );
};

export const useGenres = () => {
  const context = useContext(GenreContext);
  if (context === undefined) {
    throw new Error("Контекст не работает!");
  }
  return context.genres;
};