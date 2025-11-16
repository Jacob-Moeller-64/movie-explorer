export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  runtime?: number;
  vote_average?: number;
}

export interface Favorite {
  movie: Movie;
  rating: number;
  note: string;
  addedAt: string;
}

export interface TMDBSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
