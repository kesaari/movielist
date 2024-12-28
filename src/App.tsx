import React from "react";
import { BrowserRouter, Route, Routes, Link, Navigate } from "react-router-dom";
import MovieList from "./comp/MovieList";
import RatedMovies from "./comp/RatedMovieList";
import { GenreProvider } from "../src/context/GenreContext";
import { MovieRatingsProvider } from "../src/context/RatingContext";
import { ErrorAlert } from "./comp/Alert";
import { useNetworkState } from "use-network-state3";
import { ApiProvider } from "./context/ApiContext";

const App: React.FC = () => {
  const networkState = useNetworkState();

  if (!networkState.online) return <ErrorAlert text={'У вас плохое соединение'} />

  return (
    <ApiProvider>
      <GenreProvider>
        <MovieRatingsProvider>
          <BrowserRouter>
            <div>
              <nav className="nav">
                <ul>
                  <li>
                    <Link className="nav-btn" to="/search">Поиск</Link>
                  </li>
                  <li>
                    <Link className="nav-btn" to="/rated">Ваши оценки</Link>
                  </li>
                </ul>
              </nav>
              <div className="content">
                <Routes>
                  <Route path="/" element={<Navigate to="/search" />} />
                  <Route path="/search" element={<MovieList />} />
                  <Route path="/rated" element={<RatedMovies />} />
                </Routes>
              </div>
            </div>
          </BrowserRouter>
        </MovieRatingsProvider>
      </GenreProvider>
    </ApiProvider>
  );
};

export default App;