import styled from "styled-components";

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

  .emailtext {
    margin-top: 100px;
  }

  form {
    display: flex;
    flex-direction: column;

    div {
      margin-bottom: 10px;
    }

    p {
      font-size: small;
      margin: 0 10px 10px;
    }

    input {
      width: 100%;
      height: 45px;
      padding: 5px 10px;
      font-size: 15px;
      border: none;
      border-radius: 10px;
      background: #e4dfd9;
      transition: transform 0.3s ease;
      cursor: pointer;

      &:focus {
        border-radius: 10px;
      }

      &:hover {
        transform: scale(1.05);
      }
    }

    button {
      width: 100%;
      height: 44px;
      margin: 5px 11px;
      cursor: pointer;
      font-size: 15px;
      border: none;
      color: white;
      border-radius: 999px;
      background: #746464;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
    @media (max-width: 850px) {
      width: 84%;
      padding-right: 30px;
    }
  }
  @media (max-width: 768px) {
    width: 70%;
  }
`;

export const SignupContainer = styled.div`
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

export const InputLabel = styled.div`
  margin: 5px 5px 5px 5px;
  font-weight: bold;
  justify-content: center;
`;

export const InputBox = styled.input`
  width: 282px;
  height: 30px;
  margin: 5px 5px 10px;
  padding-left: 10px;
  font-size: 15px;
  display: inline-block;
  outline: none;
  font-family: "NanumSquareNeo-Regular";

  &:focus {
    border: 2px solid #333;
    border-radius: 3px;
  }
`;

export const StButton = styled.button`
  width: 300px;
  height: 50px;
  margin: 30px;
  cursor: pointer;
  font-size: 15px;
  border-radius: 3px;
  background-color: #333;
  border: #333;
  color: white;
  font-family: "BMJUA-Regular";
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
