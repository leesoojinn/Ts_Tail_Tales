import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as S from "../../styles/components/mains/style.mainsliderfuntion";

function MainSliderFunction() {
  const location = useLocation();
  const [showImages, setShowImages] = useState(false); // 이미지를 보여줄지 여부를 관리하는 상태

  const containerRef = useRef(null); // 이미지를 감싸는 컨테이너 요소의 ref
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShowImages(true); // 이미지가 화면에 나타나면 showImages 상태를 true로 설정
        } else {
          setShowImages(false); // 이미지가 화면에 나타나지 않으면 showImages 상태를 false로 설정
        }
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current); // 컨테이너 요소를 감시하여 이미지가 화면에 나타나는지 감지
    }

    return () => {
      setShowImages(false);
    };
  }, [location.pathname]); // 경로가 변경될 때마다 useEffect가 재실행되도록 함

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
