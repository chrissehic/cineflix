const API_BASE_URL = "http://www.omdbapi.com/"
const API_KEY = "e22c37f"

export interface Movie {
  imdbID: string
  Title: string
  Year: string
  Poster: string
}

export interface MovieDetails extends Movie {
  Plot: string
  Genre: string
  Director: string
  Actors: string
  Runtime?: string
  Rated?: string
  Writer?: string
  Language?: string
  Country?: string
  Awards?: string
  BoxOffice?: string
  Production?: string
  Ratings?: Array<{
    Source: string
    Value: string
  }>
}

export async function fetchMovies(search: string): Promise<Movie[]> {
  const res = await fetch(`${API_BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(search)}`)
  const data = await res.json()

  if (data.Response === "False") {
    throw new Error(data.Error || "Failed to fetch movies")
  }

  return data.Search
}

export async function fetchMovieDetails(imdbID: string): Promise<MovieDetails> {
  try {
    const res = await fetch(`${API_BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`)

    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status}`)
    }

    const data = await res.json()

    if (data.Response === "False") {
      throw new Error(data.Error || "Failed to fetch movie details")
    }

    return data
  } catch (error) {
    console.error("API error:", error)
    throw error
  }
}
