import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, AnimalShelter } from "../api/fetchData";
import styled from "styled-components";
import FavoriteButton from "./FavoriteButton ";
import { supabase } from "../supabase";
export interface PetCardProps {
  item: AnimalShelter; // 이 부분에서 item의 타입을 AnimalShelter로 지정
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
        // 서버에서 즐겨찾기 상태 가져오기
        const { data: existingFavorites, error: existingFavoritesError } = await supabase.from("favorites").select().eq("userId", userId).eq("animalId", item.ABDM_IDNTFY_NO);
        if (existingFavoritesError) {
          // alert("기존 즐겨찾기 목록 가져오는 중 오류");
          return;
        }
        setIsFavorite(existingFavorites && existingFavorites.length > 0);
      } catch (error) {
        // alert("즐겨찾기 목록 가져오는 중 오류");
      }
    };
    fetchData();
  }, [item.ABDM_IDNTFY_NO]);
  const handleToggleFavorite = () => {
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
  };

  return (
    <Box>
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
          {/* <p className="number">{item.ABDM_IDNTFY_NO}</p>공고번호 */}
        </div>
        <PetImg
          className="petimg"
          src={item.IMAGE_COURS || "/image/header/profile.jpg"}
          alt="Pet Thumbnail"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const imgElement = e.currentTarget;
            imgElement.src = "/image/header/profile.jpg";
          }}
        />{" "}
        <InfoContainer>
          <Text>품종 : {item.SPECIES_NM}</Text>
          <br />
          <Text>접수 일지 : {formatDate(item.RECEPT_DE)}</Text>
          <br />
          <Text>보호 주소: {item.SIGUN_NM} </Text>
          <br />
          <Text>성별 : {item.SEX_NM}</Text>
        </InfoContainer>
        {/* <p>발견장소 : {item.DISCVRY_PLC_INFO} </p> */}
        {/* <p>특징: {item.SFETR_INFO}</p> */}
        {/* <p>상태: {item.STATE_NM}</p> */}
        <DetailsMessage className="details-message">클릭해서 자세히 보기!!</DetailsMessage>
      </div>
    </Box>
  );
});
export default PetCard;
// const ImgContainer = styled.div`
//   position: relative;
//   cursor: pointer;
// `;
// const Img = styled.img`
//   width: 300px;
//   height: 200px;
//   border-radius: 20px;
//   object-fit: cover;
//   &:hover {
//     filter: brightness(110%);
//   }
// `;

const PetImg = styled.img`
  width: 250px;
  height: 200px;
  object-fit: cover;
  object-position: center;
  margin-left: 11px;
  &:hover {
    filter: brightness(110%);
  }
`;

const Box = styled.div`
  height: 450px;
  padding: 10px 10px 10px 10px;
  width: calc(33.33% - 10px);
  padding: 10px;
  flex: 0 0 300px;
  box-sizing: border-box;
  // background-color: rgba(253, 250, 246, 0.8);
  background-color: white;
  border-radius: 20px;
  border: none;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5); /* 유리 효과 추가 */
  overflow: hidden;
  /* transform: scale(0.8); */

  &:hover {
    .details-message {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .favorite-container {
    display: flex;
    align-items: center;
  }

  .number {
    margin-left: 10px;
    font-weight: bold;
    font-size: larger;
  }

  .petimg {
    border-radius: 20px;
  }
`;

const DetailsMessage = styled.p`
  display: block;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #555;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s, transform 0.3s;

  .petcard:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const InfoContainer = styled.div`
  padding-top: 25px;
  margin-left: 15px;
  line-height: 1.5;
  font-family: "NanumSquareNeo-Regular";
`;

const Text = styled.p`
  margin: -7px 0;
  font-size: 17px;
  padding-left: 15px;
`;
