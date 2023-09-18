import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, AnimalShelter } from "../../api/fetchData";
import FavoriteButton from "../favorite/FavoriteButton ";
import { supabase } from "../../supabase";
import Swal from "sweetalert2";
import * as S from "../../styles/components/petcards/style.sliderpetcard";

// SlidePetCardProps는 SlidePetCard 컴포넌트의 속성을 정의하는 인터페이스입니다.
export interface SlidePetCardProps {
  item: AnimalShelter; // item은 AnimalShelter 타입의 객체입니다.
  onRemoveFavorite?: () => void; // 즐겨찾기 제거 함수를 전달받을 수 있습니다.
}

const SlidePetcard = React.memo(
  ({ item, onRemoveFavorite }: SlidePetCardProps) => {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false); // 즐겨찾기 상태를 관리하는 상태 변수입니다.

    useEffect(() => {
      // 컴포넌트가 마운트될 때 즐겨찾기 상태를 설정합니다.
      const fetchData = async () => {
        try {
          const user = JSON.parse(sessionStorage.getItem("user") || ""); // 세션 스토리지에서 사용자 정보를 가져옵니다.
          const { id: userId } = user; // 사용자 아이디를 추출합니다.

          // 사용자의 아이디와 동물 ID를 이용하여 즐겨찾기 정보를 조회합니다.
          const { data: existingFavorites, error: existingFavoritesError } =
            await supabase
              .from("favorites")
              .select()
              .eq("userId", userId)
              .eq("animalId", item.ABDM_IDNTFY_NO);
          if (existingFavoritesError) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "기존 즐겨찾기를 가져오는 중 오류 발생",
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 3000,
            });
            return;
          }

          // 즐겨찾기 정보가 존재하면 true, 아니면 false로 설정합니다.
          setIsFavorite(existingFavorites && existingFavorites.length > 0);
        } catch (error) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "즐겨찾기를 불러오는 중 오류 발생",
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3000,
          });
        }
      };
      fetchData();
    }, [item.ABDM_IDNTFY_NO]); // item.ABDM_IDNTFY_NO가 변경될 때마다 useEffect가 호출됩니다.

    const handleToggleFavorite = () => {
      // 즐겨찾기 상태를 토글합니다.
      setIsFavorite((prevIsFavorite) => !prevIsFavorite);
    };

    return (
      <S.ImgContainer>
        <div
          onClick={() =>
            navigate(`/detail/${item.ABDM_IDNTFY_NO}`, {
              state: { item },
            })
          }
        >
          <div className="favorite-container">
            {/* FavoriteButton 컴포넌트를 렌더링하고, 필요한 속성들을 전달합니다. */}
            <FavoriteButton
              item={item}
              isLoggedIn={true}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              onRemoveFavorite={() => {
                if (item.ABDM_IDNTFY_NO && onRemoveFavorite) {
                  onRemoveFavorite();
                }
              }}
            />
          </div>
          {/* 반려동물 썸네일 이미지를 표시합니다. */}
          <S.Img
            className="petimg"
            src={item.IMAGE_COURS}
            alt="Pet Thumbnail"
          />
          {/* 반려동물 정보를 표시합니다. */}
          <S.ImageCaption>
            <p>{formatDate(item.RECEPT_DE)}</p>
            <p>{item.SPECIES_NM}</p>
            <p>{item.SIGUN_NM} </p>
          </S.ImageCaption>
          {/* 자세히 보기 링크를 표시합니다. */}
          <S.DetailsMessage className="details-message">
            눌러서 상세를 보세요!!
          </S.DetailsMessage>
        </div>
      </S.ImgContainer>
    );
  }
);
export default SlidePetcard;
