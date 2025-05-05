"use client";

import { useEffect, useState } from "react";
import { useMovie } from "@/context/MovieContext";
import { useFavorites } from "@/context/FavoritesContext";
import { MovieGrid } from "@/components/MovieGrid";
import type { MovieDetails } from "@/lib/api";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Favourites() {
  const { fetchFavoriteMovies } = useMovie();
  const { favorites } = useFavorites();
  const [favoriteMovies, setFavoriteMovies] = useState<MovieDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all favorite movies by their IDs when the component mounts or favourites change
  useEffect(() => {
    async function loadFavoriteMovies() {
      if (favorites.length === 0) {
        setFavoriteMovies([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch details for all favorite movies
        const movies = await fetchFavoriteMovies(favorites);
        setFavoriteMovies(movies);
      } catch (err) {
        console.error("Error loading favorite movies:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load favorite movies"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadFavoriteMovies();
  }, [favorites, fetchFavoriteMovies]);

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold mb-8">Favourites</h1>
      <SignedIn>
        {isLoading ? (
          <p>Loading your favourites...</p>
        ) : error ? (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
            <p>Error: {error}</p>
          </div>
        ) : favoriteMovies.length === 0 ? (
          <p>No favorite movies yet. Start adding some!</p>
        ) : (
          <MovieGrid
            movies={favoriteMovies}
            isLoading={false}
            error={null}
            showOnlyFavorites={true}
            favoritesEmptyMessage="You haven't added any favorites yet. Start adding some!"
          />
        )}
      </SignedIn>
      <SignedOut>
        <p>Sign up or Log In to start adding your favourite movies here!</p>
      </SignedOut>
    </div>
  );
}
