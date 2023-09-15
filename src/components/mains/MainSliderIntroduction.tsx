import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import * as S from "../../styles/components/mains/style.mainsliderintroduction";

const MainSliderIntroduction = () => {
  const navigate = useNavigate();

  return (
    <S.Container>
      <S.ImageContainer>
        <S.ImageBackground src="/image/landings/landing1.jpg" alt="강아지, 고양이 사진" />
        <S.TextWrap>
          <S.Title>
            유기견, 유기묘들에게 <br /> 새로운 삶을 선물해주세요
          </S.Title>
          <S.Content>
            TailTales는 잊혀져가는 유기동물들을 세상에 알리고
            <br />
            소중한 가족을 찾아주는 플랫폼입니다.
          </S.Content>
        </S.TextWrap>
      </S.ImageContainer>
      <S.Button onClick={() => navigate("/home")}>기다리는 친구들</S.Button>
      <S.DownArrow>
        <IoIosArrowDown />
      </S.DownArrow>
    </S.Container>
  );
};

export default MainSliderIntroduction;
