import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { MdLocationOn, MdCategory } from "react-icons/md";
import * as S from "../../styles/components/petcards/style.category";

// 카테고리 컴포넌트의 props를 정의한 인터페이스
interface CategoryProps {
  query: {
    PBLANC_BEGIN_DE: string;
    PBLANC_END_DE: string;
    SIGUN_NM: string;
    SPECIES_NM: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void; // 입력값 변경 시 처리할 함수
}

// 시군구 정보
const regions = [
  "전체",
  "가평군",
  "고양시",
  "과천시",
  "광명시",
  "광주시",
  "구리시",
  "군포시",
  "김포시",
  "남양주시",
  "동두천시",
  "부천시",
  "성남시",
  "수원시",
  "시흥시",
  "안산시",
  "안성시",
  "안양시",
  "양주시",
  "양평군",
  "여주시",
  "연천군",
  "오산시",
  "용인시",
  "기흥구",
  "의왕시",
  "의정부시",
  "이천시",
  "파주시",
  "포천시",
  "하남시",
  "화성시",
];

function Category({ query, onChange }: CategoryProps) {
  const { PBLANC_BEGIN_DE, PBLANC_END_DE, SIGUN_NM, SPECIES_NM } = query; // props로 받아온 검색 조건

  return (
    <S.Container className="category">
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <S.FlexContainer>
          <div className="box-form date">
            <label className="label" htmlFor="bgnde">
              <FaCalendarAlt className="icon" />
              &nbsp;날짜
              <b>*</b>
            </label>
            <S.CalenderContainer className="calender">
              {/* 시작 날짜 입력 */}
              <S.CalenderInput
                className="input"
                name="selectedBeginDate"
                id="PBLANC_BEGIN_DE"
                value={PBLANC_BEGIN_DE}
                onChange={onChange}
                type="date"
              />
              {/* 종료 날짜 입력 */}
              <S.CalenderInput
                className="input"
                name="selectedEndDate"
                id="PBLANC_END_DE"
                value={PBLANC_END_DE}
                onChange={onChange}
                type="date"
              />
            </S.CalenderContainer>
          </div>
          {/* 시군구 선택 */}
          <div className="box-form location">
            <label className="label" htmlFor="selectedLocation">
              <MdLocationOn className="icon" />
              &nbsp;시군구
              <b>*</b>
            </label>
            {/* 시군구 선택 목록 */}
            <select
              className="select"
              name="selectedLocation"
              id="selectedLocation"
              value={SIGUN_NM}
              onChange={onChange}
            >
              {regions?.map((region, idx) => (
                <option value={region !== "전체" ? region : ""} key={idx}>
                  {region}
                </option>
              ))}
            </select>
          </div>
          {/* 품종 선택 */}
          <div className="box-form breed">
            <label className="label" htmlFor="selectedBreed">
              <MdCategory className="icon" />
              &nbsp;품종
              <b>*</b>
            </label>
            {/* 품종 선택 목록 */}
            <select
              className="select"
              name="selectedBreed"
              id="selectedBreed"
              value={SPECIES_NM}
              onChange={onChange}
            >
              <option value="">모두</option>
              <option value="[개]">강아지</option>
              <option value="[고양이]">고양이</option>
              <option value="[기타축종]">다른친구들</option>
            </select>
          </div>
        </S.FlexContainer>
      </form>
    </S.Container>
  );
}

export default Category;
