"use client"

import { useEffect } from "react"
import { useSearchQuery } from "@/context/SearchQueryContext"
import { useMovie } from "@/context/MovieContext"
import { MovieGrid } from "@/components/MovieGrid"

const HomePage = () => {
  const { searchQuery } = useSearchQuery()
  const { movies, isLoading, error, fetchMoviesData } = useMovie()

  useEffect(() => {
    fetchMoviesData(searchQuery)
  }, [searchQuery, fetchMoviesData])

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold mb-8">Movies</h1>
      {!searchQuery.trim() ? (
        <p className="text-gray-600">Start a search to see movies.</p>
      ) : (
        <MovieGrid
          movies={movies}
          isLoading={isLoading}
          error={error}
          emptyMessage="No movies found. Try a different search."
        />
      )}
    </div>
  )
}

export default HomePage
