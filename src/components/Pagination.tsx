import React, { useEffect } from "react";
import * as S from "../styles/components/style.pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

function Pagination({ currentPage, totalPages, setCurrentPage }: PaginationProps) {
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const handlePageClick = (page: number) => {
    // 먼저 스크롤을 현재 위치로 유지
    window.scrollTo({});

    // 그 다음 페이지를 설정
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === currentPage;

      pageNumbers.push(
        <S.PageNumber key={i} isActive={isActive} onClick={() => handlePageClick(i)}>
          {i}
        </S.PageNumber>
      );
    }

    return pageNumbers;
  };

  return (
    <div>
      {prevPage && (
        <S.PageNumber isActive={false} onClick={() => handlePageClick(prevPage)}>
          이전
        </S.PageNumber>
      )}
      {renderPageNumbers()}
      {nextPage && (
        <S.PageNumber isActive={false} onClick={() => handlePageClick(nextPage)}>
          다음
        </S.PageNumber>
      )}
    </div>
  );
}
export default Pagination;
