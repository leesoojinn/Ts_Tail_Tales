import React, { createContext, useContext, useState } from "react";

export interface AnimalShelter {
  receptDe: string;
  shterNm: string;
  serviceKey: string;
  pblancIdntfyNo: string | undefined;
  response: string;
  sfetrInfo: string;
  discvryPlcInfo: string;
  speciesNm: string;
  sexNm: string;
  imageCours: string;
  stateNm: string;
  abdmIdntfyNo: string | undefined;
  sigunNm: string;
  pblancEndDe: string;
  isFavorite?: boolean;
}

interface FavoritesContextValue {
  favorites: AnimalShelter[];
  toggleFavorite: (item: AnimalShelter) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<AnimalShelter[]>([]);

  function toggleFavorite(item: AnimalShelter) {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((favItem) => favItem.abdmIdntfyNo === item.abdmIdntfyNo);

      if (isFavorite) {
        return prevFavorites.filter((favItem) => favItem.abdmIdntfyNo !== item.abdmIdntfyNo);
      } else {
        return [...prevFavorites, item];
      }
    });
  }

  const contextValue: FavoritesContextValue = {
    favorites,
    toggleFavorite,
  };

  return <FavoritesContext.Provider value={contextValue}>{children}</FavoritesContext.Provider>;
}
