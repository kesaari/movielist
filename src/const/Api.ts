import {getOptions, postOptions} from "./types";

class Api {
  baseUrl: string;

  constructor() {
    this.baseUrl = "https://api.themoviedb.org/3";
  }

  async fetchGuestSession() {
    const response = await fetch(
      `${this.baseUrl}/authentication/guest_session/new`,
      getOptions
    );
    if (!response.ok)
      throw new Error("Ошибка создания гостевой сессии: ошибка апи");
    const session = await response.json();
    return session.guest_session_id;
  }

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

  async rateMovie(movieId: number, rating: number, guestSessionId: string) {
    const options = {
      ...postOptions,
      method: rating === 0 ? "DELETE" : "POST",
      headers: {
        ...postOptions.headers,
        "Content-Type": "application/json",
      },
      body: rating !== 0 ? JSON.stringify({value: rating}) : undefined,
    };

    const response = await fetch(
      `${this.baseUrl}/movie/${movieId}/rating?guest_session_id=${guestSessionId}`,
      options
    );
    if (!response.ok) throw new Error("Ошибка установки рейтинга");
    return response.json();
  }

  async fetchRatedMovies(guestSessionId: string, page: number = 1) {
    const response = await fetch(
      `${this.baseUrl}/guest_session/${guestSessionId}/rated/movies?language=en-US&page=${page}&sort_by=created_at.asc`,
      getOptions
    );
    if (!response.ok) {
      throw new Error(`Ошибка запроса понравившихся фильмов: апи`);
    }
    const data = await response.json();
    return data.results;
  }
}
const api = new Api();
export {api}
