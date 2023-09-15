import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { supabase } from "../supabase";
import PostImg from "../components/postsimg/PostImg";
import Swal from "sweetalert2";
import * as S from "../styles/pages/style.postcreate";

function PostCreate() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userNickname = user ? user.user_metadata.user_name || user.user_metadata.full_name : null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

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
      navigate("/community");
      setTitle("");
      setContent("");
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
      navigate("/community");
    }
  };

  return (
    <S.OuterContainer>
      <S.Container>
        <h2 className="detailtext">게시글 작성</h2>
        <S.Form onSubmit={handleSubmit}>
          <S.FormItem>
            <S.Input type="text" value={title} onChange={handleTitleChange} placeholder="제목을 입력해주세요" />
          </S.FormItem>
          <S.FormItem>
            <PostImg onContentChange={handleContentChange} initialContent={content} />
          </S.FormItem>
          <S.FormButtons>
            <S.SubmitButton type="button" className="backbtn" onClick={handleGoBack}>
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
