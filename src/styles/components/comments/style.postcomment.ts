import styled from "styled-components";

export const CommentContainer = styled.div`
  border-radius: 8px;
  padding: 10px 0 0 20px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  background-color: white;
  border: 1px solid #fdfaf6;
  font-family: "NanumSquareNeo-Regular";
`;
export const EditButton = styled.button`
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
