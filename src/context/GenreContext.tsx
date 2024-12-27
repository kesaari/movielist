import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  PropsWithChildren
} from "react";
import {api} from "../const/Api";


interface Genre {
  id: number;
  name: string;
}

interface GenreContextType {
  genres: Genre[];
}

const GenreContext = createContext<GenreContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const GenreProvider: React.FC<PropsWithChildren<Props>> = ({children}) => {
  const [genres, setGenres] = useState<Genre[]>([]);


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
  }, [genres]);

  return (
    <GenreContext.Provider value={{genres}}>{children}</GenreContext.Provider>
  );
};

export const useGenres = () => {
  const context = useContext(GenreContext);
  if (context === undefined) {
    throw new Error("Контекст не работает!");
  }
  return context.genres;
};
