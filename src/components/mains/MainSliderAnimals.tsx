import { useState, useEffect } from "react";
import { styled } from "styled-components";

function MainSliderAnimals() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = ["/image/mains/main20.jpg", "/image/mains/main21.jpg", "/image/mains/main22.jpg", "/image/mains/main23.jpg", "/image/mains/main24.jpg", "/image/mains/main25.jpg", "/image/mains/main26.jpg", "/image/mains/main27.jpg"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => {
      // 컴포넌트가 언마운트되면 타이머 해제
      clearInterval(timer);
    };
  }, [images]);

  return (
    <Container>
      <CenteredText>
        <h1>
          함께 나누고 도움을 줄 수 있는 <br /> 입양 사이트 <span style={{ color: "#746464" }}>테일테일즈</span>
        </h1>
        <span>지역 내 많은 보호소 중 가깝고, 확실한 정보를 제공합니다.</span>
      </CenteredText>
      <br />
      <div>
        <ImageSlider>
          {images.map((src, index) => (
            <Image
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
        </ImageSlider>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  min-height: 100vh;
  background-color: linear-gradient(to bottom, #f0f0f0);

  @media (max-width: 650px) {
    width: 100%;
    padding-top: 100px;
  }
`;
const CenteredText = styled.div`
  text-align: center;
  margin-bottom: 5%;

  @media (max-width: 650px) {
    padding-bottom: 40px;
  }
`;

const ImageSlider = styled.div`
  width: 1200px;
  display: flex;
  overflow: hidden;

  @media (max-width: 650px) {
    width: 100%;
  }
`;

const Image = styled.img`
  width: 30%; /* 이미지를 슬라이더 너비에 맞게 조정 */
  height: auto; /* 높이는 자동으로 조정되도록 설정 */
  border-radius: 20px;
  object-fit: cover;
  margin: 10px;
  transition: transform 0.5s ease;
  margin-right: -200px;

  @media (max-width: 650px) {
    width: 75%;
  }
`;

export default MainSliderAnimals;
