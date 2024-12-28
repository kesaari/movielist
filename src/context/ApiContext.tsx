import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { Api } from "../const/Api";


interface ApiContextType {
  fetchGuestSession: () => Promise<string | null>;
  fetchGenres: () => Promise<any[]>;
  searchMovies: (query: string, page: number) => Promise<any>;
  rateMovie: (movieId: number, rating: number) => Promise<any>;
  fetchRatedMovies: (page: number) => Promise<any[]>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const apiRef = useRef<Api | null>(null);
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);

  useEffect(() => {
    const initApi = async () => {
      if (!apiRef.current) {
        apiRef.current = new Api();
      }
      try {
        const newSession = await apiRef.current.fetchGuestSession();
        setGuestSessionId(newSession);
      } catch (err) {
        console.error("Ошибка создания гостевой сессии:", err);
      }
    };

    initApi();
  }, []);

  const fetchGuestSession = async () => {
    if (apiRef.current) {
      return await apiRef.current.fetchGuestSession();
    }
  };

  const fetchGenres = async () => {
    if (apiRef.current) {
      return await apiRef.current.fetchGenres();
    }
  };

  const searchMovies = async (query: string, page: number = 1) => {
    if (apiRef.current) {
      return await apiRef.current.searchMovies(query, page);
    }
  };

  const rateMovie = async (movieId: number, rating: number) => {
    if (apiRef.current && guestSessionId) {
      return await apiRef.current.rateMovie(movieId, rating, guestSessionId);
    }
  };

  const fetchRatedMovies = async (page: number = 1) => {
    if (apiRef.current && guestSessionId) {
      return await apiRef.current.fetchRatedMovies(guestSessionId, page);
    }
  };

  return (
    <ApiContext.Provider value={{ fetchGuestSession, fetchGenres, searchMovies, rateMovie, fetchRatedMovies }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("ApiContext is not provided!");
  }
  return context;
};