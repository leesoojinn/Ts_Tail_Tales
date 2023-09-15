import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { supabase } from "../../supabase";
import Swal from "sweetalert2";
import * as S from "../../styles/components/comments/style.commentedit";

interface Comment {
  id: string;
  postId?: string;
  content: string;
  userNickname: string;
  date: string;
  email: string;
  avatarUrl: string;
}
function Edit({ id, onUpdateComplete }: { id: string; onUpdateComplete: () => void }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: initialData,
    isLoading,
    isError,
    error,
  } = useQuery<Comment>(["comments", id], async () => {
    const { data, error } = await supabase.from("comments").select("*").eq("id", id).single();
    if (error) {
      throw error;
    }
    return data;
  });
  const updateComment = useMutation<Comment, Error, Comment>(
    async (updatedComment) => {
      try {
        const { data, error } = await supabase.from("comments").update(updatedComment).eq("id", updatedComment.id);
        if (error) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "댓글 수정 중 오류 발생",
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
          });
          throw error;
        }
        return updatedComment;
      } catch (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "댓글 수정 중 오류 발생",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1200,
        });
        throw error;
      }
    },
    {
      onSuccess: (updatedComment) => {
        queryClient.setQueryData(["comments", id], updatedComment);
        queryClient.invalidateQueries(["comments", id]);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "댓글 수정이 완료되었습니다.",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1000,
        });
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
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "내용을 입력해주세요.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1000,
      });
      return;
    }
    const updatedComment: Comment = {
      id,
      postId: initialData?.postId,
      content,
      userNickname,
      date: initialData?.date || new Date().toISOString(),
      email: initialData!.email,
      avatarUrl: initialData!.avatarUrl,
    };
    try {
      await updateComment.mutateAsync(updatedComment);
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "댓글 수정 오류",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1000,
      });
      return;
    }
    queryClient.invalidateQueries(["comments", id]);
    onUpdateComplete();
  };
  if (isLoading) {
    return <S.LoadingText>로딩 중 ...</S.LoadingText>;
  }
  if (isError) {
    return <S.ErrorText>{(error as Error).message}</S.ErrorText>;
  }
  if (!initialData) {
    return <S.ErrorText>댓글을 찾을 수 없습니다.</S.ErrorText>;
  }
  return (
    <S.Container>
      <S.Form onSubmit={handleUpdate}>
        <S.FormItem>
          <S.Textarea value={content} onChange={handleContentChange} />
        </S.FormItem>
        <S.SubmitButton type="submit">수정</S.SubmitButton>
      </S.Form>
    </S.Container>
  );
}

export default Edit;
