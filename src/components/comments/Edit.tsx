import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { supabase } from "../../supabase";
import styled from "styled-components";
// .
interface Comment {
  id: string;
  postId?: string;
  content: string;
  userNickname: string;
  date: string;
  email: string;
  avatar_url: string;
}

export default function Edit({
  id,
  onUpdateComplete,
}: {
  id: string;
  onUpdateComplete: () => void;
}) {
  const queryClient = useQueryClient();

  const {
    data: initialData,
    isLoading,
    isError,
    error,
  } = useQuery<Comment>(["comments", id], async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  });

  const updateComment = useMutation<Comment, Error, Comment>(
    async (updatedComment) => {
      try {
        // 기존 댓글 삭제
        const { error: deleteError } = await supabase
          .from("comments")
          .delete()
          .eq("id", updatedComment.id);

        if (deleteError) {
          console.error("댓글 삭제 중 오류 발생:", deleteError);
          throw deleteError;
        }

        // 댓글 업데이트
        const { data, error } = await supabase
          .from("comments")
          .upsert([updatedComment]);

        if (error) {
          console.error("댓글 수정 중 오류 발생:", error);
          throw error;
        }

        return updatedComment;
      } catch (error) {
        console.error("댓글 수정 중 오류 발생:", error);
        throw error;
      }
    },
    {
      onSuccess: (updatedComment) => {
        queryClient.setQueryData(["comments", id], updatedComment);
        queryClient.invalidateQueries(["comments", id]);
        window.alert("댓글 수정이 완료되었습니다.");
        onUpdateComplete();
      },
    }
  );

  const [content, setContent] = useState("");
  const [userNickname, setUserNickname] = useState("");

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content);
      setUserNickname(initialData.userNickname);
    }
  }, [initialData]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content) {
      window.alert("내용을 입력해주세요.");
      return;
    }

    const updatedComment: Comment = {
      id,
      postId: initialData?.postId,
      content,
      userNickname,
      date: new Date().toISOString(),
      email: initialData!.email,
      avatar_url: initialData!.avatar_url,
    };

    try {
      await updateComment.mutateAsync(updatedComment);
    } catch (error) {
      console.error("댓글 수정 오류:", error);
      return;
    }

    queryClient.invalidateQueries(["comments", id]);
    onUpdateComplete();
    // window.location.reload();
  };

  if (isLoading) {
    return <LoadingText>로딩 중 ...</LoadingText>;
  }

  if (isError) {
    return <ErrorText>{(error as Error).message}</ErrorText>;
  }

  if (!initialData) {
    return <ErrorText>댓글을 찾을 수 없습니다.</ErrorText>;
  }

  return (
    <Container>
      <Form onSubmit={handleUpdate}>
        <FormItem>
          <Textarea value={content} onChange={handleContentChange} />
        </FormItem>
        <SubmitButton type="submit">수정</SubmitButton>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Textarea = styled.textarea`
  width: 950px;
  height: 50px;
  font-size: 15px;
  padding: 10px;
  margin-bottom: 10px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #f8b3b3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #dd3a3a;
    transform: scale(1.05);
  }
`;

const LoadingText = styled.div`
  font-size: 1.2rem;
  color: gray;
`;

const ErrorText = styled.div`
  font-size: 1.2rem;
  color: red;
`;
