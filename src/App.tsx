import "./App.css";
import React, { useEffect, useState } from "react";
import { Spinner } from "./comp/Spinner";
import { MovieItem } from "./comp/MovieItem";
import { ErrorAlert } from "./comp/Alert";
import { useDebounce } from "use-debounce";

interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  rating: number;
  vote_average: number;
}

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchWord, setSearchWord] = useState("");
  const [debouncedSearchWord] = useDebounce(searchWord, 500); // Задержка в 500 мс

  const fetchMovies = async (page: number = 1) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTc2ZWUwNTc1YWViMjY0MjNkNTE2ZjM0ZjdlZTY3ZiIsIm5iZiI6MTczMjc5MzU0NS43NzY1NzM0LCJzdWIiOiI2NzQ4NTFiY2E2NTE0NWY1NThkYWZiMGUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hHaxfHbnRJ7bKSj3G1CkC5ykfnsjWntrcakiMi17Brs",
      },
    };

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&query=${debouncedSearchWord}`,
        options
      );
      if (!response.ok) {
        throw new Error("Что-то пошло не так");
      }
      const data = await response.json();
      setMovies(data.results);
      setLoading(false);
    } catch (err) {
      setError("Ошибка запроса");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [debouncedSearchWord]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorAlert text={error} />;
  }

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(event.target.value);
  };


  return (
    <div>
      <h1>Movie List</h1>
      <input
        placeholder="Начните писать для поиска"
        onChange={onSearch}
      ></input>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <MovieItem
              title={movie.title}
              releaseDate={movie.release_date}
              overview={movie.overview}
              rating={Number(movie.vote_average.toFixed(1))}
              posterPath={movie.poster_path}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieList;