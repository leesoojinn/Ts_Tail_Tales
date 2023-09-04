import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { fetchAnimalData, formatDate, AnimalShelter } from "../api/fetchData";
import Category from "../components/Category";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomSlider from "../components/Slider";
import Pagination from "../components/Pagination";
import { FavoritesProvider } from "../components/FavoritesContext";
import PetCard from "../components/Petcard";

function Home() {
  const [data, setData] = useState<Array<AnimalShelter>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  const [selectedBeginDate, setSelectedBeginDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        setError(null);
        setLoading(true);
        const fetchedData = await fetchAnimalData();
        console.log("fetchedData", fetchedData);

        setData(fetchedData); // 첫 페이지에서 필요한 것만 GET
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
            <PetCard key={item.ABDM_IDNTFY_NO} item={item} />
          ))}
        </Container>
        {/* 페이지네이션 컴포넌트 추가 */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
          setCurrentPage={setCurrentPage}
        />
      </Div>
    </FavoritesProvider>
  );
}

export default Home;

const Div = styled.div`
  background-color: #ffeaea;

  .filtered {
    font-size: 2em;
    display: flex;
    justify-content: center;
    padding: 15px 0 15px 0;
  }

  .deadline {
    font-weight: bolder;
    color: red;
  }
`;

const Container = styled.div`
  // display: flex;
  // flex-wrap: wrap;
  // justify-content: space-between;
  // margin: 50px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  // margin: 100px;
  grid-template-columns: repeat(3, 1fr); /* 세 개의 컬럼으로 그리드 설정 */
  gap: 30px; /* 컬럼 간의 간격 */
`;
