import React, { useEffect } from "react"; // 컴포넌트가 렌더링, 업데이트, 언마운트될 때 등에 특정 작업 수행
import { useLocation, useNavigate } from "react-router-dom"; // 현재 페이지의 URL 정보와 페이지 간의 네비게이션을 처리하는 데 사용
import Kakao from "./Kakao"; // Kakao 지도 컴포넌트
import { formatDate } from "../api/fetchData"; // 날짜 형식 변환 함수
import Swal from "sweetalert2"; // SweetAlert2를 사용하여 알림창 표시
import * as S from "../styles/pages/style.detail"; // 스타일 관련 모듈

function Detail() {
  const location = useLocation(); // 현재 페이지의 URL 정보를 가져오는 React Router 훅을 사용하는 코드
  const navigate = useNavigate(); // 페이지 간의 네비게이션을 처리하는 React Router 훅을 사용하는 코드
  const { item } = location.state; // 상세 정보 페이지로부터 전달된 데이터

  useEffect(() => {
    // 라이프사이클에서 특정 작업을 수행하도록 허용하는 훅
    window.scrollTo(0, 0); // 페이지가 로드될 때 스크롤을 맨 위로 이동
  }, []);

  // 입양 문의 버튼 클릭 시 동작
  const handleInquiryClick = () => {
    const windowWidth = window.innerWidth; // 현재 브라우저 창의 너비를 가져와서 windowWidth 변수에 저장

    if (windowWidth <= 700) {
      // 화면 너비가 700px 이하인 경우 전화걸기
      window.location.href = `tel:${item.SHTER_TELNO}`;
    } else {
      // 그 외에는 SweetAlert2를 사용하여 정보 표시
      Swal.fire({
        title: `${item.SHTER_TELNO} 로 문의 해주세요!🐶`,
        icon: "info",
      });
    }
  };

  // 카카오 지도 버튼 클릭 시 동작
  const kakaoMapClick = () => {
    const directionsUrl = createDirectionsUrl(
      // 카카오 지도에서 특정 장소로의 방향 정보를 제공하는 URL을 생성
      item.SHTER_NM,
      item.REFINE_WGS84_LAT,
      item.REFINE_WGS84_LOGT
    );
    window.open(directionsUrl, "_blank");
  };

  // 카카오 지도 방향 정보 URL 생성 함수
  const createDirectionsUrl = (
    destinationName: string,
    lat: string,
    log: string
  ) => {
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
              navigate("/home"); // 뒤로 가기 버튼 클릭 시 홈 페이지로 이동
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
            {/* 경기도 유기동물 현황 API에서 각각의 정보를 동적으로 데이터를 받아와 표시 */}
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
                  {new Date().getFullYear() - item.AGE_INFO.slice(0, 4) + 1}살 /
                  &nbsp;
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
                  {formatDate(item.PBLANC_BEGIN_DE)} ~
                  {formatDate(item.PBLANC_END_DE)}
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
        <S.InquiryButton onClick={handleInquiryClick}>
          입양 문의하기
        </S.InquiryButton>
        <S.InquiryButton onClick={kakaoMapClick}>
          만나러 가는 길
        </S.InquiryButton>
        <div className="location">
          <p>
            <span>{item.SHTER_NM}</span>
            에서 기다리고 있어요!
          </p>
          <div className="kakaomap">
            <Kakao
              lat={item.REFINE_WGS84_LAT}
              log={item.REFINE_WGS84_LOGT}
              shelter={item.SHTER_NM}
              kind={item.SPECIES_NM.split(" ")[0]}
            />
          </div>
        </div>
      </S.DetailContainer>
    </S.StDetailDivContainer>
  );
}

export default Detail;
