import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchAnimalData, formatDate, AnimalShelter } from "../api/fetchData";
import Category from "../components/petcards/Category";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomSlider from "../components/Slider";
import Pagination from "../components/Pagination";
import { FavoritesProvider } from "../components/favorite/FavoritesContext";
import PetCard from "../components/petcards/Petcard";
import { useLocation } from "react-router-dom";
import usePageHook from "../hooks/pageHook";
import * as S from "../styles/pages/style.home";

function Home() {
  const location = useLocation();
  const { currentPage, setCurrentPage, indexOfLastItem, indexOfFirstItem, itemsPerPage } = usePageHook(12);

  const { data, isLoading, isError, error } = useQuery<Array<AnimalShelter>, Error>("animalData", fetchAnimalData);

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

  const FilteredAnimals = data.filter((item: AnimalShelter) => {
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

  const currentItems = FilteredAnimals.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <FavoritesProvider>
      <S.Div>
        <S.FilteredSection>
          <span className="highlighted">마감일</span>이 얼마 남지 않았습니다.
        </S.FilteredSection>
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
          <Pagination currentPage={currentPage} totalPages={Math.ceil(FilteredAnimals.length / itemsPerPage)} setCurrentPage={setCurrentPage} />
        </S.PaginationWrap>
      </S.Div>
    </FavoritesProvider>
  );
}

export default Home;
