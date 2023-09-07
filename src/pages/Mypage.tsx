import React, { useState, useEffect } from "react";
import { AnimalShelter, fetchAnimalData } from "../api/fetchData";
import PetCard from "../components/Petcard";
import { supabase } from "../supabase";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";

function Mypage() {
  const [userEmail, setUserEmail] = useState("");
  const [favoriteAnimals, setFavoriteAnimals] = useState<AnimalShelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentFavoriteAnimals = favoriteAnimals.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    // 유저 정보 가져오기
    const getUserInfo = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting user:", userError);
        return;
      }

      const user = userData?.user;
      const email = user?.email;
      setUserEmail(email || ""); // 이메일을 상태에 저장
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        setError(null);
        setLoading(true);
        const fetchedData = await fetchAnimalData();

        // 데이터가 존재하지 않을 경우에만 API 요청
        if (favoriteAnimals.length === 0) {
          const fetchedData = await fetchAnimalData(); // 데이터 가져오기
          setFavoriteAnimals(fetchedData); // 가져온 데이터를 상태에 설정
        }

        // 사용자의 즐겨찾기 정보 가져오기
        const { data: favoriteData, error: favoriteError } = await supabase.from("favorites").select("animalId").eq("email", userEmail);

        if (favoriteError) {
          console.error("사용자 즐겨찾기 항목 가져오기 오류:", favoriteError);
          return;
        }

        const favoriteAnimalIds = favoriteData.map((fav: any) => fav.animalId);

        // 사용자의 즐겨찾기한 동물 정보 필터링
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

  return (
    <>
      <MyPage>
        <Title>My Page</Title>
        <BackButton
          onClick={() => {
            navigate("/home");
          }}
        >
          <BackIcon />
          뒤로가기
        </BackButton>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Container>
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
          </Container>
        )}
      </MyPage>
      {!loading && (
        <PaginationContainer>
          <Pagination currentPage={currentPage} totalPages={Math.ceil(favoriteAnimals.length / itemsPerPage)} setCurrentPage={handlePageChange} />
        </PaginationContainer>
      )}
    </>
  );
}

export default Mypage;

const MyPage = styled.div`
  padding: 20px;
  width: 1000px;
  margin: 0 auto; /* 수평 가운데 정렬 */
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  margin-left: 20px;
  background-color: #f8b3b3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    background-color: #f8b3b3;
    transform: scale(1.05);
  }
`;

const BackIcon = styled(FiArrowLeft)`
  margin-right: 5px;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px;
  grid-template-columns: repeat(3, 1fr); /* 세 개의 컬럼으로 그리드 설정 */
  gap: 30px; /* 컬럼 간의 간격 */
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
