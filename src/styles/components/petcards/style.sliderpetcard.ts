import styled from "styled-components";

export const ImgContainer = styled.div`
  position: relative;
  cursor: pointer;
  transition: transform 0.5s ease;
  &:hover {
    transform: scale(1.05);
  }
`;
export const Img = styled.img`
  width: 270px;
  height: 350px;

  object-fit: cover;
`;
export const ImageCaption = styled.p`
  color: black;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin-bottom: 60px;
  padding-bottom: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  font-weight: bold;
  text-align: center;
`;
export const PetImg = styled.img`
  width: 100%;
  height: 250px;
  max-width: 500px;
  object-fit: cover;
  &:hover {
    filter: brightness(110%);
  }
`;
export const Box = styled.div`
  height: 550px;
  padding: 10px 10px 10px 10px;
  border: 1px solid black;
  width: calc(33.33% - 10px);
  padding: 10px;
  margin-bottom: 20px;
  flex: 0 0 300px;
  box-sizing: border-box;
  background-color: white;
  border-radius: 20px;
  border: none;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  overflow: hidden;

  &:hover {
    .details-message {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .favorite-container {
    display: flex;
    align-items: center;
  }
  .number {
    margin-left: 10px;
    font-weight: bold;
    font-size: larger;
  }
  .petimg {
    border-radius: 20px;
  }
`;
export const DetailsMessage = styled.p`
  display: block;
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  color: #555;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s, transform 0.3s;

  .petcard:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;
