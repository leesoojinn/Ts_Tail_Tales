import React, { useState, useEffect } from "react"; // 상태 관리와 라이프사이클 관리를 위해 사용
import { supabase } from "../supabase"; // 데이터베이스에서 데이터를 조회하거나 업데이트하는 작업을 위해 사용
import Pagination from "../components/Pagination"; // 페이지별로 아이템을 나누어 표시하고 페이지를 전환할 수 있는 UI를 생성하는 데 사용
import usePageHook from "../hooks/pageHook"; // 페이지네이션 코를 재사용 하기 위해 커스텀 훅을 가져옴
import { useNavigate } from "react-router-dom"; // 버튼 클릭 시 특정 페이지로 이동하기 위해 사용
import Swal from "sweetalert2"; // SweetAlert2를 사용하여 알림창 표시
import * as S from "../styles/pages/style.community"; // 스타일 컴포넌트 관련 모듈

// 인터페이스 정의(Comment 객체의 구조를 정의하는데 사용)
interface Comment {
  id: number;
  content: string;
  userNickname: string;
}
// 인터페이스 정의(Post 객체의 구조를 정의하는데 사용)
interface Post {
  id: number;
  userNickname: string;
  title: string;
  content: string;
  comments: Comment[];
  date: string;
}

const ITEMS_PER_PAGE = 9; // 페이지당 표시할 아이템 수

function Community() {
  // 구조 분해 할당(destructuring assignment)을 사용하여 usePageHook 함수에서
  // 반환된 객체의 속성들을 개별적으로 추출하여 변수에 할당하는 코드

  // 페이지네이션을 위한 상태 및 커스텀 훅 사용
  const { currentPage, setCurrentPage, indexOfLastItem, indexOfFirstItem } =
    usePageHook(ITEMS_PER_PAGE);

  // 게시물 목록을 관리하는 상태
  const [posts, setPosts] = useState<Post[]>([]);

  // React Router를 사용하여 페이지 이동
  const navigate = useNavigate();

  // 현재 페이지에 표시할 게시물 목록
  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);

  // 게시물 클릭 시 상세 페이지로 이동
  const handleRowClick = (postId: number) => {
    navigate(`/post-detail/${postId}`);
  };

  // 날짜 형식 변환 함수
  const formattedDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  // 게시물 데이터를 가져오는 함수
  const fetchPosts = async () => {
    try {
      const { data: postsData, error } = await supabase
        .from("posts")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        // 데이터 가져오기 실패 시 SweetAlert2를 사용하여 오류 메시지 표시
        Swal.fire({
          position: "center",
          icon: "error",
          title: "게시물 가져오는 중 오류",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1200,
        });
      } else {
        setPosts(postsData); // 게시물 데이터 설정
      }
    } catch (error) {
      // 예외 발생 시 SweetAlert2를 사용하여 오류 메시지 표시
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

  // 컴포넌트가 마운트될 때 게시물 데이터 가져오기
  useEffect(() => {
    fetchPosts();
  }, []);

  // 세션 스토리지에서 사용자 정보 가져오기
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
                <S.StyledRow
                  key={post.id}
                  onClick={() => handleRowClick(post.id)}
                >
                  <td>{posts.length - (index + indexOfFirstItem)} </td>
                  <td>{post.title}</td>
                  <td>{post.userNickname}</td>
                  <td>{formattedDate(post.date)}</td>
                </S.StyledRow>
              ))}
            </tbody>
          </S.Table>
          <S.PaginationContainer>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(posts.length / ITEMS_PER_PAGE)}
              setCurrentPage={setCurrentPage}
            />
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
