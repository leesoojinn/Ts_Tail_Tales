import { useState, useEffect } from "react";
import { styled } from "styled-components";

function MainSliderSecond() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = ["/image/mains/main2.jpg", "/image/mains/main3.jpeg", "/image/mains/main4.jpg", "/image/mains/main5.jpg", "/image/mains/main16.jpg", "/image/mains/main15.jpg", "/image/mains/main12.jpg", "/image/mains/main14.jpg", "/image/mains/main13.jpg", "/image/mains/main17.jpg"];

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
                transform: `translateX(${(index - currentImageIndex) * 100}px`,
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
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;
const CenteredText = styled.div`
  text-align: center;
  margin-bottom: 5%;
`;

const ImageSlider = styled.div`
  width: 1200px;
  display: flex;
  overflow: hidden;
`;

const Image = styled.img`
  width: 280px;
  height: 200px;
  border-radius: 20px;
  object-fit: cover;
  margin: 10px;
  transition: transform 0.5s ease;
`;

export default MainSliderSecond;
