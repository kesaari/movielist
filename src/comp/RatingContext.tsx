import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Api } from "./Api";
import { useGuestSession } from "./GuestContext";

interface MovieRating {
  movieId: number;
  rating: number;
}

interface MovieRatingsContextType {
  movieRatings: MovieRating[];
  setMovieRating: (movieId: number, rating: number) => void;
}

const MovieRatingsContext = createContext<MovieRatingsContextType | undefined>(undefined);

interface MovieRatingsProviderProps {
  children: ReactNode;
}

export const MovieRatingsProvider: React.FC<MovieRatingsProviderProps> = ({ children }) => {
  const [movieRatings, setMovieRatings] = useState<MovieRating[]>([]);
  const api = new Api();
  const guestSessionId = useGuestSession();

  useEffect(() => {
    const fetchRatings = async () => {
      if (guestSessionId) {
        try {
          const ratedMovies = await api.fetchRatedMovies(guestSessionId);
          setMovieRatings(ratedMovies.map((movie: any) => ({ movieId: movie.id, rating: movie.rating })));
        } catch (err) {
          console.error("Ошибка запроса фильмов:", err);
        }
      }
    };

    fetchRatings();
  }, [guestSessionId]);

  const setMovieRating = (movieId: number, rating: number) => {
    setMovieRatings((prevRatings) => {
      const existingRatingIndex = prevRatings.findIndex((r) => r.movieId === movieId);
      if (existingRatingIndex !== -1) {
        const updatedRatings = [...prevRatings];
        updatedRatings[existingRatingIndex] = { movieId, rating };
        return updatedRatings;
      } else {
        return [...prevRatings, { movieId, rating }];
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