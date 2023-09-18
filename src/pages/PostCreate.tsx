import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router의 네비게이션 기능을 사용
import { v4 as uuid } from "uuid"; // UUID 생성 라이브러리
import { supabase } from "../supabase"; // Supabase 관련 모듈 가져오기
import PostImg from "../components/postsimg/PostImg"; // 게시글 이미지 업로드 컴포넌트 가져오기
import Swal from "sweetalert2"; // Swal 팝업 메시지를 표시하기 위한 모듈
import * as S from "../styles/pages/style.postcreate"; // 스타일 관련 컴포넌트 가져오기

function PostCreate() {
  const [title, setTitle] = useState(""); // 게시글 제목 상태 관리
  const [content, setContent] = useState(""); // 게시글 내용 상태 관리
  const navigate = useNavigate(); // React Router의 네비게이션 기능을 사용

  // 세션 스토리지에서 사용자 정보를 가져오는 부분
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userNickname = user
    ? user.user_metadata.user_name || user.user_metadata.full_name
    : null;

  // 제목 입력값 변경 핸들러
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // 내용 입력값 변경 핸들러
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  // 게시글 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !content.trim()) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "제목과 내용을 입력해주세요.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }
    if (!title) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "제목을 입력해주세요.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }
    if (!content.trim() || content === "<p><br></p>") {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "내용을 입력해주세요.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }
    try {
      // Supabase를 사용하여 게시글 데이터를 삽입
      const { error } = await supabase.from("posts").insert([
        {
          id: uuid(),
          title,
          content,
          date: new Date().toISOString(),
          userNickname: userNickname,
          email: user?.email,
        },
      ]);

      if (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "게시글 작성 오류",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1200,
        });
        return;
      }
      Swal.fire({
        position: "center",
        icon: "success",
        title: "작성이 완료되었습니다.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      navigate("/community"); // 작성이 완료되면 커뮤니티 페이지로 이동
      setTitle(""); // 입력 필드 초기화
      setContent(""); // 입력 필드 초기화
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "게시글 작성 오류",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
    }
  };

  // 뒤로 가기 버튼 핸들러
  const handleGoBack = async () => {
    const result = await Swal.fire({
      title: "이전으로 가면 작성 내용이 사라집니다.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "이전",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      navigate("/community"); // 이전 버튼 클릭 시 커뮤니티 페이지로 이동
    }
  };

  return (
    <S.OuterContainer>
      <S.Container>
        <h2 className="detailtext">게시글 작성</h2>
        <S.Form onSubmit={handleSubmit}>
          <S.FormItem>
            <S.Input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="제목을 입력해주세요"
            />
          </S.FormItem>
          <S.FormItem>
            <PostImg
              onContentChange={handleContentChange}
              initialContent={content}
            />
          </S.FormItem>
          <S.FormButtons>
            <S.SubmitButton
              type="button"
              className="backbtn"
              onClick={handleGoBack}
            >
              이전
            </S.SubmitButton>
            <S.SubmitButton type="submit" className="submitbtn">
              등록
            </S.SubmitButton>
          </S.FormButtons>
        </S.Form>
      </S.Container>
    </S.OuterContainer>
  );
}

export default PostCreate;
