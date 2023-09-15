import styled from "styled-components";

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const LeftSide = styled.div`
  width: 50%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const RightSide = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fdfaf6;

  h2 {
    padding: 100px 0 20px;
    margin-top: 50px;
  }
  @media (max-width: 768px) {
    width: 70%;
  }
`;

export const LoginFormContainer = styled.div`
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 20px;
    margin-right: 20px;
  }

  form {
    display: flex;
    flex-direction: column;

    div {
      margin-bottom: 20px;
    }

    input {
      width: 270px;
      height: 45px;
      padding: 5px 16px;
      font-size: 15px;
      border: none;
      border-radius: 10px;
      background: #e4dfd9;
      transition: transform 0.3s ease;
      cursor: pointer;
      font-family: "NanumSquareNeo-Regular";

      &:focus {
        border-radius: 10px;
      }

      &:hover {
        transform: scale(1.05);
      }

      @media (max-width: 768px) {
        width: 100%;
        margin: 10px 0;
      }
    }

    button {
      width: 192px;
      height: 44px;
      margin: 5px 55px;
      cursor: pointer;
      font-size: 15px;
      border: none;
      color: white;
      border-radius: 999px;
      background: #746464;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
      font-family: "BMJUA-Regular";

      &:hover {
        transform: scale(1.05);
      }

      @media (max-width: 768px) {
        width: 100%;
        margin: 10px 15px;
      }
    }
  }
`;

export const KakaoLoginBtn = styled.button`
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  .kakaoimg {
    width: 45px;
    height: auto;
  }
`;

export const GoogleLoginBtn = styled.button`
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  .googleimg {
    width: 45px;
    height: auto;
  }
`;

export const NoAccountMessage = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #555;

  a {
    color: #333;
    text-decoration: underline;

    &:hover {
      color: #555;
    }
  }
`;
