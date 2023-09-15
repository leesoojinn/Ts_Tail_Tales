import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, AnimalShelter } from "../../api/fetchData";
import FavoriteButton from "../favorite/FavoriteButton ";
import { supabase } from "../../supabase";
import * as S from "../../styles/components/petcards/style.petcard";

export interface PetCardProps {
  item: AnimalShelter;
  onRemoveFavorite?: () => void;
}

const PetCard = React.memo(({ item, onRemoveFavorite }: PetCardProps) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user") || "");
        const { id: userId } = user;
        const { data: existingFavorites, error: existingFavoritesError } = await supabase.from("favorites").select().eq("userId", userId).eq("animalId", item.ABDM_IDNTFY_NO);
        if (existingFavoritesError) {
          return;
        }
        setIsFavorite(existingFavorites && existingFavorites.length > 0);
      } catch (error) {}
    };
    fetchData();
  }, [item.ABDM_IDNTFY_NO]);

  const handleToggleFavorite = () => {
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
  };

  return (
    <S.Box>
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
        <S.PetImg
          className="petimg"
          src={item.IMAGE_COURS || "/image/header/profile.jpg"}
          alt="Pet Thumbnail"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const imgElement = e.currentTarget;
            imgElement.src = "/image/header/profile.jpg";
          }}
        />{" "}
        <S.InfoContainer>
          <S.Text>품종 : {item.SPECIES_NM}</S.Text>
          <br />
          <S.Text>접수 일지 : {formatDate(item.RECEPT_DE)}</S.Text>
          <br />
          <S.Text>보호 주소: {item.SIGUN_NM} </S.Text>
          <br />
          <S.Text>성별 : {item.SEX_NM}</S.Text>
        </S.InfoContainer>
        <S.DetailsMessage className="details-message">클릭해서 자세히 보기!!</S.DetailsMessage>
      </div>
    </S.Box>
  );
});
export default PetCard;
