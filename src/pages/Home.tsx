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

function Home() {
  const { data, isLoading, isError, error } = useQuery<
    Array<AnimalShelter>,
    Error
  >("animalData", fetchAnimalData);

  const [currentPage, setCurrentPage] = useState(1);
  // 1. useState가 너무 많다. -> useState 하나로 관리하면 편하지 않을까?
  // ------------------------------
  const [queries, setQueries] = useState({
    selectedBeginDate: "",
    selectedEndDate: "",
    selectedLocation: "",
    selectedBreed: "",
  });

  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQueries({
      ...queries,
      [name]: value,
    });
    handleFilter();
  };
  // ------------------------------
  const [selectedBeginDate, setSelectedBeginDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");

  const ITEMS_PER_PAGE = 16;

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

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = AnimalsItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <FavoritesProvider>
      <Div>
        <div className="filtered">
          <span className="deadline">"공고 마감일"</span>이 얼마 남지 않은
          아이들!
        </div>
        <CustomSlider items={nearingDeadline} />
        <Category
          query={{
            PBLANC_BEGIN_DE: queries.selectedBeginDate,
            PBLANC_END_DE: queries.selectedEndDate,
            SIGUN_NM: queries.selectedLocation,
            SPECIES_NM: queries.selectedBreed,
          }}
          // onChange={(e) => {
          //   const { name, value } = e.target;
          //   if (name === "PBLANC_BEGIN_DE") {
          //     setSelectedBeginDate(value);
          //   } else if (name === "PBLANC_END_DE") {
          //     setSelectedEndDate(value);
          //   } else if (name === "SIGUN_NM") {
          //     setSelectedLocation(value);
          //   } else if (name === "SPECIES_NM") {
          //     setSelectedBreed(value);
          //   }
          //   handleFilter();
          // }}
          onChange={changeHandler}
        />
        <Container>
          {currentItems?.map((item: AnimalShelter) => (
            <PetCard key={item.ABDM_IDNTFY_NO} item={item} />
          ))}
        </Container>
        {/* 페이지네이션 컴포넌트 추가 */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(AnimalsItems.length / ITEMS_PER_PAGE)}
          setCurrentPage={setCurrentPage}
        />
      </Div>
    </FavoritesProvider>
  );
}

export default Home;

const Div = styled.div`
  background-color: #ffeaea;
  position: relative;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;

  .filtered {
    font-size: 2em;
    display: flex;
    justify-content: center;
    padding: 100px 0 15px 0;
  }

  .deadline {
    font-weight: bolder;
    color: red;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
`;
