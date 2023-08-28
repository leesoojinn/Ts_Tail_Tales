import React, { createContext, useContext, useState } from "react";

export interface AnimalShelter {
  RECEPT_DE: string;
  SHTER_NM: string;
  ServiceKey: string;
  PBLANC_IDNTFY_NO: string | undefined;
  response: any;
  SFETR_INFO: string;
  DISCVRY_PLC_INFO: string;
  SPECIES_NM: string;
  SEX_NM: string;
  IMAGE_COURS: any;
  STATE_NM: string;
  ABDM_IDNTFY_NO: string | undefined;
  SIGUN_NM: string;
  PBLANC_END_DE: string;
  isFavorite?: boolean;
}

interface FavoritesContextValue {
  favorites: AnimalShelter[];
  toggleFavorite: (item: AnimalShelter) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

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
    const isFavorite = favorites.some(
      (favItem) => favItem.ABDM_IDNTFY_NO === item.ABDM_IDNTFY_NO
    );

    if (isFavorite) {
      setFavorites(
        favorites.filter(
          (favItem) => favItem.ABDM_IDNTFY_NO !== item.ABDM_IDNTFY_NO
        )
      );
    } else {
      setFavorites([...favorites, item]);
    }
  }

  const contextValue: FavoritesContextValue = {
    favorites,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}
