import React, { createContext, useContext, useState } from "react";

// 동물 보호소 정보를 나타내는 인터페이스
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
  isFavorite?: boolean; // 즐겨찾기 상태 여부
}

// 즐겨찾기 관련 컨텍스트 값을 정의하는 인터페이스
interface FavoritesContextValue {
  favorites: AnimalShelter[]; // 즐겨찾기된 동물 보호소 목록
  toggleFavorite: (item: AnimalShelter) => void; // 즐겨찾기 토글 함수
}

// 즐겨찾기 관련 컨텍스트 생성
const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

// 즐겨찾기 컨텍스트를 사용하기 위한 커스텀 훅
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

// 즐겨찾기 관련 컨텍스트를 제공하는 프로바이더 컴포넌트
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<AnimalShelter[]>([]); // 즐겨찾기된 동물 보호소 목록을 관리하는 상태

  // 동물 보호소를 즐겨찾기에 추가하거나 제거하는 함수
  function toggleFavorite(item: AnimalShelter) {
    setFavorites((prevFavorites) => {
      // 해당 동물 보호소가 이미 즐겨찾기에 있는지 확인
      const isFavorite = prevFavorites.some(
        (favItem) => favItem.abdmIdntfyNo === item.abdmIdntfyNo
      );

      if (isFavorite) {
        // 이미 즐겨찾기에 있는 경우, 해당 동물 보호소를 즐겨찾기 목록에서 제거
        return prevFavorites.filter(
          (favItem) => favItem.abdmIdntfyNo !== item.abdmIdntfyNo
        );
      } else {
        // 즐겨찾기에 없는 경우, 해당 동물 보호소를 즐겨찾기 목록에 추가
        return [...prevFavorites, item];
      }
    });
  }

  // 컨텍스트의 값 설정
  const contextValue: FavoritesContextValue = {
    favorites,
    toggleFavorite,
  };

  // 자식 컴포넌트에 컨텍스트 값을 제공
  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}
