import { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies..."
        className="search-input"
        disabled={loading}
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading || !query.trim()}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
