import React from "react";
import { useLocation } from "react-router-dom";
import { styled } from "styled-components";
import Kakao from "./Kakao";
import { formatDate } from "../api/fetchData";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";

function Detail() {
  const location = useLocation();
  console.log("location", location);

  const navigate = useNavigate();
  const { item } = location.state;

  useEffect(() => {
    // 페이지 진입 시 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
  }, []);

  const handleInquiryClick = () => {
    // 현재 창의 가로 너비를 가져옵니다.
    const windowWidth = window.innerWidth;

    // 가로 너비가 700px 이하인 경우 전화를 걸도록 처리합니다.
    if (windowWidth <= 700) {
      // SHTER_TELNO를 사용하여 전화 거는 로직을 여기에 추가하세요.
      window.location.href = `tel:${item.SHTER_TELNO}`;
    } else {
      // 가로 너비가 700px보다 큰 경우 지도 링크 열기 로직을 수행합니다.
      // const directionsUrl = createDirectionsUrl(item.SHTER_NM, item.REFINE_WGS84_LAT, item.REFINE_WGS84_LOGT);
      // window.open(directionsUrl, "_blank");

      Swal.fire({
        title: `${item.SHTER_TELNO} 로 문의 해주세요!🐶`,
        icon: "question",
      });
    }
  };

  const kakaoMapClick = () => {
    // 입양 문의하기 버튼이 클릭되었을 때 길찾기 URL을 생성하고 이동
    const directionsUrl = createDirectionsUrl(item.SHTER_NM, item.REFINE_WGS84_LAT, item.REFINE_WGS84_LOGT);
    window.open(directionsUrl, "_blank");
  };

  // 길찾기 URL 생성 함수
  const createDirectionsUrl = (destinationName: string, lat: string, log: string) => {
    const destination = `${destinationName},${lat},${log}`;
    return `https://map.kakao.com/link/to/${destination}`;
  };

  return (
    <StDetailDivContainer>
      <DetailContainer className="detail container">
        <StDetailText style={{ display: "flex", alignItems: "center" }}>
          <BackIcon
            className="backBtn"
            onClick={() => {
              navigate("/home");
            }}
          >
            〈
          </BackIcon>
          <h2 className="detailtext">상세보기</h2>
        </StDetailText>
        <div className="top">
          <div className="img-container">
            <img
              className="petimg"
              src={item.IMAGE_COURS}
              alt={item.ABDM_IDNTFY_NO}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                target.src = "/image/header/profile.jpg";
              }}
            />{" "}
            <div id={item.ABDM_IDNTFY_NO} data-pet={item.pet} />
          </div>
          <div className="description">
            <div className="noticeNo">
              <span>공고번호</span>
              <span>{item.PBLANC_IDNTFY_NO}</span>
            </div>
            <div className="table">
              <div className="row">
                <Title>품종</Title>
                <span>{item.SPECIES_NM.split("]")[1]}</span>
              </div>
              <div className="row">
                <Title>성별</Title>
                <span>{item.SEX_NM}</span>
              </div>
              <div className="row">
                <Title>중성화 여부</Title>
                <span>{item.NEUT_YN}</span>
              </div>
              <div className="row">
                <Title>나이 / 체중</Title>
                <span>
                  {new Date().getFullYear() - item.AGE_INFO.slice(0, 4) + 1}살 / &nbsp;
                  {item.BDWGH_INFO.split("(")[0]}kg
                </span>
              </div>
              <div className="row">
                <Title>접수일시</Title>
                <span>{formatDate(item.RECEPT_DE)}</span>
              </div>
              <div className="row">
                <Title>발견장소</Title>
                <span>{item.DISCVRY_PLC_INFO}</span>
              </div>
              <div className="row">
                <Title>특징</Title>
                <span>{item.SFETR_INFO}</span>
              </div>
              <div className="row">
                <Title>공고기한</Title>
                <span>
                  {formatDate(item.PBLANC_BEGIN_DE)} ~{formatDate(item.PBLANC_END_DE)}
                </span>
              </div>
              <div className="row">
                <Title>보호센터</Title>
                <span>{item.SHTER_NM}</span>
              </div>
              <div className="row">
                <Title>보호센터 주소</Title>
                <span>{item.REFINE_ROADNM_ADDR}</span>
              </div>
              <div className="row">
                <Title>보호센터 연락처</Title>
                <span>{item.SHTER_TELNO}</span>
              </div>
              <div className="row">
                <Title>보호장소</Title>
                <span>{item.PROTECT_PLC}</span>
              </div>
            </div>
          </div>
        </div>
        <InquiryButton onClick={handleInquiryClick}>입양 문의하기</InquiryButton>
        <InquiryButton onClick={kakaoMapClick}>만나러 가는 길</InquiryButton>
        <div className="location">
          <p>
            <span>{item.SHTER_NM}</span>
            에서 기다리고 있어요!
          </p>
          <div className="kakaomap">
            <Kakao lat={item.REFINE_WGS84_LAT} log={item.REFINE_WGS84_LOGT} shelter={item.SHTER_NM} kind={item.SPECIES_NM.split(" ")[0]} />
          </div>
        </div>
      </DetailContainer>
    </StDetailDivContainer>
  );
}

export default Detail;

const StDetailDivContainer = styled.div`
  position: relative;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: #fdfaf6;
`;

const StDetailText = styled.div`
  margin-top: 100px;
  padding-left: 20px;
  color: black;
  .backBtn {
    background: none;
    border: none;
    color: black;
  }
  .detailtext {
    margin: 0 auto;
    max-width: 350px;
    padding: 20px 0 20px;
  }

  strong {
    color: #746464;
  }
`;
const BackIcon = styled.button`
  margin-left: 20px;
  // margin-right: 5px;
  font-size: 20px;
  font-weight: bolder;
  border-radius: 50%;
  color: black;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.7);
    color: #868686;
  }
`;
const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: white;

  /* 기존 스타일 유지 */

  /* 중앙 정렬 및 양옆 공백 설정 */
  max-width: 1200px; /* 원하는 최대 너비로 조정 */
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
    background: #fdfaf6;
  }

  .petimg {
    border-radius: 20px;
    border: none;
    height: 680px;

    @media (max-width: 770px) {
      height: 400px;
    }
  }

  .top {
    background: white;
    border: 1px solid black;
    padding: 15px 15px 15px 15px;
    border-radius: 20px;
    border: none;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);

    display: flex;
    flex-direction: column;

    @media (min-width: 768px) {
      flex-direction: row;
      gap: 2rem; /* 이미지와 표 사이 간격 조정 */
    }
  }

  .img-container {
    position: relative;
    height: fit-content;
    overflow: hidden;

    @media (min-width: 768px) {
      width: 50%;
      margin-bottom: 0;
    }

    img {
      width: 100%;
      /* border: 1px solid ${(props) => props.theme.textBlack}; */
      aspect-ratio: 1/1;
      object-fit: cover;
    }
  }

  .description {
    font-size: 17px;
    font-family: "NanumSquareNeo-Regular";

    @media (min-width: 768px) {
      width: 50%;
    }

    .noticeNo {
      width: 100%;

      font-size: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #000000;
      padding-block: 1rem;
      /* border: 1px solid ${(props) => props.theme.textBlack}; */
    }

    .table {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      font-size: ${(props) => props.theme.pSize};

      .row {
        display: grid;
        grid-template-columns: 0.5fr 1fr;
        text-align: center;
        grid-template-rows: auto;
        padding: 0.7rem 0.5rem;
        border-bottom: 1px solid ${(props) => props.theme.textBlack};
        /* border-inline: 1px solid ${(props) => props.theme.textBlack}; */

        span {
          display: flex;
          justify-content: center;
          align-items: center;

          &:nth-child(1) {
            border-right: 1px solid ${(props) => props.theme.textBlack};
            font-weight: 600;
          }
          &:nth-child(2) {
            padding-left: 0.5rem;
          }
        }
      }
    }
  }

  .location {
    font-size: ${(props) => props.theme.pSize};
    color: ${(props) => props.theme.textBlack};
    p {
      padding-bottom: 2rem;
      span {
        font-weight: 600;
      }
    }

    .kakaomap {
      padding-bottom: 20px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
    }
  }
`;

const InquiryButton = styled.button`
  margin: 0 auto;
  width: 232px;
  height: 44px;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 999px;
  background: #746464;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);

  font-family: "BMJUA-Regular";

  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Title = styled.span`
  font-size: 20px;
  font-family: "BMJUA-Regular";
`;
