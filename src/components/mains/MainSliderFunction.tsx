import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as S from "../../styles/components/mains/style.mainsliderfuntion";

function MainSliderFunction() {
  const location = useLocation();
  const [showImages, setShowImages] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShowImages(true);
        } else {
          setShowImages(false);
        }
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      setShowImages(false);
    };
  }, [location.pathname]);

  return (
    <S.Container ref={containerRef}>
      <S.TitleText>테일테일즈의 기능을 소개합니다</S.TitleText>
      <S.ImageContainer>
        <S.ImageWrapper className={showImages ? "show" : ""}>
          <S.ImgContainer onClick={() => navigate("/home")}>
            <S.Img src="/image/landings/landing10.jpg" alt="기다리는 친구들" />
            <S.ImageCaption>기다리는 친구들</S.ImageCaption>
          </S.ImgContainer>
        </S.ImageWrapper>
        <S.Space />
        <S.ImageWrapper className={showImages ? "show" : ""}>
          <S.ImgContainer onClick={() => navigate("/community")}>
            <S.Img src="/image/landings/landing11.jpg" alt="커뮤니티" />
            <S.ImageCaption>커뮤니티</S.ImageCaption>
          </S.ImgContainer>
        </S.ImageWrapper>
        <S.Space />
        <S.ImageWrapper className={showImages ? "show" : ""}>
          <S.ImgContainer
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
            <S.Img src="/image/landings/landing12.jpg" alt="마이페이지" />
            <S.ImageCaption>마이페이지</S.ImageCaption>
          </S.ImgContainer>
        </S.ImageWrapper>
      </S.ImageContainer>
    </S.Container>
  );
}

export default MainSliderFunction;
