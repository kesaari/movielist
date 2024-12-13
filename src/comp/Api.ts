class Api {
  apiKey: string;
  baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.themoviedb.org/3";
  }

  async fetchGuestSession() {
    const url = `${this.baseUrl}/authentication/guest_session/new?api_key=${this.apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Ошибка создания гостевой сессии");
    }
    const data = await response.json();
    return data.guest_session_id;
  }

  async fetchGenres() {
    const url = `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Ошибка запроса жанров");
    }
    const data = await response.json();
    return data.genres;
  }

  async searchMovies(query: string, page: number = 1) {
    const url = `${this.baseUrl}/search/movie?include_adult=false&language=en-US&query=${query}&page=${page}&api_key=${this.apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Ошибка поиска фильмов");
    }
    const data = await response.json();
    return data;
  }

  async rateMovie(movieId: number, guestSessionId: string, rating: number) {
    const url = `${this.baseUrl}/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({value: rating}),
    });
    if (!response.ok) {
      throw new Error("Ошибка установки рейтинга");
    }
  }

  async fetchRatedMovies(guestSessionId: string) {
    const url = `${this.baseUrl}/guest_session/${guestSessionId}/rated/movies?api_key=${this.apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Ошибка запроса понравившихся фильмов");
    }
    const data = await response.json();
    return data.results;
  }
}

export {Api};
