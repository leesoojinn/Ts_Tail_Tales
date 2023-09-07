import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

const MainSliderOne = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ImageContainer>
        <ImageBackground src="/image/mains/main1.jpg" alt="강아지, 고양이 사진" />
        <TextWrap>
          <h1>
            유기견, 유기묘들에게 <br /> 새로운 삶을 선물해주세요
          </h1>
          <span>
            다양한 친구들을 만나보세요
            <br />
            지도 상에서 가까운 보호소를 찾아
            <br />
            유기동물을 입양하세요
          </span>
        </TextWrap>
      </ImageContainer>
      <Button onClick={() => navigate("/home")}>기다리는 친구들</Button>
      <DownArrow>
        <IoIosArrowDown />
      </DownArrow>
    </Container>
  );
};

export default MainSliderOne;

const TextWrap = styled.div`
  color: white;
  text-align: center;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-shadow: 2px 2px 4px rgba(128, 128, 128, 0.5);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
  position: relative;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ImageContainer = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
  img {
    width: 100%;
    height: auto;
  }
`;

const ImageBackground = styled.img`
  background-image: url("/image/main/main1.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Button = styled.button`
  width: 130px;
  height: 50px;
  background-color: rgba(87, 76, 76, 0.7);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #fdfaf6;
  border: none;
  padding: 10px 10px 10px 10px;
  border-radius: 30px;
  cursor: pointer;
  z-index: 2;
  position: absolute;
  top: 65%;
  left: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.15);
  }
`;

const DownArrow = styled.div`
  color: white;
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
`;
