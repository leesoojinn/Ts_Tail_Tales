import styled from "styled-components";

interface PageNumberProps {
  isActive: boolean;
}
export const Div = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 30px;
`;

export const PageNumber = styled.div<PageNumberProps>`
  cursor: pointer;
  margin: 0 10px;
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
  display: inline-block;
`;
