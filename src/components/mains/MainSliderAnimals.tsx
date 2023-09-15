import { useState, useEffect } from "react";
import * as S from "../../styles/components/mains/style.mainslideranimals";

function MainSliderAnimals() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = ["/image/landings/landing2.jpg", "/image/landings/landing3.jpg", "/image/landings/landing4.jpg", "/image/landings/landing5.jpg", "/image/landings/landing6.jpg", "/image/landings/landing7.jpg", "/image/landings/landing8.jpg", "/image/landings/landing9.jpg"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

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
