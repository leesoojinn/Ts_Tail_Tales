import styled from "styled-components";

export const Contain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: white;

  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
    background: #fdfaf6;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-image: url("/image/landings/landing13.gif");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  min-height: 100vh;

  margin-top: -90px;
  padding-top: 10px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export const TitleText = styled.h1`
  color: white;
  margin-bottom: 7%;

  @media (max-width: 768px) {
    font-size: 30px;
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ImageWrapper = styled.div`
  text-align: center;
  margin: 10px;
  width: 33.33%;
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 1.5s ease-in-out, transform 1.5s ease-in-out;
  &.show {
    opacity: 1;
    transform: translateX(0);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ImgContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

export const Img = styled.img`
  width: 300px;
  height: 200px;
  border-radius: 20px;
  object-fit: cover;
  &:hover {
    filter: brightness(110%);
  }

  @media (max-width: 768px) {
    width: 200px;
    height: 150px;
  }
`;

export const Space = styled.span`
  padding-left: 50px;
  padding-right: 50px;

  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

export const ImageCaption = styled.p`
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
