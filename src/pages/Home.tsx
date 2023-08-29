import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchAnimalData, formatDate, AnimalShelter } from "../api/fetchData";
import Category from "../components/Category";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomSlider from "../components/Slider";
import Pagination from "../components/Pagination";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FavoritesProvider } from "../components/FavoritesContext";
import { supabase } from "../supabase";
function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState<Array<AnimalShelter>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [selectedBeginDate, setSelectedBeginDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  // 로그인 확인용
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 사용자의 즐겨찾기 데이터를 저장할 상태
  const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());
  console.log("조하요", userFavorites);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log({ user });
      if (user) {
        setIsLoggedIn(true);
        // 사용자의 즐겨찾기 데이터를 가져옴
        await getUserFavorites();
      }
    };
    getUser();
  }, []);
  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        setError(null);
        setLoading(true);
        const fetchedData = await fetchAnimalData();
        setData(fetchedData);
      } catch (e: Error | unknown) {
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new Error("An error occurred"));
        }
      }
      setLoading(false);
    };
    fetchDataFromApi();
  }, []);
  const handleFilter = () => {
    setCurrentPage(1);
  };
  const getUserFavorites = async () => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        console.error("Error getting user:", userError);
        return;
      }
      const user = userData?.user;
      const userId = user?.id;
      if (!userId) {
        console.error("User ID not found.");
        return;
      }
      const { data: favoritesData, error: favoritesError } = await supabase
        .from("favorites")
        .select("animalId")
        .eq("userId", userId);
      if (favoritesError) {
        console.error("Error fetching user favorites:", favoritesError);
        return;
      }
      // 사용자의 즐겨찾기 데이터를 Set으로 저장
      const userFavoriteIds = new Set(
        favoritesData.map((fav: any) => fav.animalId)
      );
      setUserFavorites(userFavoriteIds);
    } catch (error) {
      console.error("Error getting user favorites:", error);
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const nearingDeadline = data.filter((item) => {
    const today = new Date();
    const endOfNotice = new Date(formatDate(item.PBLANC_END_DE));
    const fiveDaysAfter = new Date(today);
    fiveDaysAfter.setDate(fiveDaysAfter.getDate() + 10);
    return endOfNotice <= fiveDaysAfter;
  });
  const filteredItems = data.filter((item) => {
    let matchesDate = true;
    let matchesLocation = true;
    let matchesBreed = true;
    if (selectedBeginDate && selectedEndDate) {
      matchesDate =
        formatDate(item.RECEPT_DE) >= selectedBeginDate &&
        formatDate(item.RECEPT_DE) <= selectedEndDate;
    }
    if (selectedLocation) {
      matchesLocation = item.SIGUN_NM.toLowerCase().includes(
        selectedLocation.toLowerCase()
      );
    }
    if (selectedBreed) {
      matchesBreed = item.SPECIES_NM.split("]")[0] + "]" === selectedBreed;
    }
    return matchesDate && matchesLocation && matchesBreed;
  });
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const toggleFavorite = async (item: AnimalShelter) => {
    if (!isLoggedIn) {
      alert("로그인 후 즐겨찾기를 이용해주세요.");
      return;
    }
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        console.error("Error getting user:", userError);
        return;
      }
      const user = userData?.user;
      const userId = user?.id;
      if (!userId) {
        console.error("User ID not found.");
        return;
      }
      // 데이터가 존재하는지 하지 않는지를 찾기
      const { data: existingFavorites, error: existingFavoritesError } =
        await supabase
          .from("favorites")
          .select()
          .eq("userId", userId)
          .eq("animalId", item.ABDM_IDNTFY_NO);

      if (existingFavoritesError) {
        console.error(
          "Error fetching existing favorites:",
          existingFavoritesError
        );
        return;
      }
      // 즐겨찾기에 있는 경우 삭제하기 위해서 delete 사용
      if (existingFavorites && existingFavorites.length > 0) {
        const { error: deleteError } = await supabase
          .from("favorites")
          .delete()
          .eq("userId", userId)
          .eq("animalId", item.ABDM_IDNTFY_NO);
        if (deleteError) {
          console.error("Error deleting favorite:", deleteError);
          return;
        }
      } else {
        const { error: addError } = await supabase.from("favorites").upsert({
          userId: userId,
          animalId: item.ABDM_IDNTFY_NO,
          isFavorite: true,
          email: user.email,
        });

        if (addError) {
          console.error("Error adding favorite:", addError);
          return;
        }
      }
      // 사용자의 즐겨찾기 데이터 업데이트
      await getUserFavorites();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <FavoritesProvider>
      <div className="Home">
        <div>공고 마감일이 얼마남지않은 게시물 필터링</div>
        <CustomSlider items={nearingDeadline} />
        <Category
          query={{
            PBLANC_BEGIN_DE: selectedBeginDate,
            PBLANC_END_DE: selectedEndDate,
            SIGUN_NM: selectedLocation,
            SPECIES_NM: selectedBreed,
          }}
          onChange={(e) => {
            const { name, value } = e.target;
            if (name === "PBLANC_BEGIN_DE") {
              setSelectedBeginDate(value);
            } else if (name === "PBLANC_END_DE") {
              setSelectedEndDate(value);
            } else if (name === "SIGUN_NM") {
              setSelectedLocation(value);
            } else if (name === "SPECIES_NM") {
              setSelectedBreed(value);
            }
            handleFilter();
          }}
        />
        <Container>
          {currentItems?.map((item: AnimalShelter) => (
            <Box
              key={item.ABDM_IDNTFY_NO}
              onClick={() =>
                navigate(`/detail/${item.ABDM_IDNTFY_NO}`, {
                  state: { item },
                })
              }
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item);
                }}
              >
                {userFavorites.has(item.ABDM_IDNTFY_NO || "") ? (
                  <FaHeart />
                ) : (
                  <FaRegHeart />
                )}
              </button>
              <p>고유 번호 : {item.ABDM_IDNTFY_NO}</p>
              <PetImg src={item.IMAGE_COURS} alt="Pet Thumbnail" />
              <p>접수 일지 : {formatDate(item.RECEPT_DE)}</p>
              <p>품종 : {item.SPECIES_NM}</p>
              <p>성별 : {item.SEX_NM}</p>
              <p>발견장소 : {item.DISCVRY_PLC_INFO} </p>
              <p>특징: {item.SFETR_INFO}</p>
              <p>상태: {item.STATE_NM}</p>
              <p>보호 주소:{item.SIGUN_NM} </p>
            </Box>
          ))}
        </Container>
        {/* 페이지네이션 컴포넌트 추가 */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </FavoritesProvider>
  );
}

export default Home;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 20px;
`;
const Box = styled.div`
  border: 1px solid black;
  width: calc(33.33% - 10px);
  padding: 10px;
  margin-bottom: 20px;
  flex: 0 0 calc(33.33% - 10px);
  box-sizing: border-box;
`;
const PetImg = styled.img`
  width: 100%;
  height: auto;
  max-width: 400px;
`;
