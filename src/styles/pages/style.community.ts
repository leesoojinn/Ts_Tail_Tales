import styled from "styled-components";
import { Link } from "react-router-dom";

export const StDetailDivContainer = styled.div`
  position: relative;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fdfaf6;
`;
export const Container = styled.div`
  min-height: 100vh;
  padding: 20px;
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

export const LogoImage = styled.img`
  width: 130px;
  height: 80px;
  margin-right: 20px;
`;

export const ContentContainer = styled.div`
  padding-top: 70px;
  max-width: 1000px;
  margin: 0 auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fdfaf6;

  thead th {
    background-color: #9f9292;
    color: white;
    text-align: left;
    padding: 12px;
    font-weight: bold;
    font-size: small;
    border: 2px solid #2c2626;
  }

  th.no-border {
    border: none;
  }

  td {
    padding: 12px;
    text-align: left;
    border-top: 1px solid #ddd;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 10%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 50%;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 18%;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 15%;
  }

  th:nth-child(5),
  td:nth-child(5) {
    width: 0%;
  }
`;

export const StyledRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.3s ease;

  td {
    padding: 12px;
    text-align: left;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  &:hover {
    background-color: #cfc3b5;
    animation: flash 0.5s;
  }

  @keyframes flash {
    0% {
      background-color: transparent;
    }
    50% {
      background-color: #cfc6bc;
    }
    100% {
      background-color: transparent;
    }
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

export const CreateButton = styled(Link)`
  position: fixed;
  bottom: 20px;
  right: 60px;
  width: 100px;
  height: 40px;
  background-color: #746464;
  color: white;
  border-radius: 40px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #dd3a3a;
    transform: scale(1.05);
  }
`;

export const CreateBtn = styled.h2`
  font-size: 15px;
`;
