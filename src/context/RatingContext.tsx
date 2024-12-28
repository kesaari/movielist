import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  PropsWithChildren
} from "react";
import { useApi } from "../context/ApiContext";

interface MovieRating {
  movieId: number;
  rating: number;
}

interface MovieRatingsContextType {
  movieRatings: MovieRating[];
  setMovieRating: (movieId: number, rating: number) => void;
}

const MovieRatingsContext = createContext<MovieRatingsContextType | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}

export const MovieRatingsProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
}) => {
  const [movieRatings, setMovieRatings] = useState<MovieRating[]>([]);
  const { fetchRatedMovies } = useApi();

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const ratedMovies = await fetchRatedMovies(1);
        setMovieRatings(
          ratedMovies.map((movie) => ({
            movieId: movie.id,
            rating: movie.rating,
          }))
        );
      } catch (err) {
        console.error("Ошибка запроса фильмов:", err);
      }
    };

    fetchRatings();
  }, [fetchRatedMovies]);

  const setMovieRating = (movieId: number, rating: number) => {
    setMovieRatings((prev) => {
      const ind = prev.findIndex((r) => r.movieId === movieId);
      if (ind !== -1) {
        const updatedRatings = [...prev];
        updatedRatings[ind] = { movieId, rating };
        return updatedRatings;
      } else {
        return [...prev, { movieId, rating }];
      }
    });
  };

  return (
    <MovieRatingsContext.Provider value={{ movieRatings, setMovieRating }}>
      {children}
    </MovieRatingsContext.Provider>
  );
};

export const useMovieRatings = () => {
  const context = useContext(MovieRatingsContext);
  if (context === undefined) {
    throw new Error("Контекст рейтингов фильмов не работает!");
  }
  return context;
};