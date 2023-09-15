import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, AnimalShelter } from "../../api/fetchData";
import FavoriteButton from "../favorite/FavoriteButton ";
import { supabase } from "../../supabase";
import Swal from "sweetalert2";
import * as S from "../../styles/components/petcards/style.sliderpetcard";

export interface SlidePetCardProps {
  item: AnimalShelter;
  onRemoveFavorite?: () => void;
}

const SlidePetcard = React.memo(({ item, onRemoveFavorite }: SlidePetCardProps) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user") || "");
        const { id: userId } = user;
        const { data: existingFavorites, error: existingFavoritesError } = await supabase.from("favorites").select().eq("userId", userId).eq("animalId", item.ABDM_IDNTFY_NO);
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
  }, [item.ABDM_IDNTFY_NO]);

  const handleToggleFavorite = () => {
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
        <S.Img className="petimg" src={item.IMAGE_COURS} alt="Pet Thumbnail" />
        <S.ImageCaption>
          <p>{formatDate(item.RECEPT_DE)}</p>
          <p>{item.SPECIES_NM}</p>
          <p>{item.SIGUN_NM} </p>
        </S.ImageCaption>
        <S.DetailsMessage className="details-message">눌러서 상세를 보세요!!</S.DetailsMessage>
      </div>
    </S.ImgContainer>
  );
});
export default SlidePetcard;
