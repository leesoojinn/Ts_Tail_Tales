import React, { useState, useEffect } from "react";
import * as S from "../styles/components/style.scrolltotop";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
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
