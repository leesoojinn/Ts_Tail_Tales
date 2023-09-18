import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import { User } from "@supabase/supabase-js";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as S from "../../styles/components/comments/style.commentcreate";

interface CreateProps {
  postId: string;
}
export default function Create({ postId }: CreateProps) {
  const [content, setContent] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);

  const queryClient = useQueryClient(); // react-query의 queryClient
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // 저장된 사용자 정보를 가져와 state에 설정
    }
  }, []);

  //컴포넌트가 마운트될 때 사용자 정보를 세션 스토리지에서 가져와 설정합니다.
  useEffect(() => {
    if (user) {
      // 사용자 정보가 존재하면 사용자의 닉네임을 설정하고 세션 스토리지에 저장합니다.
      setUserNickname(
        user.user_metadata.user_name || user.user_metadata.full_name
      );
      sessionStorage.setItem(
        "userNickname",
        user.user_metadata.user_name || user.user_metadata.full_name
      );
    }
  }, [user]);

  // useMutation을 사용하여 댓글 작성 뮤테이션을 생성합니다.
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
      // Supabase를 통해 댓글을 데이터베이스에 삽입합니다.
      const { data, error } = await supabase
        .from("comments")
        .insert([newComment]);
      if (error) {
        // 오류가 발생하면 오류 메시지를 표시하고 예외를 throw합니다.
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
      return;
    } catch (error) {
      // 댓글 작성 중 예외가 발생하면 오류 메시지를 표시하고 예외를 throw합니다.
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

  // handleSubmit 함수는 댓글 작성 폼 제출 시 호출됩니다.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인하지 않은 상태에서 댓글 작성을 시도한 경우 경고 메시지를 표시하고 로그인 페이지로 이동합니다.
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
    // 댓글 내용이 없는 경우 경고 메시지를 표시합니다.
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

    // 새 댓글 객체를 생성하고 뮤테이션을 호출하여 댓글을 데이터베이스에 추가합니다.
    const newComment = {
      id: uuid(),
      postId,
      content,
      userNickname: userNickname || user?.user_metadata.full_name,
      date: new Date().toISOString().slice(0, 19).replace("T", " "),
      email: user!.email,
      avatar_url:
        user?.user_metadata.user_profile || user?.user_metadata.avatar_url,
    };
    createCommentMutation.mutate(newComment, {
      onSuccess: () => {
        // 댓글 작성이 성공하면 성공 메시지를 표시하고 입력 내용을 초기화하고 쿼리를 재로드합니다.
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
    <S.CreateContainer>
      <S.CreateForm onSubmit={handleSubmit}>
        <S.InputContainer>
          <S.CreateTextarea
            placeholder="댓글을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <S.CreateButton type="submit">작성</S.CreateButton>
        </S.InputContainer>
      </S.CreateForm>
    </S.CreateContainer>
  );
}
