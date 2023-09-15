import styled from "styled-components";

export const TopButton = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  color: #fff;
  padding: 10px 20px;
  cursor: pointer;
  z-index: 1002px;
`;

export const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url("/image/layout/paws.png") no-repeat center center;
  background-size: 100% auto;
  width: 50px;
  height: 50px;
`;

export const TopText = styled.span`
  padding-top: 25px;
  font-size: 14px;
`;
