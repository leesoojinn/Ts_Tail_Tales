import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;
export const Textarea = styled.textarea`
  width: 950px;
  height: 50px;
  font-size: 15px;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid white;

  @media (max-width: 700px) {
    width: 260px;
  }
`;
export const SubmitButton = styled.button`
  background-color: #bdb7b0;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  margin-right: 10px;
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
