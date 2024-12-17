import React from "react";
import { BrowserRouter, Route, Routes, Link, Navigate } from "react-router-dom";
import MovieList from "./comp/MovieList";
import RatedMovies from "./comp/RatedMovieList";
import { GenreProvider } from "./comp/GenreContext";

const App: React.FC = () => {
  return (
    <GenreProvider>
      <BrowserRouter>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/search">Search</Link>
              </li>
              <li>
                <Link to="/rated">Rated</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<Navigate to="/search" />} />
            <Route path="/search" element={<MovieList />} />
            <Route path="/rated" element={<RatedMovies />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GenreProvider>
  );
};

export default App;