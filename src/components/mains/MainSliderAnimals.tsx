import { useState, useEffect } from "react";
import * as S from "../../styles/components/mains/style.mainslideranimals";

function MainSliderAnimals() {
  // 현재 이미지 인덱스를 관리하는 상태
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 이미지 경로 배열
  const images = [
    "/image/landings/landing2.jpg",
    "/image/landings/landing3.jpg",
    "/image/landings/landing4.jpg",
    "/image/landings/landing5.jpg",
    "/image/landings/landing6.jpg",
    "/image/landings/landing7.jpg",
    "/image/landings/landing8.jpg",
    "/image/landings/landing9.jpg",
  ];

  useEffect(() => {
    // 이미지 변경을 위한 타이머 설정
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // 2초

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => {
      clearInterval(timer);
    };
  }, [images]);

  return (
    <S.Container>
      <S.CenteredText>
        <h1>
          입양하는 문화를 지향하는 <br /> 유기동물 입양 사이트
          <br /> <span style={{ color: "#746464" }}>테일테일즈</span>
        </h1>
        <span>사랑스러운 친구들의 가족이 되어주세요!</span>
      </S.CenteredText>
      <br />
      <div>
        <S.ImageSlider>
          {/* 이미지 슬라이더 구성 */}
          {images.map((src, index) => (
            <S.Image
              key={index}
              src={src}
              alt={`Image ${index}`}
              style={{
                marginLeft: index === 0 ? 0 : "-40px",
                transform: `translateX(${(index - currentImageIndex) * 100}%`,
                transition: "transform 0.5s ease-in-out",
              }}
            />
          ))}
        </S.ImageSlider>
      </div>
    </S.Container>
  );
}
export default MainSliderAnimals;
