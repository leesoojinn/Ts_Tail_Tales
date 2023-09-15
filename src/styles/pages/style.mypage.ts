import styled from "styled-components";

export const StDetailText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  margin-top: 50px;
  padding-right: 40px;
  .backBtn {
    background: none;
    border: none;
    color: black;
    margin-right: 5px;
    font-size: 20px;
    font-weight: bolder;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.1);
      color: #868686;
    }
  }
  .detailtext {
    margin: 0 auto;
    text-align: center;
    max-width: 350px;
    padding: 20px 0 20px;
  }
  strong {
    color: #746464;
  }
`;
export const BackIcon = styled.button`
  margin-left: 20px;

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
export const MyPage = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 1349px) {
    flex-direction: row;
  }
  align-items: flex-start;
  height: 600px;
  div {
  }
`;
export const LeftContent = styled.div`
  min-width: 25%;

  background-color: #746464;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  input {
    margin-top: 20px;
    padding: 10px;
    background-color: #333;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  label {
    cursor: pointer;

    &:hover {
      color: white;
    }
  }

  @media (max-width: 1349px) {
    width: 100%;
  }

  h3 {
    display: inline-flex;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    background: #746464;
    color: #fff;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    @media (max-width: 1349px) {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  h4 {
    color: white;
  }
`;
export const RightContent = styled.div`
  width: 75%;
  height: 100%;
  background-color: #fdfaf6;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h3 {
    display: inline-flex;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 20px;
    background: #746464;
    color: #fff;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  @media (max-width: 1349px) {
    width: 100%;
  }
`;
export const Container = styled.div`
  display: flex;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 15px;
  @media (max-width: 1349px) {
    width: 90%;
    overflow-x: auto;
    justify-content: flex-start;
  }
`;
export const AvatarImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-top: 20px;
`;
export const BottomText = styled.h5`
  position: absolute;
  margin-bottom: -600px;
  font-size: 16px;
  color: #746464;
  @media (max-width: 1349px) {
    display: none;
  }
`;
