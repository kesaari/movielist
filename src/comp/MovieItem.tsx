import React, { useState, useEffect } from "react";
import { Rate } from "antd";
import { format } from "date-fns";
import cn from "classnames";
import { useGenres } from "./GenreContext";
import { Api } from "./Api";

interface MovieCardProps {
  title: string;
  releaseDate: string;
  overview: string;
  rating: number;
  posterPath: string;
  genreIds: number[];
  movieId: number;
  guestSessionId: string;
}

const key = "2176ee0575aeb26423d516f34f7ee67f";

const MovieItem: React.FC<MovieCardProps> = ({
  title,
  releaseDate,
  overview,
  rating,
  posterPath,
  genreIds,
  movieId,
  guestSessionId,
}) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const genres = useGenres();
  const api = new Api(key);
  const posterUrl = `https://image.tmdb.org/t/p/original${posterPath}`;

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const ratedMovies = await api.fetchRatedMovies(guestSessionId);
        const ratedMovie = ratedMovies.find((movie: any) => movie.id === movieId);
        if (ratedMovie) {
          setUserRating(ratedMovie.rating);
        }
      } catch (err) {
        console.error("Ошибка запроса фильмов:", err);
      }
    };
    fetchRating();
    console.log(guestSessionId)
  }, [guestSessionId, movieId]);

  const textCropping = (str: string, max = 200, ellipsis = "…") => {
    if (str.length <= max) return str;
    const newTxt = str.substring(0, max);
    const lastSpaceIndex = newTxt.lastIndexOf(" ");
    return lastSpaceIndex !== -1
      ? newTxt.substring(0, lastSpaceIndex) + ellipsis
      : newTxt + ellipsis;
  };

  let formattedReleaseDate = releaseDate;
  try {
    formattedReleaseDate = format(new Date(releaseDate), "MMMM d, yyyy");
  } catch (error) {
    console.error("Неправильный формат даты!", releaseDate);
  }

  const getGenreElements = (genreIds: number[]) => {
    return genreIds.map((id) => {
      const genre = genres.find((genre) => genre.id === id);
      return genre ? <div key={id} className="genre">{genre.name}</div> : null;
    });
  };

  const handleRate = async (value: number) => {
    setUserRating(value);
    try {
      await api.rateMovie(movieId, guestSessionId, value);
    } catch (err) {
      console.error("Ошибка рейтинга", err);
    }
  };

  return (
    <>
      <div className="movie_img">
        <img src={posterUrl} />
      </div>
      
          <div className="movie_title">{title}</div>
          <div
            className={cn("movie_rating", {
              "bg-red": rating <= 3,
              "bg-orange": 3 < rating && rating <= 5,
              "bg-yellow": 5 < rating && rating <= 7,
              "bg-green": rating > 7,
            })}
          >
            {rating}
          </div>
        <div className="movie_date">{formattedReleaseDate}</div>
        <div className="movie_overview">{textCropping(overview)}</div>
        <div className="movie_genres">{getGenreElements(genreIds)}</div>
        <Rate
          className="stars"
          count={10}
          value={userRating !== null ? userRating : 0}
          onChange={handleRate}
          style={{ gridArea: "star", justifySelf: "center" }}
        />
    </>
  );
};

export { MovieItem };