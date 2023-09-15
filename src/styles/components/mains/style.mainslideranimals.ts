import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  min-height: 100vh;
  background-color: linear-gradient(to bottom, #f0f0f0);

  @media (max-width: 650px) {
    width: 100%;
    padding-top: 100px;
  }
`;
export const CenteredText = styled.div`
  text-align: center;
  margin-bottom: 5%;

  @media (max-width: 650px) {
    padding-bottom: 40px;
  }
`;

export const ImageSlider = styled.div`
  width: 1200px;
  display: flex;
  overflow: hidden;

  @media (max-width: 650px) {
    width: 100%;
  }
`;

export const Image = styled.img`
  width: 30%;
  height: auto;
  border-radius: 20px;
  object-fit: cover;
  margin: 10px;
  transition: transform 0.5s ease;
  margin-right: -200px;

  @media (max-width: 650px) {
    width: 75%;
  }
`;
