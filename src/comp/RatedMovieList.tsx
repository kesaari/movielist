import styles from "./component.module.css";
import React, {useEffect, useState} from "react";
import {Spinner} from "./Spinner";
import {MovieItem} from "./MovieItem";
import {ErrorAlert} from "./Alert";
import {Pages} from "./Pages";
import {useApi} from "../context/ApiContext";

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

export const RatedMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const {fetchRatedMovies} = useApi();

  const fetchRatedMoviesData = async (page: number = 1) => {
    try {
      setLoading(true);
      const data = await fetchRatedMovies(page);
      setMovies(data);
      setTotalResults(data.length);
      setLoading(false);
    } catch (err) {
      setError(`Ошибка запроса понравившихся фильмов: компонент`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatedMoviesData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1>Ваши оценки</h1>
      {loading && <Spinner />}
      {error && <ErrorAlert text={error} />}
      <ul className={styles.list}>
        {movies.map((movie) => (
          <li className={styles.item} key={movie.id}>
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
