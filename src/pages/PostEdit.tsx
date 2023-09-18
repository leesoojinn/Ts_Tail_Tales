import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // React Router의 파라미터와 네비게이션 기능을 사용
import { useMutation, useQuery, useQueryClient } from "react-query"; // React Query를 사용하여 데이터를 가져옴
import PostImg from "../components/postsimg/PostImg"; // 게시글 이미지 업로드 컴포넌트 가져오기
import { supabase } from "../supabase"; // Supabase 모듈 가져오기
import Swal from "sweetalert2"; // Swal 팝업 메시지를 표시하기 위한 모듈
import * as S from "../styles/pages/style.postedit"; // 스타일 관련 컴포넌트 가져오기

interface UpdatedData {
  id: string;
}

function PostEdit() {
  const queryClient = useQueryClient(); // React Query 클라이언트 사용
  const navigate = useNavigate(); // React Router의 네비게이션 기능을 사용
  const { id } = useParams<{ id: string }>(); // URL 파라미터에서 게시글 ID 가져오기

  // React Query를 사용하여 게시글 데이터 가져오기
  const { data } = useQuery(["posts", id], async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();
    return data;
  });

  // 게시글 업데이트(mutate)를 처리하는 React Query 훅
  const handleUpdatePost = useMutation(
    async (updatedData: UpdatedData) => {
      await supabase.from("posts").update(updatedData).eq("id", updatedData.id);
    },
    {
      // 업데이트 성공 시 실행할 콜백 함수
      onSuccess: () => {
        queryClient.invalidateQueries(["posts", id]); // 해당 게시글 데이터 캐시 무효화
        navigate(`/post-detail/${id}`); // 게시글 상세 페이지로 이동
      },
    }
  );

  const [title, setTitle] = useState(""); // 게시글 제목 상태
  const [content, setContent] = useState(""); // 게시글 내용 상태

  useEffect(() => {
    if (data) {
      setTitle(data.title); // 게시글 데이터에서 제목 초기화
      setContent(data?.content); // 게시글 데이터에서 내용 초기화
    }
  }, [data]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value); // 제목 변경 핸들러
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent); // 내용 변경 핸들러
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !content) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "제목을 입력해주세요, 내용을 입력해주세요.",
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
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "사용자 정보가 없습니다.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }

    const user = JSON.parse(storedUser);
    const userEmail = user?.email;

    if (!userEmail) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "사용자 이메일이 없습니다.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }
    const userNickname = sessionStorage.getItem("userNickname");
    if (data.email !== userEmail) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "자신의 게시물만 수정할 수 있습니다.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }

    const result = await Swal.fire({
      title: "정말로 수정하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "수정",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      const updatedPost: any = {
        id: data.id,
        title,
        content,
        date: data.date || new Date().toISOString(),
        userNickname,
        email: userEmail,
      };
      handleUpdatePost.mutate(updatedPost); // 게시글 업데이트(mutate) 실행
    }
  };

  const handleGoBack = async () => {
    const result = await Swal.fire({
      title: "이전으로 가면 수정 내용이 사라집니다.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "이전",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      navigate(`/post-detail/${id}`); // 게시글 상세 페이지로 이동
    }
  };

  return (
    <S.OuterContainer>
      <S.Container>
        <h2 className="detailtext">게시글 수정</h2>
        <S.Form onSubmit={handleUpdate}>
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
              initialContent={data.content}
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
              수정
            </S.SubmitButton>
          </S.FormButtons>
        </S.Form>
      </S.Container>
    </S.OuterContainer>
  );
}

export default PostEdit;
