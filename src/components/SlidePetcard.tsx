// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { formatDate, AnimalShelter } from "../api/fetchData";
// import styled from "styled-components";
// import FavoriteButton from "./FavoriteButton ";
// import { supabase } from "../supabase";
// export interface SlidePetCardProps {
//   item: AnimalShelter; // 이 부분에서 item의 타입을 AnimalShelter로 지정
//   onRemoveFavorite?: () => void;
// }
// const SlidePetcard = React.memo(
//   ({ item, onRemoveFavorite }: SlidePetCardProps) => {
//     const navigate = useNavigate();
//     const [isFavorite, setIsFavorite] = useState(false);
//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const user = JSON.parse(sessionStorage.getItem("user") || "");
//           const { id: userId } = user;
//           // 서버에서 즐겨찾기 상태 가져오기
//           const { data: existingFavorites, error: existingFavoritesError } =
//             await supabase
//               .from("favorites")
//               .select()
//               .eq("userId", userId)
//               .eq("animalId", item.ABDM_IDNTFY_NO);
//           if (existingFavoritesError) {
//             alert("기존 즐겨찾기를 가져오는 중 오류 발생");
//             return;
//           }
//           setIsFavorite(existingFavorites && existingFavorites.length > 0);
//         } catch (error) {
//           alert("즐겨찾기를 불러오는 중 오류 발생");
//         }
//       };
//       fetchData();
//     }, [item.ABDM_IDNTFY_NO]);
//     const handleToggleFavorite = () => {
//       setIsFavorite((prevIsFavorite) => !prevIsFavorite);
//     };
//     return (
//       <ImgContainer>
//         <div
//           onClick={() =>
//             navigate(`/detail/${item.ABDM_IDNTFY_NO}`, {
//               state: { item },
//             })
//           }
//         >
//           <div className="favorite-container">
//             <FavoriteButton
//               item={item}
//               isLoggedIn={true}
//               isFavorite={isFavorite}
//               onToggleFavorite={handleToggleFavorite}
//               onRemoveFavorite={() => {
//                 if (item.ABDM_IDNTFY_NO && onRemoveFavorite) {
//                   onRemoveFavorite();
//                 }
//               }}
//             />
//             {/* <p className="number">{item.ABDM_IDNTFY_NO}</p> */}
//           </div>
//           <Img className="petimg" src={item.IMAGE_COURS} alt="Pet Thumbnail" />
//           <ImageCaption>
//             <p>{formatDate(item.RECEPT_DE)}</p>
//             <p>{item.SPECIES_NM}</p>
//             {/* <p>성별 : {item.SEX_NM}</p> */}
//             {/* <p>발견장소 : {item.DISCVRY_PLC_INFO} </p> */}
//             {/* <p>특징: {item.SFETR_INFO}</p> */}
//             {/* <p>상태: {item.STATE_NM}</p> */}
//             <p>{item.SIGUN_NM} </p>
//           </ImageCaption>
//           <DetailsMessage className="details-message">
//             눌러서 상세를 보세요!!
//           </DetailsMessage>
//         </div>
//       </ImgContainer>
//     );
//   }
// );
// export default SlidePetcard;

// const ImgContainer = styled.div`
//   position: relative;
//   cursor: pointer;
//   transition: transform 0.5s ease; /* 추가: 변환 애니메이션 효과 */
//   &:hover {
//     transform: scale(1.05); /* 추가: 마우스 오버 시 크기 조정 */
//   }
// `;
// const Img = styled.img`
//   width: 270px;
//   height: 350px;
//   // width: 232px;
//   // height: 247px;
//   object-fit: cover;
// `;
// const ImageCaption = styled.p`
//   color: black;
//   position: absolute;
//   bottom: 0;
//   left: 0;
//   right: 0;
//   margin-bottom: 60px;
//   padding-bottom: 5px;
//   background-color: rgba(255, 255, 255, 0.8);
//   font-weight: bold;
//   text-align: center;
// `;
// const PetImg = styled.img`
//   width: 100%;
//   height: 250px;
//   max-width: 500px;
//   object-fit: cover;
//   &:hover {
//     filter: brightness(110%);
//   }
// `;
// const Box = styled.div`
//   height: 550px;
//   padding: 10px 10px 10px 10px;
//   border: 1px solid black;
//   width: calc(33.33% - 10px);
//   padding: 10px;
//   margin-bottom: 20px;
//   flex: 0 0 300px; /* flex-basis도 고정된 값으로 설정 */
//   box-sizing: border-box;
//   background-color: white;
//   border-radius: 20px;
//   border: none;
//   box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
//   overflow: hidden;
//   /* hover 상태에 대한 스타일 설정 */
//   &:hover {
//     .details-message {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   }
//   .favorite-container {
//     display: flex;
//     align-items: center;
//   }
//   .number {
//     margin-left: 10px;
//     font-weight: bold;
//     font-size: larger;
//   }
//   .petimg {
//     border-radius: 20px;
//   }
// `;
// const DetailsMessage = styled.p`
//   display: block;
//   text-align: center;
//   margin-top: 30px;
//   font-size: 14px;
//   color: #555;
//   opacity: 0;
//   transform: translateY(-10px);
//   transition: opacity 0.3s, transform 0.3s;
//   /* hover 상태에 대한 스타일 설정 */
//   .petcard:hover & {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `;
