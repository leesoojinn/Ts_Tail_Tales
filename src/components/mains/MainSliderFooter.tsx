import React from "react";
import * as S from "../../styles/components/mains/style.mainsliderfooter";

function MainSliderFooter() {
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
      <S.Container />
      <S.Text>
        <p className="p-1">유기동물방지 분양입양 TailTales 보호소</p>
        <p>Company Name (주)테일테일즈</p>
        <p>사업자등록번호 : 0000-0000</p>
        <p className="p-2">
          리더: 이수진 | 부리더: 이예지 | 팀원: 안치훈 | 팀원: 도지은 |
          디자이너: 김윤지
        </p>
        <p className="p-3">본사문의: tailtales@gmail.com</p>
        <p>Copyright 2023. 테일테일즈 all rights reserved.</p>
      </S.Text>

      <S.AboutUsText>About Us</S.AboutUsText>
      <S.DottedLine />
      <S.Content>
        {profiles.map((profile, index) => (
          <S.ImageWrapper key={index}>
            <S.Image src={profile.imageSrc} alt={profile.name} />
            <S.ImageDescriptionBox>
              <S.ImageDescription>{profile.name}</S.ImageDescription>
              <S.LinkGroup>
                {profile.githubLink && (
                  <S.GitHubLink
                    href={profile.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <S.GitHubIcon
                      src="/image/footer/git.png"
                      alt="GitHub 아이콘"
                    />
                  </S.GitHubLink>
                )}
                {profile.blogLink && (
                  <S.BlogLink
                    href={profile.blogLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <S.BlogIcon
                      src="/image/footer/blog.png"
                      alt="블로그 아이콘"
                    />
                  </S.BlogLink>
                )}
              </S.LinkGroup>
            </S.ImageDescriptionBox>
          </S.ImageWrapper>
        ))}
      </S.Content>
    </>
  );
}

export default MainSliderFooter;
