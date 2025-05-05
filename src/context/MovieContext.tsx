"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { fetchMovies, fetchMovieDetails, type Movie, type MovieDetails } from "@/lib/api"

interface MovieContextProps {
  // General movie list states
  movies: Movie[]
  error: string | null
  isLoading: boolean
  fetchMoviesData: (searchQuery: string) => Promise<void>
  searchStatus: "initial" | "tooShort" | "noResults" | "hasResults" | "error"

  // Individual movie states
  movie: MovieDetails | null
  movieError: string | null
  movieLoading: boolean
  fetchMovieData: (id: string) => Promise<void>

  // Favorite movies
  fetchFavoriteMovies: (favoriteIds: string[]) => Promise<MovieDetails[]>

  // Clear states
  clearMovieData: () => void
}

const MovieContext = createContext<MovieContextProps | undefined>(undefined)

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // States for movie list
  const [movies, setMovies] = useState<Movie[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchStatus, setSearchStatus] = useState<"initial" | "tooShort" | "noResults" | "hasResults" | "error">(
    "initial",
  )

  // States for individual movie
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [movieError, setMovieError] = useState<string | null>(null)
  const [movieLoading, setMovieLoading] = useState<boolean>(false)

  const fetchMoviesData = useCallback(async (searchQuery = "") => {
    // Reset states
    setIsLoading(true)
    setError(null)

    // Trim the search query
    const trimmedQuery = searchQuery.trim()

    // If query is empty, reset and return
    if (!trimmedQuery) {
      setMovies([])
      setIsLoading(false)
      setSearchStatus("initial")
      return
    }

    // If query is too short (1-2 characters), ask for more specific terms
    if (trimmedQuery.length < 3) {
      setIsLoading(false)
      setMovies([])
      setSearchStatus("tooShort")
      return
    }

    try {
      const fetchedMovies = await fetchMovies(trimmedQuery)

      if (fetchedMovies.length === 0) {
        setSearchStatus("noResults")
      } else {
        setSearchStatus("hasResults")
      }

      setMovies(fetchedMovies.slice(0, 50)) // Limit the number of movies displayed
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch movies.")
      setSearchStatus("error")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch individual movie details by ID
  const fetchMovieData = useCallback(async (id: string) => {
    if (!id) {
      setMovie(null)
      setMovieError("Movie ID is required")
      return
    }

    console.log("Fetching movie with ID:", id)
    setMovieLoading(true)
    setMovieError(null)

    try {
      const movieDetails = await fetchMovieDetails(id)
      console.log("Fetched movie details:", movieDetails)
      setMovie(movieDetails)
    } catch (err) {
      console.error("Error fetching movie:", err)
      setMovieError(err instanceof Error ? err.message : "Failed to fetch movie details.")
    } finally {
      setMovieLoading(false)
    }
  }, [])

  // Fetch details for favorite movies
  const fetchFavoriteMovies = useCallback(async (favoriteIds: string[]): Promise<MovieDetails[]> => {
    try {
      const favoriteMovies = await Promise.all(favoriteIds.map((id) => fetchMovieDetails(id)))
      return favoriteMovies
    } catch (err) {
      console.error("Error fetching favorite movies:", err)
      throw new Error(err instanceof Error ? err.message : "Failed to fetch favorite movies.")
    }
  }, [])

  // Clear movie data
  const clearMovieData = useCallback(() => {
    setMovie(null)
    setMovieError(null)
  }, [])

  return (
    <MovieContext.Provider
      value={{
        movies,
        error,
        isLoading,
        fetchMoviesData,
        searchStatus,
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
  )
}

export const useMovie = () => {
  const context = useContext(MovieContext)
  if (!context) {
    throw new Error("useMovie must be used within a MovieProvider.")
  }
  return context
}
