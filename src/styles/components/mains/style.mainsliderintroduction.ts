import styled from "styled-components";

export const TextWrap = styled.div`
  color: white;
  text-align: center;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-shadow: 2px 2px 4px rgba(128, 128, 128, 0.5);
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin-top: 0;
`;

export const ImageContainer = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
  overflow: hidden;

  @media (min-width: 1349px) {
    width: 100%;
    padding: 0 2rem;
    background: #fdfaf6;
  }
`;

export const ImageBackground = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
`;

export const Button = styled.button`
  width: 130px;
  height: 50px;
  background-color: rgba(87, 76, 76, 0.7);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #fdfaf6;
  border: none;
  padding: 10px;
  border-radius: 30px;
  cursor: pointer;
  z-index: 2;
  position: absolute;
  bottom: 180px;
  transition: transform 0.3s ease;
  font-family: "BMJUA-Regular";

  &:hover {
    transform: scale(1.15);
  }
`;

export const DownArrow = styled.div`
  color: white;
  position: absolute;
  bottom: 130px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Title = styled.h1`
  line-height: 40px;

  @media (max-width: 1349px) {
    font-size: 30px;
    line-height: 35px;
  }
`;

export const Content = styled.span`
  font-size: 18px;
  color: #f0eeee;

  @media (max-width: 1349px) {
    font-size: 15px;
  }
`;
