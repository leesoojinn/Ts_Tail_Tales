import styled from "styled-components";

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
  padding: 70px;
  margin: 0 auto;
  background-color: #fdfaf6;

  h2 {
    text-align: center;
    margin-bottom: 40px;
  }

  @media screen and (max-width: 700px) {
    height: 100vh;
    left: 0;
    right: 0;
    overflow-y: auto;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FormButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  padding-bottom: 25px;

  @media screen and (max-width: 700px) {
    position: absolute;
    width: 250px;
    margin-top: 550px;
  }
`;

export const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;
export const Input = styled.input`
  width: 978px;
  height: 30px;
  padding: 15px 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  font-size: large;

  @media screen and (max-width: 700px) {
    width: 350px;
  }
`;

export const SubmitButton = styled.button`
  color: white;
  border: none;
  cursor: pointer;
  width: 192px;
  height: 44px;
  padding: 8px;
  border-radius: 999px;
  background: #746464;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
  font-family: "BMJUA-Regular";

  ${(props) => (props.className === "backbtn" ? "background: #bdb7b0;" : "background: #746464;")}

  &:hover {
    background-color: #dd3a3a;
    transform: scale(1.05);
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
