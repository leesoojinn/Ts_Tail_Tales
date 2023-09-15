import React from "react";
import { supabase } from "../../supabase";
import { AnimalShelter } from "../../api/fetchData";
import { FaHeart } from "react-icons/fa";
import Swal from "sweetalert2";
import * as S from "../../styles/components/favorite/style.favoritebutton";

interface FavoriteButtonProps {
  item: AnimalShelter;
  isLoggedIn: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRemoveFavorite?: () => void;
}

function FavoriteButton({ item, isLoggedIn, isFavorite, onToggleFavorite, onRemoveFavorite }: FavoriteButtonProps) {
  const handleToggleFavorite = async (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!isLoggedIn) {
      Swal.fire({
        icon: "info",
        title: "Alert가 실행되었습니다.",
        text: "이곳은 내용이 나타나는 곳입니다.",
      });
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        Swal.fire({
          icon: "warning",
          title: "알림",
          text: "로그인 후 즐겨찾기를 이용해주세요.",
        });
        return;
      }

      const user = userData?.user;
      const userId = user?.id;

      if (!userId) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "사용자의 ID를 찾을 수 없습니다.",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 3000,
        });
        return;
      }

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

      if (existingFavorites && existingFavorites.length > 0) {
        const { error: deleteError } = await supabase.from("favorites").delete().eq("userId", userId).eq("animalId", item.ABDM_IDNTFY_NO);

        if (deleteError) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "즐겨찾기 삭제 중 오류 발생",
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3000,
          });
          return;
        }
        if (onRemoveFavorite) {
          onRemoveFavorite();
        }
      } else {
        const { error: addError } = await supabase.from("favorites").upsert({
          userId: userId,
          animalId: item.ABDM_IDNTFY_NO,
          isFavorite: true,
          email: user.email,
        });

        if (addError) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "즐겨찾기 추가 중 오류 발생",
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3000,
          });
          return;
        }
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "즐겨찾기 전환 중 오류 발생",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 3000,
      });
    }

    onToggleFavorite();
  };

  return (
    <S.HeartBtn onClick={handleToggleFavorite}>
      {isFavorite ? (
        <FaHeart
          style={{
            color: "#ff4828",
          }}
        />
      ) : (
        <FaHeart
          style={{
            color: "rgba(87, 76, 76, 0.3)",
          }}
        />
      )}
    </S.HeartBtn>
  );
}

export default FavoriteButton;
