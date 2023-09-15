import styled from "styled-components";
import ReactQuill from "react-quill";

export const PostImgContainer = styled.div`
  width: 1000px;
  height: 450px;
  margin-bottom: 50px;
  background-color: white;

  @media screen and (max-width: 700px) {
    width: 370px;
    height: 420px;
  }
`;

export const StReactQuill = styled(ReactQuill)`
  width: 100%;
  height: 91%;

  @media screen and (max-width: 700px) {
    height: 85%;
  }
`;
