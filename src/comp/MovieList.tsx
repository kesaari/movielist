import "./App.css";
import React, { useEffect, useState } from "react";
import { Spinner } from "./Spinner";
import { MovieItem } from "./MovieItem";
import { ErrorAlert } from "./Alert";
import { useDebounce } from "use-debounce";
import { Pages } from "./Pages";
import { useApi } from "../context/ApiContext";

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

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchWord, setSearchWord] = useState("");
  const [debouncedSearchWord] = useDebounce(searchWord, 500);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const { searchMovies } = useApi();

  const fetchMovies = async (page: number = 1) => {
    try {
      setLoading(true);
      const data = await searchMovies(debouncedSearchWord, page);
      setMovies(data.results);
      setTotalResults(data.total_results);
      setLoading(false);

      if (data.results.length === 0) {
        setError("Фильмы по запросу не найдены");
      } else {
        setError(null);
      }
    } catch (err) {
      setError("Ошибка запроса фильмов");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearchWord) {
      fetchMovies(currentPage);
    }
  }, [debouncedSearchWord, currentPage]);

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(event.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
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
            />
          </li>
        ))}
      </ul>
      {totalResults ? (
        <Pages
          onChange={handlePageChange}
          defaultCurrent={currentPage}
          total={totalResults}
        />
      ) : null}
    </div>
  );
};

export default MovieList;