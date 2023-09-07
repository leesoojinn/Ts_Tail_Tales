import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { MdLocationOn, MdCategory } from "react-icons/md";
import styled from "styled-components";

interface CategoryProps {
  query: {
    PBLANC_BEGIN_DE: string;
    PBLANC_END_DE: string;
    SIGUN_NM: string;
    SPECIES_NM: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}
const regions = ["전체", "가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "기흥구", "의왕시", "의정부시", "이천시", "파주시", "포천시", "하남시", "화성시"];

export default function Category({ query, onChange }: CategoryProps) {
  const { PBLANC_BEGIN_DE, PBLANC_END_DE, SIGUN_NM, SPECIES_NM } = query;
  return (
    <Container className="category">
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        {/* 공고 시작, 마감일  */}
        <div className="box-form">
          <label className="label" htmlFor="bgnde">
            <FaCalendarAlt className="icon" />
            &nbsp;날짜
            <b>*</b>
          </label>
          <span className="calender">
            <input className="input" name="selectedBeginDate" id="PBLANC_BEGIN_DE" value={PBLANC_BEGIN_DE} onChange={onChange} type="date" />
            <input className="input" name="selectedEndDate" id="PBLANC_END_DE" value={PBLANC_END_DE} onChange={onChange} type="date" />
          </span>
        </div>
        {/* 경기도내 시군구 */}
        <div className="box-form">
          <label className="label" htmlFor="selectedLocation">
            <MdLocationOn className="icon" />
            &nbsp;시군구
            <b>*</b>
          </label>
          <select className="select" name="selectedLocation" id="selectedLocation" value={SIGUN_NM} onChange={onChange}>
            {regions?.map((region, idx) => (
              <option value={region !== "전체" ? region : ""} key={idx}>
                {region}
              </option>
            ))}
          </select>
        </div>
        {/* 품종 */}
        <div className="box-form">
          <label className="label" htmlFor="selectedBreed">
            <MdCategory className="icon" />
            &nbsp;품종
            <b>*</b>
          </label>
          <select className="select" name="selectedBreed" id="selectedBreed" value={SPECIES_NM} onChange={onChange}>
            <option value="">모두</option>
            <option value="[개]">강아지</option>
            <option value="[고양이]">고양이</option>
            <option value="[기타축종]">다른친구들</option>
          </select>
        </div>
      </form>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  background-color: white;
  padding: 30px 30px 30px 30px;

  .form {
    margin-left: 200px;
    display: flex;
    flex-wrap: wrap; /* 나열되는 항목을 여러 줄로 강제로 내려가게 설정 */
    gap: 1rem; /* 각 항목 사이의 간격 조절 */
  }

  .box-form {
    flex: 1; /* 각 항목의 가로 공간을 동일하게 나눠줌 */
  }

  .input {
    margin-left: 10px;
    padding: 5px 5px 5px 5px;
    border-radius: 5px;
    border: 2px solid gray;
  }

  .select {
    margin-left: 10px;
    padding: 5px 5px 5px 5px;
    border-radius: 5px;
    border: 2px solid gray;
  }
`;
