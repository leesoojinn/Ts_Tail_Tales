import React, { useState } from "react";
import { styled } from "styled-components";
import { useQuery } from "react-query";
import { fetchAnimalData, formatDate, AnimalShelter } from "../api/fetchData";
import Category from "../components/Category";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomSlider from "../components/Slider";
import Pagination from "../components/Pagination";
import { FavoritesProvider } from "../components/FavoritesContext";
import PetCard from "../components/Petcard";

const ITEMS_PER_PAGE = 12;

function Home() {
  const { data, isLoading, isError, error } = useQuery<Array<AnimalShelter>, Error>("animalData", fetchAnimalData);

  const [currentPage, setCurrentPage] = useState(1);
  // 1. useState가 너무 많다. -> useState 하나로 관리하면 편하지 않을까?
  // ------------------------------
  const [queries, setQueries] = useState({
    selectedBeginDate: "",
    selectedEndDate: "",
    selectedLocation: "",
    selectedBreed: "",
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQueries({
      ...queries,
      [name]: value,
    });
    handleFilter();
  };
  // ------------------------------

  const handleFilter = () => {
    setCurrentPage(1);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) {
    const errorMessage = isError ? error?.message : "An error occurred";
    return <div>Error: {errorMessage}</div>;
  }

  const nearingDeadline = data.filter((item: AnimalShelter) => {
    const today = new Date();
    const endOfNotice = new Date(formatDate(item.PBLANC_END_DE));
    const fiveDaysAfter = new Date(today);
    fiveDaysAfter.setDate(fiveDaysAfter.getDate() + 10);
    return endOfNotice <= fiveDaysAfter;
  });

  const AnimalsItems = data.filter((item: AnimalShelter) => {
    let matchesDate = true;
    let matchesLocation = true;
    let matchesBreed = true;
    if (queries.selectedBeginDate && queries.selectedEndDate) {
      matchesDate = formatDate(item.RECEPT_DE) >= queries.selectedBeginDate && formatDate(item.RECEPT_DE) <= queries.selectedEndDate;
    }
    if (queries.selectedLocation) {
      matchesLocation = item.SIGUN_NM.toLowerCase().includes(queries.selectedLocation.toLowerCase());
    }
    if (queries.selectedBreed) {
      matchesBreed = item.SPECIES_NM.split("]")[0] + "]" === queries.selectedBreed;
    }
    return matchesDate && matchesLocation && matchesBreed;
  });

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = AnimalsItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <FavoritesProvider>
      <Div>
        <FilteredSection>
          <DeadlineText>"공고 마감일"</DeadlineText>이 얼마 남지 않은 친구들!
        </FilteredSection>
        <CustomSlider items={nearingDeadline} />
        <Category
          query={{
            PBLANC_BEGIN_DE: queries.selectedBeginDate,
            PBLANC_END_DE: queries.selectedEndDate,
            SIGUN_NM: queries.selectedLocation,
            SPECIES_NM: queries.selectedBreed,
          }}
          onChange={changeHandler}
        />
        <NewLifeSection className="filtered">
          <span className="deadline">"새로운 삶"</span>을 기다리는 친구들!
        </NewLifeSection>
        <Container>
          {currentItems?.map((item: AnimalShelter) => (
            <PetCard key={item.ABDM_IDNTFY_NO} item={item} />
          ))}
        </Container>
        {/* 페이지네이션 컴포넌트 추가 */}
        <Pagination currentPage={currentPage} totalPages={Math.ceil(AnimalsItems.length / ITEMS_PER_PAGE)} setCurrentPage={setCurrentPage} />
      </Div>
    </FavoritesProvider>
  );
}

export default Home;

const Div = styled.div`
  background-color: #fdfaf6;
  position: relative;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3600px;

  .filtered {
    font-size: 2.5em;
    display: flex;
    justify-content: center;
    padding: 100px 0 15px 0;
    margin-top: 20px;
    margin-bottom: 30px;
  }

  .deadline {
    font-weight: bolder;
    color: black;
    font-weight: bold;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-bottom: 20px;

  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
`;

const FilteredSection = styled.div`
  background-image: url("/image/homes/home08.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5em;
  padding: 100px 0 15px 0;
  margin-bottom: 30px;
  height: 300px;
  object-fit: cover;
  color: white;
  background-color: #fcf3e3;
`;

const DeadlineText = styled.span`
  font-weight: bolder;
  color: white;
  font-weight: bold;
`;

const NewLifeSection = styled.div`
  background-image: url("/image/homes/home04.jpg");
  background-size: contain; /* 이미지가 페이지 크기에 맞게 확대/축소됨 */
  background-position: top center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5em;
  padding: 100px 0 15px 0;
  margin-bottom: 30px;
  object-fit: cover;
  height: 300px;
  filter: brightness(0.7);
`;
