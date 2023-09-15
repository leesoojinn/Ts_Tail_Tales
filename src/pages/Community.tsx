import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import Pagination from "../components/Pagination";
import usePageHook from "../hooks/pageHook";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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

export default function Community() {
  const { currentPage, setCurrentPage, indexOfLastItem, indexOfFirstItem } = usePageHook(9);
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
      const { data: posts, error } = await supabase.from("posts").select("*").order("date", { ascending: false });

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
        setPosts(posts);
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
    <StDetailDivContainer>
      <Container>
        <ContentContainer>
          <TitleContainer>
            <LogoImage src="/image/logo/logo.png" alt="Logo" />
          </TitleContainer>
          <br />

          <Table>
            <thead>
              <tr>
                <th className="no-border">No</th>
                <th className="no-border">제목</th>
                <th className="no-border">자</th>
                <th className="no-border">작성날짜</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post, index) => (
                <StyledRow key={post.id} onClick={() => handleRowClick(post.id)}>
                  <td>{posts.length - (index + indexOfFirstItem)} </td>
                  <td>{post.title}</td>
                  <td>{post.userNickname}</td>
                  <td>{formattedDate(post.date)}</td>
                </StyledRow>
              ))}
            </tbody>
          </Table>
          <PaginationContainer>
            <Pagination currentPage={currentPage} totalPages={Math.ceil(posts.length / ITEMS_PER_PAGE)} setCurrentPage={setCurrentPage} />
          </PaginationContainer>
          {user?.email && (
            <CreateButton to="/create">
              <CreateBtn className="fas fa-plus">작성하기</CreateBtn>
            </CreateButton>
          )}
        </ContentContainer>
      </Container>
    </StDetailDivContainer>
  );
}

const StDetailDivContainer = styled.div`
  position: relative;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fdfaf6;
`;
const Container = styled.div`
  // min-height: 100vh;
  padding: 20px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const LogoImage = styled.img`
  width: 130px;
  height: 80px;
  margin-right: 20px;
`;

const ContentContainer = styled.div`
  padding-top: 70px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fdfaf6;

  thead th {
    background-color: #9f9292;
    color: white;
    text-align: left;
    padding: 12px;
    font-weight: bold;
    border: 2px solid #2c2626;
  }

  th.no-border {
    border: none;
  }

  td {
    padding: 12px;
    text-align: left;
    border-top: 1px solid #ddd;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 10%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 50%;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 10%;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 15%;
  }

  th:nth-child(5),
  td:nth-child(5) {
    width: 0%;
  }
`;

const StyledRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.3s ease;

  td {
    padding: 12px;
    text-align: left;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  &:hover {
    background-color: #cfc3b5;
    animation: flash 0.5s;
  }

  @keyframes flash {
    0% {
      background-color: transparent;
    }
    50% {
      background-color: #cfc6bc;
    }
    100% {
      background-color: transparent;
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

const CreateButton = styled(Link)`
  position: fixed;
  /* top: 120px; */
  bottom: 20px;
  right: 60px;
  width: 100px;
  height: 40px;
  background-color: #746464;
  color: white;
  border-radius: 40px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #dd3a3a;
    transform: scale(1.05);
  }
`;

const CreateBtn = styled.h2`
  font-size: 15px;
`;
