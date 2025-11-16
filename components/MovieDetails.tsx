import { Movie, Favorite } from '@/types/movie';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
  isFavorite: boolean;
  favorite?: Favorite;
  onAddFavorite: (movie: Movie, rating: number, note: string) => void;
  onRemoveFavorite: (movieId: number) => void;
  onUpdateFavorite: (movieId: number, rating: number, note: string) => void;
}

export default function MovieDetails({
  movie,
  onClose,
  isFavorite,
  favorite,
  onAddFavorite,
  onRemoveFavorite,
  onUpdateFavorite,
}: MovieDetailsProps) {
  const [rating, setRating] = useState(favorite?.rating || 0);
  const [note, setNote] = useState(favorite?.note || '');
  const [detailedMovie, setDetailedMovie] = useState<Movie>(movie);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch detailed movie info including runtime
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/movie/${movie.id}`);
        if (!response.ok) throw new Error('Failed to fetch movie details');
        const data = await response.json();
        setDetailedMovie(data);
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movie.id]);

  const handleSave = () => {
    if (isFavorite) {
      onUpdateFavorite(movie.id, rating, note);
    } else {
      onAddFavorite(detailedMovie, rating, note);
    }
  };

  const handleRemove = () => {
    onRemoveFavorite(movie.id);
    onClose();
  };

  const posterUrl = detailedMovie.poster_path
    ? `https://image.tmdb.org/t/p/w500${detailedMovie.poster_path}`
    : null;

  const year = detailedMovie.release_date
    ? new Date(detailedMovie.release_date).getFullYear()
    : 'N/A';

  const runtime = detailedMovie.runtime
    ? `${Math.floor(detailedMovie.runtime / 60)}h ${detailedMovie.runtime % 60}m`
    : 'N/A';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        {loading ? (
          <div className="loading">Loading details...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <div className="modal-header">
              {posterUrl && (
                <div className="modal-poster">
                  <Image
                    src={posterUrl}
                    alt={detailedMovie.title}
                    width={300}
                    height={450}
                    className="poster"
                  />
                </div>
              )}
              <div className="modal-info">
                <h2>{detailedMovie.title}</h2>
                <div className="meta">
                  <span className="year">{year}</span>
                  <span className="separator">•</span>
                  <span className="runtime">{runtime}</span>
                  {detailedMovie.vote_average && (
                    <>
                      <span className="separator">•</span>
                      <span className="vote">
                        ⭐ {detailedMovie.vote_average.toFixed(1)}
                      </span>
                    </>
                  )}
                </div>
                <p className="overview">{detailedMovie.overview}</p>
              </div>
            </div>

            <div className="favorite-section">
              <h3>Your Rating & Notes</h3>
              
              <div className="rating-input">
                <label>Rating:</label>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`star ${rating >= star ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                      type="button"
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="note-input">
                <label htmlFor="note">Note:</label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a personal note about this movie..."
                  rows={3}
                />
              </div>

              <div className="actions">
                {isFavorite ? (
                  <>
                    <button className="btn btn-primary" onClick={handleSave}>
                      Update Favorite
                    </button>
                    <button className="btn btn-danger" onClick={handleRemove}>
                      Remove from Favorites
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={handleSave}>
                    Add to Favorites
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
