"use client";

import { useState } from "react";
import { Movie } from "@/types/movie";
import { useFavorites } from "@/hooks/useFavorites";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import MovieDetails from "@/components/MovieDetails";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [activeTab, setActiveTab] = useState<"search" | "favorites">("search");

  const {
    favorites,
    isLoaded,
    isFavorite,
    getFavorite,
    addFavorite,
    removeFavorite,
    updateFavorite,
  } = useFavorites();

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setMovies(data.results || []);

      if (data.results.length === 0) {
        setError("No movies found. Try a different search term.");
      }
    } catch (err) {
      setError("Failed to search movies. Please try again.");
      console.error("Search error:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const displayMovies =
    activeTab === "search" ? movies : favorites.map((fav) => fav.movie);

  return (
    <div className="container">
      <header className="header">
        <h1>Movie Explorer</h1>
        <p>Search movies, view details, and save your favorites</p>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "search" ? "active" : ""}`}
          onClick={() => setActiveTab("search")}
        >
          Search Movies
        </button>
        <button
          className={`tab ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          My Favorites ({favorites.length})
        </button>
      </div>

      {activeTab === "search" && (
        <SearchBar onSearch={handleSearch} loading={loading} />
      )}

      {error && <div className="error-message">{error}</div>}

      {activeTab === "search" &&
        !loading &&
        searchPerformed &&
        movies.length === 0 &&
        !error && (
          <div className="empty-state">
            <p>No results found. Try searching for a different movie.</p>
          </div>
        )}

      {activeTab === "favorites" && favorites.length === 0 && isLoaded && (
        <div className="empty-state">
          <p>
            No favorites yet. Search for movies and add them to your favorites!
          </p>
        </div>
      )}

      {displayMovies.length > 0 && (
        <div className="movies-grid">
          {displayMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => setSelectedMovie(movie)}
              isFavorite={isFavorite(movie.id)}
            />
          ))}
        </div>
      )}

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isFavorite={isFavorite(selectedMovie.id)}
          favorite={getFavorite(selectedMovie.id)}
          onAddFavorite={addFavorite}
          onRemoveFavorite={removeFavorite}
          onUpdateFavorite={updateFavorite}
        />
      )}
    </div>
  );
}
