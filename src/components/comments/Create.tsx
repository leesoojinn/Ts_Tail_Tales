import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
import { v4 as uuid } from "uuid"; // uuid 패키지에서 v4 함수 임포트
import { User } from "@supabase/supabase-js";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface CreateProps {
  // onCommentAdded: () => void;
  postId: string;
}
export default function Create({ postId }: CreateProps) {
  const [content, setContent] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      setUserNickname(user.user_metadata.user_name || user.user_metadata.full_name);
      sessionStorage.setItem("userNickname", user.user_metadata.user_name || user.user_metadata.full_name);
    }
  }, [user]);

  const createCommentMutation = useMutation<
    void,
    Error,
    {
      id: string;
      content: string;
      userNickname: string;
      date: string;
      postId: string;
      avatar_url: string;
    }
  >(async (newComment) => {
    try {
      const { data, error } = await supabase.from("comments").insert([newComment]);
      if (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "댓글 작성 중 오류 발생",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 3000,
        });
        throw new Error("댓글 작성 오류");
      }
      // 반환값으로 Promise<void> 사용
      return;
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "댓글 작성 중 오류 발생",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 3000,
      });
      throw error;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "로그인이 필요합니다.",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    if (!content) {
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
    const newComment = {
      id: uuid(),
      postId,
      content,
      userNickname: userNickname || user?.user_metadata.full_name,
      date: new Date().toISOString().slice(0, 19).replace("T", " "), // 현재 시간을 문자열로 변환
      email: user!.email,
      avatar_url: user?.user_metadata.user_profile || user?.user_metadata.avatar_url,
    };
    createCommentMutation.mutate(newComment, {
      onSuccess: () => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "댓글이 작성되었습니다.",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1000,
        });
        setContent("");
        queryClient.invalidateQueries(["comments"]);
      },
      onError: () => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "댓글 작성 중 오류 발생",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 3000,
        });
      },
    });
  };
  return (
    <CreateContainer>
      <CreateForm onSubmit={handleSubmit}>
        <InputContainer>
          <CreateTextarea placeholder="댓글을 입력하세요" value={content} onChange={(e) => setContent(e.target.value)} />
          <CreateButton type="submit">작성</CreateButton>
        </InputContainer>
      </CreateForm>
    </CreateContainer>
  );
}
const CreateContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #fdfaf6;
  border-radius: 8px;
  background-color: white;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
`;
const CreateForm = styled.form`
  display: flex;
  flex-direction: column;
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
`;
const CreateTextarea = styled.textarea`
  padding: 8px;
  border: 1px solid white;
  border-radius: 8px;
  resize: none;
`;
const CreateButton = styled.button`
  background-color: #746464;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  text-decoration: none;
  font-size: 13px;
  align-self: flex-end;
  width: fit-content;
  font-family: "BMJUA-Regular";

  &:hover {
    background-color: #606060;
  }
`;
