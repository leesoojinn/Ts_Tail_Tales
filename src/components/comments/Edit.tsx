import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { supabase } from "../../supabase";
import Swal from "sweetalert2";
import * as S from "../../styles/components/comments/style.commentedit";

// 댓글 정보를 담는 Comment 인터페이스 정의
interface Comment {
  id: string;
  postId?: string;
  content: string;
  userNickname: string;
  date: string;
  email: string;
  avatarUrl: string;
}

function Edit({
  id,
  onUpdateComplete,
}: {
  id: string;
  onUpdateComplete: () => void;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 초기 데이터를 가져오는 useQuery 훅 사용
  const {
    data: initialData, // 초기 데이터
    isLoading, // 데이터 로딩 중인지 여부
    isError, // 데이터 로딩 중 오류가 발생했는지 여부
    error, // 오류 정보
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

  // useMutation을 사용하여 댓글 수정 뮤테이션을 생성합니다
  const updateComment = useMutation<Comment, Error, Comment>(
    async (updatedComment) => {
      try {
        const { data, error } = await supabase
          .from("comments")
          .update(updatedComment)
          .eq("id", updatedComment.id);
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
      // 댓글 수정이 성공할 경우 실행되는 onSuccess 콜백을 설정합니다.
      onSuccess: (updatedComment) => {
        // React Query를 통해 해당 댓글 데이터를 업데이트하고 쿼리를 재로드합니다.
        queryClient.setQueryData(["comments", id], updatedComment);
        queryClient.invalidateQueries(["comments", id]);
        // 성공 메시지를 표시하고 onUpdateComplete 함수를 호출합니다.
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

  // 댓글 내용과 사용자 닉네임을 상태로 관리합니다.
  const [content, setContent] = useState("");
  const [userNickname, setUserNickname] = useState("");

  // 초기 데이터가 로드되면 해당 데이터를 사용하여 상태를 초기화합니다.
  useEffect(() => {
    if (initialData) {
      setContent(initialData.content);
      setUserNickname(initialData.userNickname);
    }
  }, [initialData]);

  // 댓글 내용이 변경될 때 호출되는 함수입니다.
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 댓글 수정 폼을 제출할 때 호출되는 함수입니다.
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

    // 수정된 댓글 데이터를 생성합니다.
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
      // 댓글 수정 뮤테이션을 호출합니다.
      await updateComment.mutateAsync(updatedComment);
    } catch (error) {
      // 댓글 수정 중 오류가 발생한 경우 오류 메시지를 표시합니다.
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
    // 댓글 수정이 완료되면 쿼리를 재로드하고 onUpdateComplete 함수를 호출합니다.
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
