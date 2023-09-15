import { useState } from "react";

function usePageHook(itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    itemsPerPage,
  };
}

export default usePageHook;
