import React, { useState, useEffect } from "react";
import { AnimalShelter, fetchAnimalData } from "../api/fetchData"; // API 호출 및 데이터 타입 관련 모듈 가져오기
import PetCard from "../components/petcards/Petcard"; // 반려동물 카드 컴포넌트 가져오기
import { supabase } from "../supabase"; // Supabase 관련 모듈 가져오기
import Pagination from "../components/Pagination"; // 페이지네이션 컴포넌트 가져오기
import { useNavigate } from "react-router-dom"; // React Router의 네비게이션 기능을 사용
import usePageHook from "../hooks/pageHook"; // 페이지네이션 훅 가져오기
import Swal from "sweetalert2"; // Swal 팝업 메시지를 표시하기 위한 모듈
import MyProfile from "../components/MyProfile"; // 사용자 프로필 컴포넌트 가져오기
import * as S from "../styles/pages/style.mypage"; // 스타일 관련 컴포넌트 가져오기

function Mypage() {
  const [userEmail, setUserEmail] = useState(""); // 사용자 이메일 상태 관리
  const [userNickname, setUserNickname] = useState(""); // 사용자 닉네임 상태 관리
  const [userAvatar, setUserAvatar] = useState(""); // 사용자 아바타 이미지 URL 상태 관리
  const [userMetadata, setUserMetadata] = useState({ user_profile: "" }); // 사용자 메타데이터 상태 관리
  const [favoriteAnimals, setFavoriteAnimals] = useState<AnimalShelter[]>([]); // 즐겨찾기 동물 데이터 상태 관리
  const [loading, setLoading] = useState(false); // 데이터 로딩 상태 관리
  const [error, setError] = useState<Error | null>(null); // 오류 상태 관리
  const {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    itemsPerPage,
  } = usePageHook(3); // 페이지네이션 관련 상태 및 함수

  const navigate = useNavigate(); // React Router의 네비게이션 기능을 사용
  const currentFavoriteAnimals = favoriteAnimals.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // 사용자 정보를 가져오는 useEffect
  useEffect(() => {
    const getUserInfo = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      const user = userData?.user;
      const email = user?.email;
      const nickname =
        user?.user_metadata.name || user?.user_metadata.user_name;
      const avatar = user?.user_metadata.avatar_url;
      const user_profile = user?.user_metadata.user_profile;
      setUserEmail(email || "");
      setUserNickname(nickname || "");
      setUserAvatar(avatar || "");
      setUserMetadata({ user_profile });
    };
    getUserInfo();
  }, []);

  // API로부터 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        setError(null);
        setLoading(true);
        const fetchedData = await fetchAnimalData();

        if (favoriteAnimals.length === 0) {
          const fetchedData = await fetchAnimalData();
          setFavoriteAnimals(fetchedData);
        }

        const { data: favoriteData, error: favoriteError } = await supabase
          .from("favorites")
          .select("animalId")
          .eq("email", userEmail);

        if (favoriteError) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "사용자 즐겨찾기 항목 가져오기 오류",
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
          });
          return;
        }

        const favoriteAnimalIds = favoriteData.map((fav: any) => fav.animalId);

        const favoriteAnimalsWithEmail = fetchedData.filter((item: any) =>
          favoriteAnimalIds.includes(item.ABDM_IDNTFY_NO)
        );

        setFavoriteAnimals(favoriteAnimalsWithEmail);
      } catch (e: Error | unknown) {
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new Error("An error occurred"));
        }
      }
      setLoading(false);
    };

    if (userEmail) {
      fetchDataFromApi();
    }
  }, [userEmail]);

  // 즐겨찾기 동물을 제거하는 함수
  const removeFavorite = (animalId: string) => {
    setFavoriteAnimals((prevFavorites) =>
      prevFavorites.filter((item) => item.ABDM_IDNTFY_NO !== animalId)
    );
  };

  // 프로필 사진 변경을 처리하는 함수
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const { data, error } = await supabase.storage
          .from("image/profiles")
          .upload(`${userEmail}/${file.name}`, file, { upsert: true });
        if (error) {
          console.error("프로필 사진 업로드 오류:", error);
          return;
        }
        const imagePath = `https://livvtclsfcwcjiljzxhh.supabase.co/storage/v1/object/public/image/profiles/${userEmail}/${file.name}`;
        setUserAvatar(imagePath);

        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) {
          console.error("사용자 정보 가져오기 오류:", userError);
          return;
        }

        const userMetadata = userData.user || {};

        userMetadata.user_metadata.user_profile = imagePath;

        const { data: updateddata, error: uadatederror } =
          await supabase.auth.updateUser({
            data: { user_profile: imagePath },
          });

        Swal.fire({
          position: "center",
          icon: "success",
          title: "프로필 사진이 업로드되었습니다.",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1200,
        });
      } catch (error: any) {
        console.error("프로필 사진 업로드 중 오류:", error);
      }
    }
  };

  return (
    <S.MyPage>
      <S.StDetailText>
        <S.BackIcon
          className="backBtn"
          onClick={() => {
            navigate("/home");
          }}
        >
          〈
        </S.BackIcon>
        <h2 className="detailtext">My page</h2>
      </S.StDetailText>
      <S.ContentContainer>
        <S.LeftContent>
          <h3>Your Profile</h3>
          {userAvatar ? (
            <S.AvatarImage src={userAvatar} alt="User Avatar" />
          ) : (
            <MyProfile />
          )}

          <div
            style={{ display: userMetadata.user_profile ? "block" : "none" }}
          >
            <label className="input-file-button" htmlFor="input-file">
              프로필 변경
            </label>
          </div>
          <input
            type="file"
            id="input-file"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />

          <h4>{userNickname}님, 반가워요!</h4>
          <S.BottomText>
            동물 친구들이 당신과 함께라면,
            <br /> 언제나 활기찬 행복이 가득합니다
          </S.BottomText>
        </S.LeftContent>
        <S.RightContent>
          <h3>{userNickname}님 관심 가져주셔서 감사해요!</h3>
          {!loading ? (
            <S.Container>
              {currentFavoriteAnimals?.map((item) => (
                <PetCard
                  key={item.ABDM_IDNTFY_NO}
                  item={item}
                  onRemoveFavorite={() => {
                    if (item.ABDM_IDNTFY_NO) {
                      removeFavorite(item.ABDM_IDNTFY_NO);
                    }
                  }}
                />
              ))}
            </S.Container>
          ) : (
            <p>Loading...</p>
          )}
          {!loading && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(favoriteAnimals.length / itemsPerPage)}
              setCurrentPage={setCurrentPage}
            />
          )}
        </S.RightContent>
      </S.ContentContainer>
    </S.MyPage>
  );
}
export default Mypage;
