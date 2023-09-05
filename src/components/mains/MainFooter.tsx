import React from "react";
import styled from "styled-components";

function MainFooter() {
  return (
    <>
      <Container />
      <Content>
        <Text>기다리는 친구들</Text>
        <Text>커뮤니티</Text>
        <Text>about us</Text>
      </Content>
    </>
  );
}

export default MainFooter;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 20vh;
  background-color: hsl(30, 1%, 53%); /* 배경색 설정 */
  border-radius: 0 0 50px 50px; /* 아래쪽 모서리에만 반지름 설정 */
`;

const Content = styled.div`
  padding: 20px;
`;

const Text = styled.p`
  font-weight: bold;
  color: #333;
`;
