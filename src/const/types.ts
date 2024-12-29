export const getOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTc2ZWUwNTc1YWViMjY0MjNkNTE2ZjM0ZjdlZTY3ZiIsIm5iZiI6MTczMjc5Mjc2NC41NjgsInN1YiI6IjY3NDg1MWJjYTY1MTQ1ZjU1OGRhZmIwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MkA3LO_r8Xlzkld797dffwqYD9_cm88OLeLkC299NA0'
    }
  };

export const postOptions = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTc2ZWUwNTc1YWViMjY0MjNkNTE2ZjM0ZjdlZTY3ZiIsIm5iZiI6MTczMjc5Mjc2NC41NjgsInN1YiI6IjY3NDg1MWJjYTY1MTQ1ZjU1OGRhZmIwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MkA3LO_r8Xlzkld797dffwqYD9_cm88OLeLkC299NA0'
    }
  };

export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  rating: number;
  vote_average: number;
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface SearchResults {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}