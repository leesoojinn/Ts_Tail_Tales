import styled from "styled-components";
import { Link } from "react-router-dom";

export const OuterContainer = styled.div`
  background-color: #fdfaf6;
  display: flex;
  justify-content: center;
  position: relative;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

export const Container = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background-color: #fdfaf6;
  border-radius: 20px;
`;

export const StDetailText = styled.div`
  margin-top: 100px;
  color: black;

  .backBtn {
    background: none;
    border: none;
    color: black;
  }

  .detailtext {
    margin: 0 auto;
    max-width: 350px;
    padding: 20px 0 20px;
  }

  strong {
    color: #746464;
  }
`;

export const BackIcon = styled.button`
  margin-right: 5px;
  font-size: 20px;
  font-weight: bolder;
  border-radius: 50%;
  color: black;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.7);
    color: #868686;
  }
`;

export const Title = styled.h3`
  border: 1px solid #fdfaf6;
  border-radius: 3px;
  padding: 10px;
  font-size: 32px;
  text-align: center;
  margin: 20px 0;
  background-color: white;
  border-radius: 20px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
`;

export const Content = styled.div`
  border: 1px solid #fdfaf6;
  border-radius: 8px;
  text-align: center;
  overflow: hidden;
  margin-bottom: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  line-height: 2;

  font-family: "NanumSquareNeo-Regular";

  img {
    max-width: 100%;
    height: auto;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
  padding: 10px 0;
`;

export const EditButton = styled(Link)`
  background-color: #bdb7b0;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  text-decoration: none;
  font-size: 13px;
  margin-right: 10px;
  font-family: "BMJUA-Regular";

  &:hover {
    background-color: #606060;
  }
`;

export const DeleteButton = styled.button`
  background-color: #746464;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  text-decoration: none;
  font-size: 13px;
  margin-right: 10px;
  font-family: "BMJUA-Regular";

  &:hover {
    background-color: #606060;
  }
`;

export const LoadingText = styled.div`
  font-size: 1.2rem;
  color: gray;
`;

export const ErrorText = styled.div`
  font-size: 1.2rem;
  color: red;
`;
