import "./App.css";
import React, { useEffect, useState } from "react";
import { Spinner } from "./Spinner";
import { MovieItem } from "./MovieItem";
import { ErrorAlert } from "./Alert";
import { useDebounce } from "use-debounce";
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

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchWord, setSearchWord] = useState("");
  const [debouncedSearchWord] = useDebounce(searchWord, 500);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const guestSessionId = useGuestSession();
  const api = new Api();

  const fetchMovies = async (page: number = 1) => {
    try {
      setLoading(true);
      const data = await api.searchMovies(debouncedSearchWord, page);
      setMovies(data.results);
      setTotalResults(data.total_results);
      setLoading(false);
    } catch (err) {
      setError("Ошибка запроса фильмов");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (guestSessionId) {
      console.log(guestSessionId)
      fetchMovies(currentPage);
    }
  }, [debouncedSearchWord, currentPage, guestSessionId]);

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(event.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1>Movie List</h1>
      <input
        className="search"
        placeholder="Начните писать для поиска"
        onChange={onSearch}
      />
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

export default MovieList;