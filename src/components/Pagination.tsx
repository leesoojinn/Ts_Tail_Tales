import React, { useEffect } from "react";
import * as S from "../styles/components/style.pagination";

// Pagination 컴포넌트의 props로 currentPage, totalPages, setCurrentPage를 받습니다.
interface PaginationProps {
  currentPage: number; // 현재 페이지 번호
  totalPages: number; // 전체 페이지 수
  setCurrentPage: (page: number) => void; // 페이지 변경을 처리하는 함수
}

function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) {
  // 이전 페이지 번호와 다음 페이지 번호를 계산합니다.
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  // 페이지 번호를 클릭했을 때 처리하는 함수
  const handlePageClick = (page: number) => {
    // 먼저 스크롤을 현재 위치로 유지
    window.scrollTo({});

    // 선택한 페이지로 변경합니다.
    setCurrentPage(page);
  };

  // 페이지 번호를 렌더링하는 함수
  const renderPageNumbers = () => {
    const pageNumbers = [];

    // 페이지 번호를 생성하여 배열에 추가합니다.
    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === currentPage; // 현재 페이지 여부를 확인합니다.

      pageNumbers.push(
        <S.PageNumber
          key={i}
          isActive={isActive}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </S.PageNumber>
      );
    }

    return pageNumbers;
  };

  return (
    <div>
      {/* 이전 페이지 버튼을 렌더링합니다. */}
      {prevPage && (
        <S.PageNumber
          isActive={false}
          onClick={() => handlePageClick(prevPage)}
        >
          이전
        </S.PageNumber>
      )}
      {/* 페이지 번호를 렌더링합니다. */}
      {renderPageNumbers()}
      {/* 다음 페이지 버튼을 렌더링합니다. */}
      {nextPage && (
        <S.PageNumber
          isActive={false}
          onClick={() => handlePageClick(nextPage)}
        >
          다음
        </S.PageNumber>
      )}
    </div>
  );
}
export default Pagination;
