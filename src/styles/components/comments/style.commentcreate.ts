import styled from "styled-components";

export const CreateContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #fdfaf6;
  border-radius: 8px;
  background-color: white;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
`;
export const CreateForm = styled.form`
  display: flex;
  flex-direction: column;
`;
export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
`;
export const CreateTextarea = styled.textarea`
  padding: 8px;
  border: 1px solid white;
  border-radius: 8px;
  resize: none;
`;
export const CreateButton = styled.button`
  background-color: #746464;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  text-decoration: none;
  font-size: 13px;
  align-self: flex-end;
  width: fit-content;
  font-family: "BMJUA-Regular";

  &:hover {
    background-color: #606060;
  }
`;
