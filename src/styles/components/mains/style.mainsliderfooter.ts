import styled from "styled-components";

export const Container = styled.div`
  justify-content: center;
  align-items: flex-end;
  height: 5vh;
  border-radius: 0 0 50px 50px;
`;

export const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  margin: 10px;
`;

export const Image = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

export const Content = styled.div`
  margin-top: 20px;
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: center;

  @media (max-width: 770px) {
    display: none;
  }
`;

export const Text = styled.div`
  margin-top: 20px;
  margin-left: 30px;
  font-weight: bold;
  color: #333;

  .p-1,
  .p-2,
  .p-3 {
    margin-bottom: 30px;
  }

  @media (max-width: 770px) {
    margin-top: 200px;
  }
`;

export const AboutUsText = styled.h2`
  text-align: center;
  margin-top: 5%;

  @media (max-width: 770px) {
    display: none;
  }
`;

export const DottedLine = styled.div`
  width: 100%;
  height: 1px;
  border: 1px solid #e8e8e8;

  @media (max-width: 770px) {
    display: none;
  }
`;

export const ImageDescriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
  color: black;
  border-radius: 20px;
  min-width: 80px;
  min-height: 80px;
`;

export const ImageDescription = styled.p`
  margin: 0;
  font-weight: bold;
`;

export const LinkGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
`;

export const GitHubIcon = styled.img`
  width: 50px;
  height: 50px;
`;

export const BlogIcon = styled.img`
  width: 35px;
  height: 35px;
`;

export const GitHubLink = styled.a`
  color: white;
  text-decoration: none;
`;

export const BlogLink = styled.a`
  color: white;
  text-decoration: none;
`;
