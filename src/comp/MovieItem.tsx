import React from "react";
import {Rate} from "antd";
import {format} from "date-fns";
import cn from "classnames";
import {useGenres} from "../context/GenreContext";
import {useMovieRatings} from "../context/RatingContext";
import {useApi} from "../context/ApiContext";
import styles from "./component.module.css";

interface Props {
  title: string;
  releaseDate: string;
  overview: string;
  rating: number;
  posterPath: string;
  genreIds: number[];
  movieId: number;
}

const MovieItem: React.FC<Props> = ({
  title,
  releaseDate,
  overview,
  rating,
  posterPath,
  genreIds,
  movieId,
}) => {
  const {movieRatings, setMovieRating} = useMovieRatings();
  const genres = useGenres();
  const {rateMovie} = useApi();
  const posterUrl = `https://image.tmdb.org/t/p/original${posterPath}`;

  const userRating =
    movieRatings.find((r) => r.movieId === movieId)?.rating || 0;

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
      return genre ? (
        <div key={id} className={styles.genre}>
          {genre.name}
        </div>
      ) : null;
    });
  };

  const handleRate = async (value: number) => {
    setMovieRating(movieId, value);
    try {
      const response = await rateMovie(movieId, value);
      if (response.status === 201) {
        console.error("Ошибка рейтинга: статус 201");
      }
    } catch (err) {
      console.error("Ошибка рейтинга: компонент");
    }
  };

  return (
    <>
      <div className={styles.movie_img}>
        <img src={posterUrl} />
      </div>
      <div className={styles.movie_title}>{title}</div>
      <div
        className={cn(styles.movie_rating, {
          [styles.bg_red]: rating <= 3,
          [styles.bg_orange]: 3 < rating && rating <= 5,
          [styles.bg_yellow]: 5 < rating && rating <= 7,
          [styles.bg_green]: rating > 7,
        })}
      >
        {rating}
      </div>
      <div className={styles.movie_date}>{formattedReleaseDate}</div>
      <div className={styles.movie_overview}>{textCropping(overview)}</div>
      <div className={styles.movie_genres}>{getGenreElements(genreIds)}</div>
      <Rate
        className={styles.stars}
        count={10}
        value={userRating ? userRating : 0}
        onChange={(value) => handleRate(value)}
        style={{gridArea: "star", justifySelf: "center"}}
      />
    </>
  );
};

export {MovieItem};
