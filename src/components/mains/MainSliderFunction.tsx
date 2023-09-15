import React, { useState, useEffect, useRef } from "react";
import { styled } from "styled-components";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function MainSliderFunction() {
  const location = useLocation();
  const [showImages, setShowImages] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

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
          <ImgContainer onClick={() => navigate("/home")}>
            <Img src="/image/mains/main6.jpg" alt="기다리는 친구들" />
            <ImageCaption>기다리는 친구들</ImageCaption>
          </ImgContainer>
        </ImageWrapper>
        <Space />
        <ImageWrapper className={showImages ? "show" : ""}>
          <ImgContainer onClick={() => navigate("/community")}>
            <Img src="/image/mains/main7.jpg" alt="커뮤니티" />
            <ImageCaption>커뮤니티</ImageCaption>
          </ImgContainer>
        </ImageWrapper>
        <Space />
        <ImageWrapper className={showImages ? "show" : ""}>
          <ImgContainer
            onClick={() => {
              if (sessionStorage.getItem("user") === null) {
                Swal.fire({
                  icon: "warning",
                  text: "로그인이 필요한 기능입니다.",
                });
              } else {
                navigate("/mypage/:id");
              }
            }}
          >
            <Img src="/image/mains/main8.jpg" alt="마이페이지" />
            <ImageCaption>마이페이지</ImageCaption>
          </ImgContainer>
        </ImageWrapper>
      </ImageContainer>
    </Container>
  );
}

const Contain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: white;

  /* 기존 스타일 유지 */

  /* 중앙 정렬 및 양옆 공백 설정 */
  max-width: 1200px; /* 원하는 최대 너비로 조정 */
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
    background: #fdfaf6;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-image: url("/image/mains/main19.gif");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  min-height: 100vh; /* 최소 높이를 화면 높이로 설정 */

  /* 헤더 영역의 스타일 */
  margin-top: -90px;
  padding-top: 10px; /* 헤더의 높이만큼 padding-top 설정 */

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const TitleText = styled.h1`
  color: white;
  margin-bottom: 7%;

  @media (max-width: 768px) {
    font-size: 30px;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column; /* 작은 화면에서는 세로로 배치 */
  }
`;

const ImageWrapper = styled.div`
  text-align: center;
  margin: 10px; /* 작은 화면과 큰 화면 간격 동일하게 설정 */
  width: 33.33%; /* 큰 화면에서는 세로로 1줄에 3개의 이미지가 나오도록 너비 조정 */
  opacity: 0; /* 처음에는 숨김 */
  transform: translateX(-100%); /* 왼쪽에서 슬라이드 시작 */
  transition: opacity 1.5s ease-in-out, transform 1.5s ease-in-out;
  &.show {
    opacity: 1; /* 나타날 때 투명도 증가 */
    transform: translateX(0); /* 왼쪽으로 슬라이드 */
  }

  @media (max-width: 768px) {
    width: 100%; /* 작은 화면에서는 한 개씩 세로로 배치하기 위해 너비 조정 */
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

  @media (max-width: 768px) {
    width: 200px; /* 작은 화면에서 이미지 크기를 줄임 */
    height: 150px;
  }
`;

const Space = styled.span`
  padding-left: 50px;
  padding-right: 50px;

  @media (max-width: 768px) {
    padding-left: 20px; /* 작은 화면에서 간격을 줄임 */
    padding-right: 20px;
  }
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

  @media (max-width: 768px) {
    margin-left: 10px;
    width: 180px;
  }
`;

export default MainSliderFunction;
