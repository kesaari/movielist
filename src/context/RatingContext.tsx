import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {Api} from "../const/Api";
import {useGuestSession} from "../context/GuestContext";

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

interface MovieRatingsProviderProps {
  children: ReactNode;
}

export const MovieRatingsProvider: React.FC<MovieRatingsProviderProps> = ({
  children,
}) => {
  const [movieRatings, setMovieRatings] = useState<MovieRating[]>([]);
  const api = new Api();
  const guestSessionId = useGuestSession();

  useEffect(() => {
    const fetchRatings = async () => {
      if (guestSessionId) {
        try {
          const ratedMovies = await api.fetchRatedMovies(guestSessionId);
          setMovieRatings(
            ratedMovies.map((movie: any) => ({
              movieId: movie.id,
              rating: movie.rating,
            }))
          );
        } catch (err) {
          console.error("Ошибка запроса фильмов:", err);
        }
      }
    };

    fetchRatings();
  }, [guestSessionId]);

  const setMovieRating = (movieId: number, rating: number) => {
    setMovieRatings((prev) => {
      const ind = prev.findIndex((r) => r.movieId === movieId);
      if (ind !== -1) {
        const updatedRatings = [...prev];
        updatedRatings[ind] = {movieId, rating};
        return updatedRatings;
      } else {
        return [...prev, {movieId, rating}];
      }
    });
  };

  return (
    <MovieRatingsContext.Provider value={{movieRatings, setMovieRating}}>
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
