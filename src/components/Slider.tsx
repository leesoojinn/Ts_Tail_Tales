import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AnimalShelter } from "../api/fetchData";
import styled from "styled-components";
import PetCard from "./Petcard";
import { FavoritesProvider } from "./FavoritesContext";

interface CustomSliderProps {
  items: Array<AnimalShelter>;
}

const StyledSliderContainer = styled.div`
  margin: 0 auto; /* 가운데 정렬을 위해 */
  max-width: 1200px; /* 최대 너비 설정 */
`;

const StyledSlider = styled(Slider)`
  .slick-slide > div {
    width: 300%;
    padding: 10px;
    box-sizing: border-box;
    max-width: 1000px;
    margin-left: 30px;
  }

  .slick-prev {
    left: -40px; /* 화살표 위치 조절 */
    z-index: 1; /* 다른 콘텐츠 위에 표시되도록 */
  }

  .slick-next {
    right: -40px; /* 화살표 위치 조절 */
    z-index: 1; /* 다른 콘텐츠 위에 표시되도록 */
  }

  .slick-prev:before,
  .slick-next:before {
    /* font-family: "Font Awesome 5 Free"; 사용하는 아이콘 폰트 설정 */
    /* font-weight: 900;
    font-size: 20px;
    line-height: 1; */
    color: #746464; /* 아이콘 색상 변경 */
    opacity: 1;
    transition: all 0.3s ease;
  }

  /* 활성화된 상태의 아이콘 스타일 변경 */
  .slick-prev.slick-disabled:before,
  .slick-next.slick-disabled:before {
    color: gray; /* 비활성화된 상태의 아이콘 색상 */
  }
`;

function CustomSlider({ items }: CustomSliderProps) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true, // autoplay 활성화
    autoplaySpeed: 4500, // 각 슬라이드 간의 넘어가는 시간 설정 (밀리초 단위)
    responsive: [
      {
        breakpoint: 1000, // 화면 폭이 1000px 이하일 때 적용
        settings: {
          slidesToShow: 3, // 더 작은 화면에서는 3개의 아이템을 보여줌
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
      <StyledSliderContainer>
        <StyledSlider {...settings}>
          {items?.map((item: AnimalShelter) => (
            <div key={item.ABDM_IDNTFY_NO}>
              <PetCard item={item} />
            </div>
          ))}
        </StyledSlider>
      </StyledSliderContainer>
    </FavoritesProvider>
  );
}

export default CustomSlider;
