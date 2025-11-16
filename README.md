# Movie Explorer

A movie search app with favorites management built with Next.js and TMDB API.

**Live Demo:** https://movie-explorer-lovat-five.vercel.app/

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Add your TMDB API key**

   Create `.env.local`:

   ```env
   TMDB_API_KEY=your_api_key_here
   ```

3. **Run locally**
   ```bash
   npm run dev
   ```

Open `http://localhost:3000`

## Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add `TMDB_API_KEY` environment variable
4. Deploy

## Technical Decisions & Tradeoffs

### Approach

Built this as a functional MVP in ~3 hours. Focused on getting core features working rather than polish. Started with the API integration, then built out the UI components, and added persistence last.

### Assumptions

- Users will primarily use this on desktop (minimal mobile optimization)
- TMDB API rate limits won't be an issue for personal use
- Browser supports modern JavaScript (ES6+, fetch API)
- localStorage is acceptable for the baseline requirement
- Users want to track favorites locally, not share across devices

### API Proxy

Used Next.js API routes to proxy TMDB requests. This keeps the API key secure on the server rather than exposing it in client code.

### State Management

Used React hooks (`useState`, custom `useFavorites` hook) instead of Redux/Zustand. The app's state is simple enough that a full state management library would be overkill.

### LocalStorage Persistence

Chose localStorage for the baseline requirement. It's instant to set up and requires no backend infrastructure. For production, I'd add a database with user authentication for cross-device sync.

### Modal vs Page

Used a modal for movie details instead of a separate route. Better UX for browsing—maintains search context and feels faster. Tradeoff is you can't share direct links to specific movies.

### TypeScript

Used TypeScript throughout for type safety and better developer experience, even though it adds slight overhead to initial development.

## Known Limitations & Future Improvements

### Current Limitations

- Favorites only stored locally (no cross-device sync)
- No pagination (shows first 20 results only)
- Basic error messages
- No search filters (genre, year, rating)

### With More Time

- Add database for server-side persistence
- Implement user authentication
- Add pagination or infinite scroll
- Better error handling with retry logic
- Loading skeletons instead of simple "Loading..." text
- Search filters and sorting options
- Unit and E2E tests

Movie data provided by [TMDB](https://www.themoviedb.org/)
