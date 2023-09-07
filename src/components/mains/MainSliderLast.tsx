import React from "react";
import styled from "styled-components";

function MainSliderLast() {
  // 각각의 프로필 정보를 배열로 정의
  const profiles = [
    {
      name: "홍길동",
      githubLink: "GitHub 링크 주소 1",
      blogLink: "블로그 링크 주소 1",
    },
    {
      name: "김철수",
      githubLink: "GitHub 링크 주소 2",
      blogLink: "블로그 링크 주소 2",
    },
    {
      name: "김철수",
      githubLink: "GitHub 링크 주소 2",
      blogLink: "블로그 링크 주소 2",
    },
    {
      name: "김철수",
      githubLink: "GitHub 링크 주소 2",
      blogLink: "블로그 링크 주소 2",
    },
    {
      name: "김철수",
      githubLink: "GitHub 링크 주소 2",
      blogLink: "블로그 링크 주소 2",
    },
  ];

  return (
    <>
      <Container />
      <Text>기다리는 친구들</Text>
      <Text>커뮤니티</Text>
      <Content>
        {profiles.map((profile, index) => (
          <ImageWrapper key={index}>
            <Image src="/image/mains/main1.jpg" alt={profile.name} />
            <ImageDescriptionBox>
              <ImageDescription>{profile.name}</ImageDescription>
              <LinkGroup>
                <GitHubLink href={profile.githubLink} target="_blank" rel="noopener noreferrer">
                  <GitHubIcon src="/image/footer/git.png" alt="GitHub 아이콘" />
                </GitHubLink>
                <BlogLink href={profile.blogLink} target="_blank" rel="noopener noreferrer">
                  <BlogIcon src="/image/footer/git.png" alt="블로그 아이콘" />
                </BlogLink>
              </LinkGroup>
            </ImageDescriptionBox>
          </ImageWrapper>
        ))}
      </Content>
    </>
  );
}

export default MainSliderLast;

const Container = styled.div`
  justify-content: center;
  align-items: flex-end;
  height: 5vh;
  background: linear-gradient(to bottom, #4d5441, rgba(116, 100, 100, 0));
  border-radius: 0 0 50px 50px;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  margin: 10px; /* 각 프로필 간 간격을 조절 */
`;

const Image = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const Content = styled.div`
  margin-top: 100px;
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

const Text = styled.p`
  margin-top: 20px;
  margin-left: 30px;
  font-weight: bold;
  color: #333;
`;

const ImageDescriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #746464;
  padding: 10px;
  color: white;
  border-radius: 20px;
  margin-top: 10px; /* 간격을 조절합니다 */
`;

const ImageDescription = styled.p`
  margin: 0;
  font-weight: bold;
`;

const LinkGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
`;

const GitHubIcon = styled.img`
  width: 50px;
  height: 50px;
`;

const BlogIcon = styled.img`
  width: 50px;
  height: 50px;
`;

const GitHubLink = styled.a`
  color: white;
  text-decoration: none;
`;

const BlogLink = styled.a`
  color: white;
  text-decoration: none;
`;
