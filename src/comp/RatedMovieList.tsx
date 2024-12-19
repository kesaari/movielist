import "./App.css";
import React, { useEffect, useState } from "react";
import { Spinner } from "./Spinner";
import { MovieItem } from "./MovieItem";
import { ErrorAlert } from "./Alert";
import { Api } from "./Api";
import { Pages } from "./Pages";
import { useGuestSession } from "./GuestContext";

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

// const key = "2176ee0575aeb26423d516f34f7ee67f";

const RatedMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const guestSessionId = useGuestSession();
  const api = new Api();

  const fetchRatedMovies = async (page: number = 1) => {
    if (!guestSessionId) return;
    try {
      setLoading(true);
      const data = await api.fetchRatedMovies(guestSessionId, page);
      setMovies(data);
      setTotalResults(data.length);
      setLoading(false);
    } catch (err) {
      setError(`Ошибка запроса понравившихся фильмов: компонент`);
      setLoading(false);
    }
  };

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
      {totalResults ? <Pages
              onChange={handlePageChange}
              defaultCurrent={currentPage}
              total={totalResults}
            /> : null}
    </div>
  );
};

export default RatedMovies;