import React, { useState, useEffect, useRef } from "react";
import { styled } from "styled-components";
import { useLocation } from "react-router";

function MainSliderThird() {
  const location = useLocation();
  const [showImages, setShowImages] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 페이지가 보이면 이미지 보여주기
          setShowImages(true);
        } else {
          setShowImages(false);
        }
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // 슬라이더로 이동할 때 showImages 초기화
    return () => {
      setShowImages(false);
    };
  }, [location.pathname]);

  return (
    <Container ref={containerRef}>
      <TitleText>테일테일즈의 기능을 소개합니다</TitleText>
      <ImageContainer>
        <ImageWrapper className={showImages ? "show" : ""}>
          <ImgContainer>
            <Img src="/image/mains/main6.jpg" alt="기다리는 친구들" />
            <ImageCaption>기다리는 친구들</ImageCaption>
          </ImgContainer>
        </ImageWrapper>
        <Space />
        <ImageWrapper className={showImages ? "show" : ""}>
          <ImgContainer>
            <Img src="/image/mains/main7.jpg" alt="커뮤니티" />
            <ImageCaption>커뮤니티</ImageCaption>
          </ImgContainer>
        </ImageWrapper>
        <Space />
        <ImageWrapper className={showImages ? "show" : ""}>
          <ImgContainer>
            <Img src="/image/mains/main8.jpg" alt="about us" />
            <ImageCaption>about us</ImageCaption>
          </ImgContainer>
        </ImageWrapper>
      </ImageContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #746464;
  position: relative;

  /* 배경 이미지 설정 */
  background-image: url("/image/mains/main19.gif");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const TitleText = styled.h1`
  color: white;
  margin-bottom: 7%;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ImageWrapper = styled.div`
  text-align: center;
  margin: 0 10px;
  opacity: 0; /* 처음에는 숨김 */
  transform: translateX(-100%); /* 왼쪽에서 슬라이드 시작 */
  transition: opacity 1.5s ease-in-out, transform 1.5s ease-in-out;
  &.show {
    opacity: 1; /* 나타날 때 투명도 증가 */
    transform: translateX(0); /* 왼쪽으로 슬라이드 */
  }
`;

const ImgContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const Img = styled.img`
  width: 300px;
  height: 200px;
  border-radius: 20px;
  object-fit: cover;
  &:hover {
    filter: brightness(110%);
  }
`;

const Space = styled.span`
  padding-left: 50px;
  padding-right: 50px;
`;

const ImageCaption = styled.p`
  color: black;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  margin: 0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  font-weight: bold;
`;

export default MainSliderThird;
