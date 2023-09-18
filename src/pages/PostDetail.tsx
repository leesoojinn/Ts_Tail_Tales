import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // React Router의 파라미터와 네비게이션 기능을 사용
import { useQuery, useQueryClient } from "react-query"; // React Query를 사용하여 데이터를 가져옴
import Create from "../components/comments/Create"; // 댓글 작성 컴포넌트 가져오기
import Comment from "../components/comments/Comment"; // 댓글 컴포넌트 가져오기
import { supabase } from "../supabase"; // Supabase 모듈 가져오기
import ReactHtmlParser from "react-html-parser"; // HTML 문자열을 파싱하여 React 컴포넌트로 변환
import Swal from "sweetalert2"; // Swal 팝업 메시지를 표시하기 위한 모듈
import * as S from "../styles/pages/style.postdetail"; // 스타일 관련 컴포넌트 가져오기

function PostDetail() {
  const queryClient = useQueryClient(); // React Query 클라이언트 사용
  const { id } = useParams<{ id: string }>(); // URL 파라미터에서 게시글 ID 가져오기
  const navigate = useNavigate(); // React Router의 네비게이션 기능을 사용

  // React Query를 사용하여 게시글 데이터 가져오기
  const {
    data: post, // 게시글 데이터
    isLoading, // 로딩 중 여부
    isError, // 에러 발생 여부
    error, // 에러 메시지
  } = useQuery(["posts", id], async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      throw error;
    }

    return data;
  });

  // 게시글 데이터 로딩 중일 때 로딩 텍스트 반환
  if (isLoading) {
    return <S.LoadingText>로딩 중 ...</S.LoadingText>;
  }

  // 게시글 데이터 불러오기에 실패한 경우 에러 메시지 반환
  if (isError) {
    return <S.ErrorText>{(error as Error).message}</S.ErrorText>;
  }

  // 게시글 데이터가 없는 경우 커뮤니티 페이지로 이동
  if (!post) {
    navigate("/community");
    return null;
  }

  // 현재 사용자가 게시글 작성자인지 확인
  const isUserAuthorized = post.email === sessionStorage.getItem("userEmail");

  // 게시글 삭제 함수
  const deletePost = async (postId: number) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      throw error;
    }
  };

  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "정말로 이 게시물을 삭제하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      await deletePost(post.id);
      // 게시글 삭제 후 커뮤니티 페이지로 이동
      navigate("/community");
    }
  };

  return (
    <S.OuterContainer>
      <S.Container>
        <S.StDetailText style={{ display: "flex", alignItems: "center" }}>
          <S.BackIcon
            className="backBtn"
            onClick={() => {
              navigate("/community");
            }}
          >
            〈
          </S.BackIcon>
          <h2 className="detailtext">
            <strong>{post.userNickname}</strong>님의 글입니다.
          </h2>
        </S.StDetailText>
        <S.Title>{post.title}</S.Title>
        <S.Content>
          {ReactHtmlParser(post.content)}{" "}
          {/* HTML 문자열을 파싱하여 React 컴포넌트로 변환 */}
          <S.ButtonContainer>
            {isUserAuthorized && (
              <>
                <S.EditButton to={`/post-edit/${post.id}`}>수정</S.EditButton>
                <S.DeleteButton onClick={handleDelete}>삭제</S.DeleteButton>
              </>
            )}
          </S.ButtonContainer>
        </S.Content>
        <Create postId={post.id} /> {/* 댓글 작성 컴포넌트 */}
        <Comment postId={post.id} /> {/* 댓글 컴포넌트 */}
      </S.Container>
    </S.OuterContainer>
  );
}

export default PostDetail;
