import { getOptions, postOptions } from "./types";

class Api {
  baseUrl: string;

  constructor() {
    this.baseUrl = "https://api.themoviedb.org/3";
  }

  // async fetchGuestSession() {

  //   const url = `${this.baseUrl}/authentication/guest_session/new`;
  //   const response = await fetch(url, getOptions);
  //   if (!response.ok) {
  //     throw new Error("Ошибка создания гостевой сессии: ошибка апи");
  //   }
  //   const data = await response.json();
  //   return data.guest_session_id;
  // }

  async fetchGuestSession() {
    const response = await fetch(
      `${this.baseUrl}/authentication/guest_session/new`, getOptions);
    if (!response.ok) throw new Error('Ошибка создания гостевой сессии: ошибка апи');
    const session = await response.json();
    return session.guest_session_id;
  };

  async fetchGenres() {
    const url = `${this.baseUrl}/genre/movie/list`;
    const response = await fetch(url, getOptions);
    if (!response.ok) {
      throw new Error("Ошибка запроса жанров: апи");
    }
    const data = await response.json();
    return data.genres;
  }

  async searchMovies(query: string, page: number = 1) {
    const url = `${this.baseUrl}/search/movie?include_adult=false&language=en-US&query=${query}&page=${page}`;
    const response = await fetch(url, getOptions);
    if (!response.ok) {
      throw new Error("Ошибка поиска фильмов: апи");
    }
    const data = await response.json();
    return data;
  }

  // async rateMovie(movieId: number, guestSessionId: string, rating: number) {
  //   // const url = `${this.baseUrl}/movie/${movieId}/rating?guest_session_id=${guestSessionId}`;
  //   const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${guestSessionId}`, {
  //     method: "POST",
  //     headers: {
  //       accept: 'application/json',
  //       'Content-Type': 'application/json;charset=utf-8',
  //       Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTc2ZWUwNTc1YWViMjY0MjNkNTE2ZjM0ZjdlZTY3ZiIsIm5iZiI6MTczMjc5Mjc2NC41NjgsInN1YiI6IjY3NDg1MWJjYTY1MTQ1ZjU1OGRhZmIwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MkA3LO_r8Xlzkld797dffwqYD9_cm88OLeLkC299NA0'
  //     },
  //     body: JSON.stringify({ value: rating }),
  //   });
  //   if (!response.ok) {
  //     throw new Error("Ошибка установки рейтинга: апи");
  //   }
  // }

  async rateMovie(movieId: number, rating: number, guestSessionId: string) {
    const options = {
      ...getOptions,
      method: rating === 0 ? 'DELETE' : 'POST',
      headers: {
        ...getOptions.headers,
        'Content-Type': 'application/json',
      },
      body: rating !== 0 ? JSON.stringify({ value: rating }) : undefined,
    };

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${guestSessionId}`,
      options
    );
    if (!response.ok) throw new Error('Failed to rate movie');
    return response.json(); 
  }

  async fetchRatedMovies(guestSessionId: string, page: number = 1) {
    // const url = `${this.baseUrl}/guest_session/${guestSessionId}/rated/movies?language=en-US&page=${page}&sort_by=created_at.asc`;
    const response = await fetch(`https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?language=en-US&page=${page}&sort_by=created_at.asc`, getOptions);
    if (!response.ok) {
      throw new Error(`Ошибка запроса понравившихся фильмов: апи`);
    }
    const data = await response.json();
    return data.results
  }
}

// async fetchRating() {
//   try {
//     const ratedMovies = await api.fetchRatedMovies(guestSessionId);
//     const ratedMovie = ratedMovies.find((movie: any) => movie.id === movieId);
//     if (ratedMovie) {
//       setUserRating(ratedMovie.rating);
//     }
//   } catch (err) {
//     console.error("Ошибка запроса фильмов:", err);
//   }
// };

export { Api };