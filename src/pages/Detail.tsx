import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Kakao from "./Kakao";
import { formatDate } from "../api/fetchData";
import Swal from "sweetalert2";
import * as S from "../styles/pages/style.detail";

function Detail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInquiryClick = () => {
    const windowWidth = window.innerWidth;

    if (windowWidth <= 700) {
      window.location.href = `tel:${item.SHTER_TELNO}`;
    } else {
      Swal.fire({
        title: `${item.SHTER_TELNO} 로 문의 해주세요!🐶`,
        icon: "info",
      });
    }
  };

  const kakaoMapClick = () => {
    const directionsUrl = createDirectionsUrl(item.SHTER_NM, item.REFINE_WGS84_LAT, item.REFINE_WGS84_LOGT);
    window.open(directionsUrl, "_blank");
  };

  const createDirectionsUrl = (destinationName: string, lat: string, log: string) => {
    const destination = `${destinationName},${lat},${log}`;
    return `https://map.kakao.com/link/to/${destination}`;
  };

  return (
    <S.StDetailDivContainer>
      <S.DetailContainer className="detail container">
        <S.StDetailText style={{ display: "flex", alignItems: "center" }}>
          <S.BackIcon
            className="backBtn"
            onClick={() => {
              navigate("/home");
            }}
          >
            〈
          </S.BackIcon>
          <h2 className="detailtext">상세보기</h2>
        </S.StDetailText>
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
              <span className="date">{item.PBLANC_IDNTFY_NO}</span>
            </div>
            <div className="table">
              <div className="row">
                <S.Title>품종</S.Title>
                <span>{item.SPECIES_NM.split("]")[1]}</span>
              </div>
              <div className="row">
                <S.Title>성별</S.Title>
                <span>{item.SEX_NM}</span>
              </div>
              <div className="row">
                <S.Title>중성화 여부</S.Title>
                <span>{item.NEUT_YN}</span>
              </div>
              <div className="row">
                <S.Title>나이 / 체중</S.Title>
                <span>
                  {new Date().getFullYear() - item.AGE_INFO.slice(0, 4) + 1}살 / &nbsp;
                  {item.BDWGH_INFO.split("(")[0]}kg
                </span>
              </div>
              <div className="row">
                <S.Title>접수일시</S.Title>
                <span>{formatDate(item.RECEPT_DE)}</span>
              </div>
              <div className="row">
                <S.Title>발견장소</S.Title>
                <span>{item.DISCVRY_PLC_INFO}</span>
              </div>
              <div className="row">
                <S.Title>특징</S.Title>
                <span>{item.SFETR_INFO}</span>
              </div>
              <div className="row">
                <S.Title>공고기한</S.Title>
                <span>
                  {formatDate(item.PBLANC_BEGIN_DE)} ~{formatDate(item.PBLANC_END_DE)}
                </span>
              </div>
              <div className="row">
                <S.Title>보호센터</S.Title>
                <span>{item.SHTER_NM}</span>
              </div>
              <div className="row">
                <S.Title>보호센터 주소</S.Title>
                <span>{item.REFINE_ROADNM_ADDR}</span>
              </div>
              <div className="row">
                <S.Title>보호센터 연락처</S.Title>
                <span>{item.SHTER_TELNO}</span>
              </div>
              <div className="row">
                <S.Title>보호장소</S.Title>
                <span>{item.PROTECT_PLC}</span>
              </div>
            </div>
          </div>
        </div>
        <S.InquiryButton onClick={handleInquiryClick}>입양 문의하기</S.InquiryButton>
        <S.InquiryButton onClick={kakaoMapClick}>만나러 가는 길</S.InquiryButton>
        <div className="location">
          <p>
            <span>{item.SHTER_NM}</span>
            에서 기다리고 있어요!
          </p>
          <div className="kakaomap">
            <Kakao lat={item.REFINE_WGS84_LAT} log={item.REFINE_WGS84_LOGT} shelter={item.SHTER_NM} kind={item.SPECIES_NM.split(" ")[0]} />
          </div>
        </div>
      </S.DetailContainer>
    </S.StDetailDivContainer>
  );
}

export default Detail;
