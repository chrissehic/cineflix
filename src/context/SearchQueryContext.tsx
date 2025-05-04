"use client";
// context/SearchQueryContext.tsx
import React, { createContext, useContext, useState } from "react";

// Define context and types
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

  return (
    <SearchQueryContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchQueryContext.Provider>
  );
};
