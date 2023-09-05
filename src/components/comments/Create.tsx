import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
import { v4 as uuid } from "uuid"; // uuid 패키지에서 v4 함수 임포트
import { User } from "@supabase/supabase-js";
import { supabase } from "../../supabase";

interface CreateProps {
  onCommentAdded: () => void;
  postId: string;
}

export default function Create({ onCommentAdded, postId }: CreateProps) {
  const [content, setContent] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const authSubscription = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);
          sessionStorage.setItem("user", JSON.stringify(session.user));
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setUserNickname(null);
          sessionStorage.removeItem("user");
        }
      }
    );

    return () => {
      authSubscription.data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      setUserNickname(
        user.user_metadata.user_name || user.user_metadata.full_name
      );
      sessionStorage.setItem(
        "userNickname",
        user.user_metadata.user_name || user.user_metadata.full_name
      );
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
  >(
    async (newComment) => {
      try {
        const { data, error } = await supabase
          .from("comments")
          .upsert([newComment]);

        if (error) {
          console.error("댓글 작성 중 오류 발생:", error);
          throw new Error("댓글 작성 오류");
        }

        // 반환값으로 Promise<void> 사용
        return;
      } catch (error) {
        console.error("댓글 작성 중 오류 발생:", error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("comments");
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!content) {
      window.alert("내용을 입력해주세요.");
      return;
    }

    const newComment = {
      id: uuid(),
      postId,
      content,
      userNickname: userNickname || user?.user_metadata.full_name,
      date: new Date().toISOString().slice(0, 19).replace("T", " "), // 현재 시간을 문자열로 변환
      email: user!.email,
      avatar_url: user?.user_metadata.avatar_url || "",
    };

    try {
      await createCommentMutation.mutateAsync(newComment);
      alert("댓글이 작성되었습니다.");
      setContent("");
      onCommentAdded();
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };

  return (
    <CreateContainer>
      <CreateForm onSubmit={handleSubmit}>
        <InputContainer>
          <CreateTextarea
            placeholder="댓글을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
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
  padding: 10px;
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
  &:hover {
    background-color: #606060;
  }
`;

const CreateStyle = styled(CreateContainer)`
  ${CreateForm} {
    ${InputContainer} {
      ${CreateTextarea}, ${CreateButton} {
        width: 100%;
      }
    }
  }
`;
