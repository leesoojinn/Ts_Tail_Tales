import { useState } from "react";

// 커스텀 Hook: 페이지 관리에 사용됨
function usePageHook(itemsPerPage: number) {
  // 현재 페이지와 페이지 변경 함수를 상태로 관리
  const [currentPage, setCurrentPage] = useState(1);

  // 페이지별 마지막 항목과 첫 번째 항목의 인덱스 계산
  const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지의 마지막 항목 인덱스
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지의 첫 번째 항목 인덱스

  // 커스텀 Hook에서 반환하는 값들
  return {
    currentPage, // 현재 페이지
    setCurrentPage, // 페이지 변경 함수
    indexOfLastItem, // 현재 페이지의 마지막 항목 인덱스
    indexOfFirstItem, // 현재 페이지의 첫 번째 항목 인덱스
    itemsPerPage, // 페이지당 표시되는 항목 수
  };
}

export default usePageHook;
