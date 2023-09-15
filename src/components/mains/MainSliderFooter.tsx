import React from "react";
import styled from "styled-components";

function MainSliderFooter() {
  // 각각의 프로필 정보를 배열로 정의
  const profiles = [
    {
      name: "이수진",
      githubLink: "https://github.com/leesoojinn",
      blogLink: "https://soozin.tistory.com/",
      imageSrc: "/image/footer/LSJ.jpg",
    },
    {
      name: "이예지",
      githubLink: "https://github.com/nna-na",
      blogLink: "https://velog.io/@yellog",
      imageSrc: "/image/footer/LYJ.jpg",
    },
    {
      name: "안치훈",
      githubLink: "https://github.com/chihoonahn0319",
      blogLink: "https://clgnseowkd.tistory.com/",
      imageSrc: "/image/footer/ACH.jpg",
    },
    {
      name: "도지은",
      githubLink: "https://github.com/jinny0526",
      blogLink: "https://dfsfdffsfdf.tistory.com/",
      imageSrc: "/image/footer/DJE.jpg",
    },
    {
      name: "김윤지",
      blogLink: "https://blog.naver.com/99_yj",
      imageSrc: "/image/footer/KYJ.jpg",
    },
  ];

  return (
    <>
      <Container />
      <Text>
        <p className="p-1">유기동물방지 분양입양 TailTales 보호소</p>
        <p>Company Name (주)테일테일즈</p>
        <p>사업자등록번호 : 0000-0000</p>
        <p className="p-2">리더: 이수진 | 부리더: 이예지 | 팀원: 안치훈 | 팀원: 도지은 | 디자이너: 김윤지</p>
        <p className="p-3">본사문의: tailtailes@gmail.com</p>
        <p>© 2023. 테일테일즈 all rights reserved.</p>
      </Text>

      <AboutUsText>About Us</AboutUsText>
      <DottedLine />
      <Content>
        {profiles.map((profile, index) => (
          <ImageWrapper key={index}>
            <Image src={profile.imageSrc} alt={profile.name} />
            <ImageDescriptionBox>
              <ImageDescription>{profile.name}</ImageDescription>
              <LinkGroup>
                {profile.githubLink && (
                  <GitHubLink href={profile.githubLink} target="_blank" rel="noopener noreferrer">
                    <GitHubIcon src="/image/footer/git.png" alt="GitHub 아이콘" />
                  </GitHubLink>
                )}
                {profile.blogLink && (
                  <BlogLink href={profile.blogLink} target="_blank" rel="noopener noreferrer">
                    <BlogIcon src="/image/footer/blog.png" alt="블로그 아이콘" />
                  </BlogLink>
                )}
              </LinkGroup>
            </ImageDescriptionBox>
          </ImageWrapper>
        ))}
      </Content>
    </>
  );
}

export default MainSliderFooter;

const Container = styled.div`
  justify-content: center;
  align-items: flex-end;
  height: 5vh;
  /* background: linear-gradient(to bottom, #4d5441, rgba(116, 100, 100, 0)); */
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
  margin-top: 20px;
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: center;

  @media (max-width: 1349px) {
    width: 90%;
    overflow-x: auto;
    justify-content: flex-start;
  }
`;

const Text = styled.div`
  margin-top: 20px;
  margin-left: 30px;
  font-weight: bold;
  color: #333;

  .p-1,
  .p-2,
  .p-3 {
    margin-bottom: 30px;
  }
`;

const AboutUsText = styled.h2`
  text-align: center;
  margin-top: 5%;
  // margin-bottom: 50%;
`;

const DottedLine = styled.div`
  width: 100%;
  height: 1px;
  border: 1px solid #e8e8e8;
`;

const ImageDescriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* background-color: #746464; */
  padding: 10px;
  color: black;
  border-radius: 20px;
  /* margin-top: 10px; */
  min-width: 80px;
  min-height: 80px;
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
  width: 35px;
  height: 35px;
`;

const GitHubLink = styled.a`
  color: white;
  text-decoration: none;
`;

const BlogLink = styled.a`
  color: white;
  text-decoration: none;
`;
