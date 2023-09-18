import React, { useState, useEffect } from "react"; // 생명주기 관련 기능 모듈
import { useQuery } from "react-query"; // 상태(state)와 데이터 가져오기 기능을 사용하기 위한 라이브러리
import { fetchAnimalData, formatDate, AnimalShelter } from "../api/fetchData"; // API 호출과 데이터 포맷 관련 모듈 및 타입 임포트
import Category from "../components/petcards/Category"; // 카테고리 필터 컴포넌트 임포트
import "slick-carousel/slick/slick.css"; // "slick-carousel" 라이브러리(디자인)
import "slick-carousel/slick/slick-theme.css"; // "slick-carousel" 라이브러리(디자인)
import CustomSlider from "../components/Slider"; // 이미지 슬라이더 컴포넌트 임포트
import Pagination from "../components/Pagination"; // 페이지네이션 컴포넌트 임포트
import { FavoritesProvider } from "../components/favorite/FavoritesContext"; // 즐겨찾기 관련 컨텍스트 제공자 임포트
import PetCard from "../components/petcards/Petcard"; // 유기동물 카드 컴포넌트 임포트
import { useLocation } from "react-router-dom"; // 현재 라우터 위치 관련 훅 임포트
import usePageHook from "../hooks/pageHook"; // 페이지 관련 훅 임포트
import * as S from "../styles/pages/style.home"; // 홈 페이지 관련 스타일 모듈 임포트

function Home() {
  const location = useLocation(); // 현재 페이지 URL 정보를 가져오는 React Router 훅 사용
  const {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    itemsPerPage,
  } = usePageHook(12); // 페이지 관련 훅 사용

  const { data, isLoading, isError, error } = useQuery<
    Array<AnimalShelter>,
    Error
  >("animalData", fetchAnimalData); // 데이터 쿼리 후 상태 관리 훅 사용

  const [queries, setQueries] = useState({
    selectedBeginDate: "",
    selectedEndDate: "",
    selectedLocation: "",
    selectedBreed: "",
  }); // 필터링 쿼리 상태값 초기화

  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQueries({
      ...queries,
      [name]: value,
    }); // 필터링 쿼리 변경 핸들러

    handleFilter();
  };

  const handleFilter = () => {
    setCurrentPage(1); // 필터링 적용 시 첫 번째 페이지로 이동
  };

  if (isLoading) return <div>Loading...</div>; // 데이터 로딩 중에는 로딩 메시지 출력
  if (isError || !data) {
    const errorMessage = isError ? error?.message : "An error occurred";
    return <div>Error: {errorMessage}</div>; // 데이터 요청 중 오류 발생 시 오류 메시지 출력
  }

  const nearingDeadline = data.filter((item: AnimalShelter) => {
    const today = new Date();
    const endOfNotice = new Date(formatDate(item.PBLANC_END_DE));
    const fiveDaysAfter = new Date(today);
    fiveDaysAfter.setDate(fiveDaysAfter.getDate() + 10);
    return endOfNotice <= fiveDaysAfter;
  }); // 마감일이 얼마 남지 않은 동물 데이터 필터링

  const FilteredAnimals = data.filter((item: AnimalShelter) => {
    let matchesDate = true;
    let matchesLocation = true;
    let matchesBreed = true;
    if (queries.selectedBeginDate && queries.selectedEndDate) {
      matchesDate =
        formatDate(item.RECEPT_DE) >= queries.selectedBeginDate &&
        formatDate(item.RECEPT_DE) <= queries.selectedEndDate;
    }
    if (queries.selectedLocation) {
      matchesLocation = item.SIGUN_NM.toLowerCase().includes(
        queries.selectedLocation.toLowerCase()
      );
    }
    if (queries.selectedBreed) {
      matchesBreed =
        item.SPECIES_NM.split("]")[0] + "]" === queries.selectedBreed;
    }
    return matchesDate && matchesLocation && matchesBreed;
  }); // 사용자 지정 필터링 조건에 따라 동물 데이터 필터링

  const currentItems = FilteredAnimals.slice(indexOfFirstItem, indexOfLastItem);
  // 현재 페이지에 표시할 데이터 슬라이싱

  return (
    <FavoritesProvider>
      <S.Div>
        <S.FilteredSection>
          <span className="highlighted">마감일</span>이 얼마 남지 않았습니다.
        </S.FilteredSection>
        <CustomSlider items={nearingDeadline} />{" "}
        {/* 마감일이 얼마 남지 않은 동물을 슬라이더로 표시 */}
        <Category
          query={{
            PBLANC_BEGIN_DE: queries.selectedBeginDate,
            PBLANC_END_DE: queries.selectedEndDate,
            SIGUN_NM: queries.selectedLocation,
            SPECIES_NM: queries.selectedBreed,
          }}
          onChange={changeHandler}
        />{" "}
        {/* 동물 카테고리 필터 컴포넌트 */}
        <S.NewLifeSection className="filtered">
          <span className="highlighted">새로운 삶</span>을 기다리는 친구들!
        </S.NewLifeSection>
        <S.Container>
          {currentItems?.map((item: AnimalShelter) => (
            <>
              <PetCard key={item.ABDM_IDNTFY_NO} item={item} />
            </>
          ))}
        </S.Container>
        <S.PaginationWrap>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(FilteredAnimals.length / itemsPerPage)}
            setCurrentPage={setCurrentPage}
          />
        </S.PaginationWrap>
      </S.Div>
    </FavoritesProvider>
  );
}

export default Home;
