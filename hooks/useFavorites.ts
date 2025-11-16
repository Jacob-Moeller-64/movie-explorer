import { useState, useEffect } from 'react';
import { Movie, Favorite } from '@/types/movie';

const STORAGE_KEY = 'movie-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
    }
  }, [favorites, isLoaded]);

  const isFavorite = (movieId: number): boolean => {
    return favorites.some(fav => fav.movie.id === movieId);
  };

  const getFavorite = (movieId: number): Favorite | undefined => {
    return favorites.find(fav => fav.movie.id === movieId);
  };

  const addFavorite = (movie: Movie, rating: number = 0, note: string = '') => {
    setFavorites(prev => [
      ...prev,
      {
        movie,
        rating,
        note,
        addedAt: new Date().toISOString(),
      },
    ]);
  };

  const removeFavorite = (movieId: number) => {
    setFavorites(prev => prev.filter(fav => fav.movie.id !== movieId));
  };

  const updateFavorite = (movieId: number, rating: number, note: string) => {
    setFavorites(prev =>
      prev.map(fav =>
        fav.movie.id === movieId
          ? { ...fav, rating, note }
          : fav
      )
    );
  };

  return {
    favorites,
    isLoaded,
    isFavorite,
    getFavorite,
    addFavorite,
    removeFavorite,
    updateFavorite,
  };
}
