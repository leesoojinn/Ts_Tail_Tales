import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AnimalShelter } from "../api/fetchData";
import PetCard from "./petcards/Petcard";
import * as S from "../styles/components/style.slider";
import { FavoritesProvider } from "./favorite/FavoritesContext";

// CustomSliderProps 인터페이스 정의
interface CustomSliderProps {
  items: Array<AnimalShelter>;
}

// CustomSlider 컴포넌트 정의
function CustomSlider({ items }: CustomSliderProps) {
  // Slick Slider 설정
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 4500,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <FavoritesProvider>
      {/* 슬라이더 컨테이너 */}
      <S.SliderContainer>
        {/* Slick Slider 컴포넌트 */}
        <S.SliderCard {...settings}>
          {/* 각 아이템에 대한 PetCard 컴포넌트 렌더링 */}
          {items?.map((item: AnimalShelter) => (
            <div key={item.ABDM_IDNTFY_NO}>
              <PetCard item={item} />
            </div>
          ))}
        </S.SliderCard>
      </S.SliderContainer>
    </FavoritesProvider>
  );
}

export default CustomSlider;
