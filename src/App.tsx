import React from "react";
import {BrowserRouter, Route, Routes, Link, Navigate} from "react-router-dom";
import MovieList from "./comp/MovieList";
import RatedMovies from "./comp/RatedMovieList";
import {GenreProvider} from "./context/GenreContext";
import {GuestSessionProvider} from "./context/GuestContext";
import {MovieRatingsProvider} from "./context/RatingContext";
import {ErrorAlert} from "./comp/Alert";
import {useNetworkState} from "use-network-state3";

const App: React.FC = () => {
  const networkState = useNetworkState();

  if (!networkState.online)
    return <ErrorAlert text={"У вас плохое соединение"} />;

  return (
    <GenreProvider>
      <GuestSessionProvider>
        <MovieRatingsProvider>
          <BrowserRouter>
            <div>
              <nav className="nav">
                <ul>
                  <li>
                    <Link className="nav-btn" to="/search">
                      Поиск
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-btn" to="/rated">
                      Ваши оценки
                    </Link>
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
      </GuestSessionProvider>
    </GenreProvider>
  );
};

export default App;
