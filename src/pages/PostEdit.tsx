import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import PostImg from "../components/postsimg/PostImg";
import { supabase } from "../supabase";
import Swal from "sweetalert2";
import * as S from "../styles/pages/style.postedit";

interface UpdatedData {
  id: string;
}

function PostEdit() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data } = useQuery(["posts", id], async () => {
    const { data } = await supabase.from("posts").select("*").eq("id", id).single();
    return data;
  });

  const handleUpdatePost = useMutation(
    async (updatedData: UpdatedData) => {
      await supabase.from("posts").update(updatedData).eq("id", updatedData.id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts", id]);
        navigate(`/post-detail/${id}`);
      },
    }
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setContent(data?.content);
    }
  }, [data]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
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
      handleUpdatePost.mutate(updatedPost);
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
      navigate(`/post-detail/${id}`);
    }
  };

  return (
    <S.OuterContainer>
      <S.Container>
        <h2 className="detailtext">게시글 수정</h2>
        <S.Form onSubmit={handleUpdate}>
          <S.FormItem>
            <S.Input type="text" value={title} onChange={handleTitleChange} placeholder="제목을 입력해주세요" />
          </S.FormItem>
          <S.FormItem>
            <PostImg onContentChange={handleContentChange} initialContent={data.content} />
          </S.FormItem>
          <S.FormButtons>
            <S.SubmitButton type="button" className="backbtn" onClick={handleGoBack}>
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
