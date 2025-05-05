"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMovie } from "@/context/MovieContext";
import { useFavorites } from "@/context/FavoritesContext";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Film,
  Users,
  Award,
  Share2,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/nextjs";
import StarRating from "@/components/StarRating";

const MoviePage = () => {
  const clerk = useClerk();
  const { isSignedIn } = useUser(); // Get user's signed-in status
  const router = useRouter();
  const params = useParams();
  const id =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
      ? params.slug[0]
      : null;
  const { movie, movieLoading, movieError, fetchMovieData, clearMovieData } =
    useMovie();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchMovie = async () => {
      if (typeof id === "string") {
        await fetchMovieData(id);
      }
    };

    fetchMovie();

    return () => {
      clearMovieData();
    };
  }, [id, fetchMovieData, clearMovieData]);

  const goBack = () => {
    router.back();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      clerk.redirectToSignIn();
    }
    if (typeof id === "string") {
      toggleFavorite(id);
    }
  };

  if (movieLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="h-[450px] w-[300px] rounded-md" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (movieError) {
    return (
      <Card className="w-full max-w-md mx-auto mt-12">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>{movieError}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={goBack}>Go Back</Button>
        </CardFooter>
      </Card>
    );
  }

  if (!movie) {
    return (
      <Card className="w-full max-w-md mx-auto mt-12">
        <CardHeader>
          <CardTitle>Movie Not Found</CardTitle>
          <CardDescription>
            The movie you&apos;re looking for could not be found.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={goBack}>Go Back</Button>
        </CardFooter>
      </Card>
    );
  }

  const favorited = id ? isFavorite(id) : false;

  const ratings = movie.Ratings || [];

  return (
    <div className="relative min-h-screen -mt-16 -mx-8 pb-16 bg-background">
      <div className="absolute top-20 left-8 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-sm bg-background cursor-pointer"
          onClick={goBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative w-full h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          {movie.Poster && movie.Poster !== "N/A" ? (
            <Image
              src={movie.Poster || "/placeholder.svg"}
              alt={movie.Title}
              fill
              className="object-cover object-center opacity-10"
              priority
            />
          ) : (
            <div className="w-full h-full bg-muted/20"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60"></div>
        </div>

        <div className="container mx-auto h-full relative">
          <div className="absolute top-0 bottom-8 left-4 right-4 md:left-8 md:right-8 flex flex-col md:flex-row gap-8 md:text-start justify-center text-center md:items-end items-center">
            <div className="relative shrink-0 w-48 h-72 md:w-64 md:h-96 rounded-lg overflow-hidden shadow-lg border border-border">
              {movie.Poster && movie.Poster !== "N/A" ? (
                <Image
                  src={movie.Poster || "/placeholder.svg"}
                  alt={movie.Title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                  No Image Available
                </div>
              )}
            </div>

            <div className="flex-1 pb-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                {movie.Title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {movie.Year}
                </span>
                {movie.Runtime && movie.Runtime !== "N/A" && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {movie.Runtime}
                  </span>
                )}
                {movie.Rated && movie.Rated !== "N/A" && (
                  <Badge variant="outline" className="text-foreground">
                    {movie.Rated}
                  </Badge>
                )}
              </div>

              {ratings.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-6">
                  {ratings.map((rating, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <div>
                        <span className="font-bold text-foreground">
                          {rating.Value}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">
                          ({rating.Source})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <StarRating />

              {movie.Genre && movie.Genre !== "N/A" && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.Genre.split(", ").map((genre) => (
                    <Badge
                      key={genre}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-6">
                <Button
                  variant={favorited && isSignedIn ? "default" : "outline"}
                  onClick={handleClick}
                  className={cn(
                    favorited &&
                      isSignedIn &&
                      "bg-red-500 hover:bg-red-600 border-red-500"
                  )}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 mr-2",
                      favorited && isSignedIn ? "fill-white" : "text-red-500"
                    )}
                  />
                  {favorited && isSignedIn
                    ? "Favourited!"
                    : "Add to Favourites"}
                </Button>
                <Button variant="outline" size="default">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Plot</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-foreground">
                  {movie.Plot && movie.Plot !== "N/A"
                    ? movie.Plot
                    : "No plot available."}
                </p>
              </CardContent>
            </Card>

            {movie.Awards && movie.Awards !== "N/A" && (
              <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/10">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <Award className="h-5 w-5 text-amber-500" />
                    Awards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{movie.Awards}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5 text-primary" />
                  Director
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  {movie.Director && movie.Director !== "N/A"
                    ? movie.Director
                    : "Unknown"}
                </p>
              </CardContent>
            </Card>

            {movie.Writer && movie.Writer !== "N/A" && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Writers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{movie.Writer}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Cast
                </CardTitle>
              </CardHeader>
              <CardContent>
                {movie.Actors && movie.Actors !== "N/A" ? (
                  <ul className="space-y-2">
                    {movie.Actors.split(", ").map((actor) => (
                      <li
                        key={actor}
                        className="flex items-center gap-2 text-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        {actor}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-foreground">Unknown</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-3">
                {movie.Language && movie.Language !== "N/A" && (
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">
                      Language
                    </span>
                    <span className="text-muted-foreground">
                      {movie.Language}
                    </span>
                  </div>
                )}
                {movie.Country && movie.Country !== "N/A" && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">
                        Country
                      </span>
                      <span className="text-muted-foreground">
                        {movie.Country}
                      </span>
                    </div>
                  </>
                )}
                {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">
                        Box Office
                      </span>
                      <span className="text-muted-foreground">
                        {movie.BoxOffice}
                      </span>
                    </div>
                  </>
                )}
                {movie.Production && movie.Production !== "N/A" && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">
                        Production
                      </span>
                      <span className="text-muted-foreground">
                        {movie.Production}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
