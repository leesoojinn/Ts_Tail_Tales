import React from "react";
import { supabase } from "../../supabase";
import { AnimalShelter } from "../../api/fetchData";
import { FaHeart } from "react-icons/fa";
import Swal from "sweetalert2";
import * as S from "../../styles/components/favorite/style.favoritebutton";

interface FavoriteButtonProps {
  item: AnimalShelter; // 즐겨찾기할 항목 정보
  isLoggedIn: boolean; // 사용자 로그인 상태
  isFavorite: boolean; // 항목이 즐겨찾기된 상태인지 여부
  onToggleFavorite: () => void; // 즐겨찾기 토글 함수
  onRemoveFavorite?: () => void; // 즐겨찾기 제거 함수 (옵셔널)
}

function FavoriteButton({
  item,
  isLoggedIn,
  isFavorite,
  onToggleFavorite,
  onRemoveFavorite,
}: FavoriteButtonProps) {
  // 즐겨찾기 버튼 클릭 처리 함수
  const handleToggleFavorite = async (event: React.MouseEvent) => {
    event.stopPropagation(); // 이벤트 전파 중단

    // 사용자가 로그인하지 않은 경우 경고 메시지 표시
    if (!isLoggedIn) {
      Swal.fire({
        icon: "info",
        title: "Alert가 실행되었습니다.",
        text: "이곳은 내용이 나타나는 곳입니다.",
      });
      return;
    }

    try {
      // 사용자 정보 가져오기
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      // 사용자 정보 가져오기 중 오류 처리
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

      // 사용자 ID를 찾을 수 없는 경우 오류 처리
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

      // 기존 즐겨찾기 여부 확인
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

      if (existingFavorites && existingFavorites.length > 0) {
        // 이미 즐겨찾기된 경우 해당 항목을 즐겨찾기 목록에서 삭제
        const { error: deleteError } = await supabase
          .from("favorites")
          .delete()
          .eq("userId", userId)
          .eq("animalId", item.ABDM_IDNTFY_NO);

        // 삭제 중 오류 처리
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
        // 즐겨찾기되지 않은 경우 해당 항목을 즐겨찾기 목록에 추가
        const { error: addError } = await supabase.from("favorites").upsert({
          userId: userId,
          animalId: item.ABDM_IDNTFY_NO,
          isFavorite: true,
          email: user.email,
        });

        if (addError) {
          // 추가 중 오류 처리
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
      // 즐겨찾기 전환 중 오류 처리
      Swal.fire({
        position: "center",
        icon: "error",
        title: "즐겨찾기 전환 중 오류 발생",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 3000,
      });
    }
    // 즐겨찾기 상태를 토글하고 업데이트 함수 호출
    onToggleFavorite();
  };

  return (
    <S.HeartBtn onClick={handleToggleFavorite}>
      {/* 즐겨찾기 아이콘 표시 */}
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
