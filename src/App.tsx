import './App.css'
import React, { useEffect, useState } from 'react';
import { Spinner } from './comp/Spinner';
import { MovieItem } from './comp/MovieItem';


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
  const [searchWord, setSearchWord] = useState('')

    const fetchMovies = async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTc2ZWUwNTc1YWViMjY0MjNkNTE2ZjM0ZjdlZTY3ZiIsIm5iZiI6MTczMjc5MzU0NS43NzY1NzM0LCJzdWIiOiI2NzQ4NTFiY2E2NTE0NWY1NThkYWZiMGUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hHaxfHbnRJ7bKSj3G1CkC5ykfnsjWntrcakiMi17Brs'
        }
      };

      try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${searchWord}`, options);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMovies(data.results);
        setLoading(false);
      } catch (err) {
        setError('Error fetching movies');
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchMovies()
    }, [])

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <div>{error}</div>;
  }

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(event.target.value);
    fetchMovies()
  }

  return (
    <div>
      <h1>Movie List</h1>
      <input placeholder='Начните писать для поиска' onChange={onSearch}></input>
      <ul>
      {movies.map((movie) => (
          <li key={movie.id}>
            <MovieItem
            title={movie.title}
            releaseDate={movie.release_date}
            overview={movie.overview}
            rating={Number((movie.vote_average).toFixed(1))}
            posterPath={movie.poster_path}/>

          </li>
                  ))}
      </ul>
        
    </div>
  );
};

export default MovieList;