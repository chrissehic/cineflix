"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface SearchQueryContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchQueryContext = createContext<SearchQueryContextType | undefined>(
  undefined
);

export const useSearchQuery = () => {
  const context = useContext(SearchQueryContext);
  if (!context) {
    throw new Error("useSearchQuery must be used within a SearchQueryProvider");
  }
  return context;
};

export const SearchQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <SearchQueryContext.Provider
      value={{ searchQuery: debouncedQuery, setSearchQuery }}
    >
      {children}
    </SearchQueryContext.Provider>
  );
};
