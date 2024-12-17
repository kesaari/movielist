import "./App.css";
import React, { useEffect, useState } from "react";
import { Spinner } from "./Spinner";
import { MovieItem } from "./MovieItem";
import { ErrorAlert } from "./Alert";
import { Api } from "./Api";
import { Pages } from "./Pages";

interface Movie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    poster_path: string;
    rating: number;
    vote_average: number;
    genre_ids: number[];
  }
  
  const key = "2176ee0575aeb26423d516f34f7ee67f";
  
  const RatedMovies: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalResults, setTotalResults] = useState<number>(0);
    const [guestSessionId, setGuestSessionId] = useState<string | null>(null);
    const api = new Api(key);
  
    const fetchGuestSession = async () => {
      try {
        const data = await api.fetchGuestSession();
        setGuestSessionId(data);
        console.log(guestSessionId)
      } catch (err) {
        setError("Ошибка создания гостевой сессии");
      }
    };
  
    const fetchRatedMovies = async (page: number = 1) => {
      if (!guestSessionId) return;
      try {
        setLoading(true);
        const data = await api.fetchRatedMovies(guestSessionId, page);
        setMovies(data);
        setTotalResults(data.length);
        setLoading(false);
      } catch (err) {
        setError(`Ошибка запроса понравившихся фильмов`);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchGuestSession();
    }, []);
  
    useEffect(() => {
      if (guestSessionId) {
        fetchRatedMovies(currentPage);
      }
    }, [currentPage, guestSessionId]);
  
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };
  
    return (
      <div>
        <h1>Rated Movies</h1>
        {loading && <Spinner />}
        {error && <ErrorAlert text={error} />}
        <ul className="list">
          {movies.map((movie) => (
            <li className="item" key={movie.id}>
              <MovieItem
                title={movie.title}
                releaseDate={movie.release_date}
                overview={movie.overview}
                rating={Number(movie.vote_average.toFixed(1))}
                posterPath={movie.poster_path}
                genreIds={movie.genre_ids}
                movieId={movie.id}
                guestSessionId={guestSessionId as string}
              />
            </li>
          ))}
        </ul>
        <Pages
          onChange={handlePageChange}
          defaultCurrent={currentPage}
          total={totalResults}
        />
      </div>
    );
  };
  
  export default RatedMovies;