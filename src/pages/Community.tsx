import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Pagination from "../components/Pagination";
import usePageHook from "../hooks/pageHook";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as S from "../styles/pages/style.community";

interface Comment {
  id: number;
  content: string;
  userNickname: string;
}

interface Post {
  id: number;
  userNickname: string;
  title: string;
  content: string;
  comments: Comment[];
  date: string;
}

const ITEMS_PER_PAGE = 9;

function Community() {
  const { currentPage, setCurrentPage, indexOfLastItem, indexOfFirstItem } = usePageHook(ITEMS_PER_PAGE);
  const [posts, setPosts] = useState<Post[]>([]);

  const navigate = useNavigate();

  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);

  const handleRowClick = (postId: number) => {
    navigate(`/post-detail/${postId}`);
  };

  const formattedDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const fetchPosts = async () => {
    try {
      const { data: postsData, error } = await supabase.from("posts").select("*").order("date", { ascending: false });

      if (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "게시물 가져오는 중 오류",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1200,
        });
      } else {
        setPosts(postsData);
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "게시물 가져오는 중 오류",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const user = JSON.parse(sessionStorage.getItem("user") || "{}") as {
    email: string;
  } | null;

  return (
    <S.StDetailDivContainer>
      <S.Container>
        <S.ContentContainer>
          <S.TitleContainer>
            <S.LogoImage src="/image/logo/logo.png" alt="Logo" />
          </S.TitleContainer>
          <br />

          <S.Table>
            <thead>
              <tr>
                <th className="no-border">No</th>
                <th className="no-border">제목</th>
                <th className="no-border">작성자</th>
                <th className="no-border">작성날짜</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post, index) => (
                <S.StyledRow key={post.id} onClick={() => handleRowClick(post.id)}>
                  <td>{posts.length - (index + indexOfFirstItem)} </td>
                  <td>{post.title}</td>
                  <td>{post.userNickname}</td>
                  <td>{formattedDate(post.date)}</td>
                </S.StyledRow>
              ))}
            </tbody>
          </S.Table>
          <S.PaginationContainer>
            <Pagination currentPage={currentPage} totalPages={Math.ceil(posts.length / ITEMS_PER_PAGE)} setCurrentPage={setCurrentPage} />
          </S.PaginationContainer>
          {user?.email && (
            <S.CreateButton to="/create">
              <S.CreateBtn className="fas fa-plus">작성하기</S.CreateBtn>
            </S.CreateButton>
          )}
        </S.ContentContainer>
      </S.Container>
    </S.StDetailDivContainer>
  );
}

export default Community;
