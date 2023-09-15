import React, { useState, useEffect } from "react";
import { AnimalShelter, fetchAnimalData } from "../api/fetchData";
import PetCard from "../components/petcards/Petcard";
import { supabase } from "../supabase";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import usePageHook from "../hooks/pageHook";
import Swal from "sweetalert2";
import MyProfile from "../components/MyProfile";
import * as S from "../styles/pages/style.mypage";

function Mypage() {
  const [userEmail, setUserEmail] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userMetadata, setUserMetadata] = useState({ user_profile: "" });
  const [favoriteAnimals, setFavoriteAnimals] = useState<AnimalShelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentPage, setCurrentPage, indexOfLastItem, indexOfFirstItem, itemsPerPage } = usePageHook(3);
  const navigate = useNavigate();
  const currentFavoriteAnimals = favoriteAnimals.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const getUserInfo = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;
      const email = user?.email;
      const nickname = user?.user_metadata.name || user?.user_metadata.user_name;
      const avatar = user?.user_metadata.avatar_url;
      const user_profile = user?.user_metadata.user_profile;
      setUserEmail(email || "");
      setUserNickname(nickname || "");
      setUserAvatar(avatar || "");
      setUserMetadata({ user_profile });
    };
    getUserInfo();
  }, []);
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

        const { data: favoriteData, error: favoriteError } = await supabase.from("favorites").select("animalId").eq("email", userEmail);

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

        const favoriteAnimalsWithEmail = fetchedData.filter((item: any) => favoriteAnimalIds.includes(item.ABDM_IDNTFY_NO));

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

  const removeFavorite = (animalId: string) => {
    setFavoriteAnimals((prevFavorites) => prevFavorites.filter((item) => item.ABDM_IDNTFY_NO !== animalId));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const { data, error } = await supabase.storage.from("image/profiles").upload(`${userEmail}/${file.name}`, file, { upsert: true });
        if (error) {
          console.error("프로필 사진 업로드 오류:", error);
          return;
        }
        const imagePath = `https://livvtclsfcwcjiljzxhh.supabase.co/storage/v1/object/public/image/profiles/${userEmail}/${file.name}`;
        setUserAvatar(imagePath);

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("사용자 정보 가져오기 오류:", userError);
          return;
        }

        const userMetadata = userData.user || {};

        userMetadata.user_metadata.user_profile = imagePath;

        const { data: updateddata, error: uadatederror } = await supabase.auth.updateUser({
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
          {userAvatar ? <S.AvatarImage src={userAvatar} alt="User Avatar" /> : <MyProfile />}

          <div style={{ display: userMetadata.user_profile ? "block" : "none" }}>
            <label className="input-file-button" htmlFor="input-file">
              프로필 변경
            </label>
          </div>
          <input type="file" id="input-file" onChange={handleAvatarChange} style={{ display: "none" }} />

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
          {!loading && <Pagination currentPage={currentPage} totalPages={Math.ceil(favoriteAnimals.length / itemsPerPage)} setCurrentPage={setCurrentPage} />}
        </S.RightContent>
      </S.ContentContainer>
    </S.MyPage>
  );
}
export default Mypage;
