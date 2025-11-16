import { Movie } from '@/types/movie';
import Image from 'next/image';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
  isFavorite: boolean;
}

export default function MovieCard({ movie, onClick, isFavorite }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : '/placeholder-poster.png';

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';

  return (
    <div
      onClick={onClick}
      className="movie-card"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter') onClick();
      }}
    >
      <div className="poster-container">
        {movie.poster_path ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            width={300}
            height={450}
            className="poster"
          />
        ) : (
          <div className="poster-placeholder">
            <span>No Image</span>
          </div>
        )}
        {isFavorite && (
          <div className="favorite-badge">★</div>
        )}
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{year}</p>
        <p className="movie-overview">
          {movie.overview
            ? movie.overview.length > 120
              ? movie.overview.substring(0, 120) + '...'
              : movie.overview
            : 'No description available'}
        </p>
      </div>
    </div>
  );
}
