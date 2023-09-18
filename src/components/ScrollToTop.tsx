import React, { useState, useEffect } from "react";
import * as S from "../styles/components/style.scrolltotop";

// ScrollToTop 컴포넌트 정의
const ScrollToTop = () => {
  // 상태 관리를 위한 isVisible 상태와 초기값 설정
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 위치에 따라 isVisible 상태를 업데이트하는 함수
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true); // 스크롤 위치가 300 이상일 때 버튼을 보이게 함
    } else {
      setIsVisible(false); // 스크롤 위치가 300 미만일 때 버튼을 숨김
    }
  };

  // 페이지 상단으로 스크롤 이동하는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 부드럽게 스크롤 이동
    });
  };

  // 컴포넌트가 마운트될 때와 언마운트될 때 이벤트 리스너 등록/해제
  useEffect(() => {
    // 스크롤 이벤트 발생 시 toggleVisibility 함수 호출
    window.addEventListener("scroll", toggleVisibility);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 해제
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {/* isVisible이 true일 때만 버튼을 렌더링 */}
      {isVisible && (
        <S.TopButton onClick={scrollToTop}>
          <S.TopContent>
            <S.TopText>Top</S.TopText>
          </S.TopContent>
        </S.TopButton>
      )}
    </>
  );
};

export default ScrollToTop;
