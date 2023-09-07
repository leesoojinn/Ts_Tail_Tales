import React from "react";
import { useLocation } from "react-router-dom";
import { styled } from "styled-components";
import Kakao from "./Kakao";
import { formatDate } from "../api/fetchData";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Detail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state;

  const handleInquiryClick = () => {
    alert("입양 문의하기 버튼이 클릭되었습니다.");
  };
  return (
    <>
      <BackButton
        onClick={() => {
          navigate("/home");
        }}
      >
        <BackIcon />
        뒤로가기
      </BackButton>
      <DetailContainer className="detail container">
        <div className="top">
          <div className="img-container">
            <img className="petimg" src={item.IMAGE_COURS} alt={item.ABDM_IDNTFY_NO} />
            <div id={item.ABDM_IDNTFY_NO} data-pet={item.pet} />
          </div>
          <div className="description">
            <div className="noticeNo">
              <span>공고번호</span>
              <span>{item.PBLANC_IDNTFY_NO}</span>
            </div>
            <div className="table">
              <div className="row">
                <span>품종</span>
                <span>{item.SPECIES_NM.split("]")[1]}</span>
              </div>
              <div className="row">
                <span>성별</span>
                <span>{item.SEX_NM}</span>
              </div>
              <div className="row">
                <span>중성화 여부</span>
                <span>{item.NEUT_YN}</span>
              </div>
              <div className="row">
                <span>나이 / 체중</span>
                <span>
                  {new Date().getFullYear() - item.AGE_INFO.slice(0, 4) + 1}살 / &nbsp;
                  {item.BDWGH_INFO.split("(")[0]}kg
                </span>
              </div>
              <div className="row">
                <span>접수일시</span>
                <span>{item.RECEPT_DE}</span>
              </div>
              <div className="row">
                <span>빌견장소</span>
                <span>{item.DISCVRY_PLC_INFO}</span>
              </div>
              <div className="row">
                <span>특징</span>
                <span>{item.SFETR_INFO}</span>
              </div>
              <div className="row">
                <span>공고기한</span>
                <span>
                  {formatDate(item.PBLANC_BEGIN_DE)} ~{formatDate(item.PBLANC_END_DE)}
                </span>
              </div>
              <div className="row">
                <span>보호센터</span>
                <span>{item.SHTER_NM}</span>
              </div>
              <div className="row">
                <span>보호센터 주소</span>
                <span>{item.REFINE_ROADNM_ADDR}</span>
              </div>
              <div className="row">
                <span>보호센터 연락처</span>
                <span>{item.SHTER_TELNO}</span>
              </div>
              <div className="row">
                <span>보호장소</span>
                <span>{item.PROTECT_PLC}</span>
              </div>
            </div>
          </div>
        </div>
        <InquiryButton onClick={handleInquiryClick}>입양 문의하기</InquiryButton>
        <div className="location">
          <p>
            <span>{item.SHTER_NM}</span>
            에서 기다리고 있어요!
          </p>

          <Kakao lat={item.REFINE_WGS84_LAT} log={item.REFINE_WGS84_LOGT} shelter={item.SHTER_NM} kind={item.SPECIES_NM.split(" ")[0]} />
        </div>
      </DetailContainer>
    </>
  );
}

export default Detail;
const BackButton = styled.button`
  margin-top: 20px;
  margin-left: 200px;
  padding: 10px 20px;
  background-color: #f8b3b3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    background-color: #f8b3b3;
    transform: scale(1.05);
  }
`;

const BackIcon = styled(FiArrowLeft)`
  margin-right: 5px;
`;
const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  /* 기존 스타일 유지 */

  /* 중앙 정렬 및 양옆 공백 설정 */
  max-width: 1200px; /* 원하는 최대 너비로 조정 */
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }

  .petimg {
    border-radius: 20px;
    border: none;
    height: 680px;
  }

  .top {
    border: 1px solid black;
    padding: 15px 15px 15px 15px;
    border-radius: 20px;
    border: none;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);

    display: flex;
    flex-direction: column;
    margin-top: 2rem;

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
  }
`;
const InquiryButton = styled.button`
  /* 스타일링 설정 */
  background-color: ${(props) => props.theme.primaryColor};
  color: #000000;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.primaryColorHover};
  }
`;
