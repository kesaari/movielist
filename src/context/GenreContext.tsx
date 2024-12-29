import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  PropsWithChildren,
} from "react";
import {useApi} from "../context/ApiContext";
import {Genre} from "../types/types";

interface GenreContextType {
  genres: Genre[];
}

const GenreContext = createContext<GenreContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const GenreProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const {fetchGenres} = useApi();

  useEffect(() => {
    const fetchGenresData = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (err) {
        console.error("Ошибка запроса жанров", err);
      }
    };

    fetchGenresData();
  }, [fetchGenres]);

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
