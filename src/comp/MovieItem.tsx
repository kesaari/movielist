import React from "react";
import {Rate} from "antd";
import {format} from "date-fns";
import cn from "classnames";

interface MovieCardProps {
  title: string;
  releaseDate: string;
  overview: string;
  rating: number;
  posterPath: string;
}

const MovieItem: React.FC<MovieCardProps> = ({
  title,
  releaseDate,
  overview,
  rating,
  posterPath,
}) => {
  const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;

  const textCropping = (str: string, max = 150, ellipsis = "…") => {
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
    console.error("Invalid date format:", releaseDate);
  }

  return (
    <>
      <div className="movie_img">
        <img src={posterUrl} />
      </div>
      <div className="movie_info">
        <div className="movie_cont">
          <p className="movie_title">{title}</p>
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
        </div>
        <p className="movie_date">{formattedReleaseDate}</p>
        <p className="movie_overview">{textCropping(overview)}</p>

        <Rate count={10} />
      </div>
    </>
  );
};

export {MovieItem};
