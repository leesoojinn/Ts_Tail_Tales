import styled from "styled-components";

export const PetImg = styled.img`
  width: 250px;
  height: 200px;
  object-fit: cover;
  object-position: center;
  margin-left: 11px;
  &:hover {
    filter: brightness(110%);
  }
`;

export const Box = styled.div`
  height: 450px;
  padding: 10px 10px 10px 10px;
  width: calc(33.33% - 10px);
  padding: 10px;
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
  margin-top: 15px;
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

export const InfoContainer = styled.div`
  padding-top: 25px;
  margin-left: 15px;
  line-height: 1.5;
  font-family: "NanumSquareNeo-Regular";
`;

export const Text = styled.p`
  margin: -7px 0;
  font-size: 17px;
  padding-left: 15px;
`;
