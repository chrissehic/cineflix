"use client";

import type React from "react";
import { createContext, useContext, useState, useCallback } from "react";
import {
  fetchMovies,
  fetchMovieDetails,
  type Movie,
  type MovieDetails,
} from "@/lib/api";

interface MovieContextProps {
  movies: Movie[];
  error: string | null;
  isLoading: boolean;
  fetchMoviesData: (searchQuery: string) => Promise<void>;

  movie: MovieDetails | null;
  movieError: string | null;
  movieLoading: boolean;
  fetchMovieData: (id: string) => Promise<void>;

  fetchFavoriteMovies: (favoriteIds: string[]) => Promise<MovieDetails[]>;

  clearMovieData: () => void;
}

const MovieContext = createContext<MovieContextProps | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [movieError, setMovieError] = useState<string | null>(null);
  const [movieLoading, setMovieLoading] = useState<boolean>(false);

  const fetchMoviesData = useCallback(async (searchQuery: string = "") => {
    setIsLoading(true);
    setError(null);
  
    try {
      const fetchedMovies = searchQuery.trim()
        ? await fetchMovies(searchQuery)
        : await fetchMovies("");
  
      setMovies(fetchedMovies.slice(0, 50));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch movies.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  

  const fetchMovieData = useCallback(async (id: string) => {
    if (!id) {
      setMovie(null);
      setMovieError("Movie ID is required");
      return;
    }

    console.log("Fetching movie with ID:", id);
    setMovieLoading(true);
    setMovieError(null);

    try {
      const movieDetails = await fetchMovieDetails(id);
      console.log("Fetched movie details:", movieDetails);
      setMovie(movieDetails);
    } catch (err) {
      console.error("Error fetching movie:", err);
      setMovieError(
        err instanceof Error ? err.message : "Failed to fetch movie details."
      );
    } finally {
      setMovieLoading(false);
    }
  }, []);

  const fetchFavoriteMovies = useCallback(
    async (favoriteIds: string[]): Promise<MovieDetails[]> => {
      try {
        const favoriteMovies = await Promise.all(
          favoriteIds.map((id) => fetchMovieDetails(id))
        );
        return favoriteMovies;
      } catch (err) {
        console.error("Error fetching favorite movies:", err);
        throw new Error(
          err instanceof Error
            ? err.message
            : "Failed to fetch favorite movies."
        );
      }
    },
    []
  );

  const clearMovieData = useCallback(() => {
    setMovie(null);
    setMovieError(null);
  }, []);

  return (
    <MovieContext.Provider
      value={{
        movies,
        error,
        isLoading,
        fetchMoviesData,
        movie,
        movieError,
        movieLoading,
        fetchMovieData,
        fetchFavoriteMovies,
        clearMovieData,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovie must be used within a MovieProvider.");
  }
  return context;
};
