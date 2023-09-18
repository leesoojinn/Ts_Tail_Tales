import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Edit from "./Edit";
import { supabase } from "../../supabase";
import Pagination from "../Pagination";
import usePageHook from "../../hooks/pageHook";
import Swal from "sweetalert2";
import * as S from "../../styles/components/comments/style.postcomment";

interface CommentProps {
  comments?: string[];
  postId?: string;
}

function Comment({ comments: commentsProp }: CommentProps) {
  const { id } = useParams<{ id: string }>(); // URL에서 게시물 ID를 가져옵니다.
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [deleted] = useState(false);

  const queryClient = useQueryClient(); // React Query의 쿼리 클라이언트를 사용하여 쿼리를 관리합니다.

  // 페이지네이션에 필요한 상태와 함수를 가져옵니다.
  const {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    itemsPerPage,
  } = usePageHook(5);

  // 댓글 데이터를 가져오는 React Query 훅을 사용합니다
  const {
    data: commentData,
    isLoading,
    isError,
    error,
  } = useQuery(
    ["comments", id], // 쿼리 식별자를 지정하여 캐싱 및 재사용을 관리합니다.
    async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("postId", id) // 해당 게시물의 댓글만 가져옵니다.
        .order("date", { ascending: true }); // 날짜 순으로 정렬합니다.

      if (error) {
        throw error;
      }

      return data;
    },
    {
      enabled: !!id, // 게시물 ID가 있을 때만 쿼리를 실행합니다.
    }
  );

  // 댓글 삭제 핸들러를 정의
  const handleDelete = async (commentId: string) => {
    const result = await Swal.fire({
      title: "정말 삭제하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      try {
        await supabase.from("comments").delete().eq("id", commentId); // 댓글 삭제 요청을 수행합니다.
        queryClient.invalidateQueries(["comments", id]); // 쿼리를 다시 실행하여 데이터를 업데이트합니다.
      } catch (error) {
        // 댓글 삭제 중 오류가 발생한 경우 오류 메시지를 표시합니다.
        Swal.fire({
          position: "center",
          icon: "error",
          title: "댓글 삭제 오류",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 3000,
        });
      }
    }
  };

  // 페이지 변경 핸들러를 정의
  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  // 현재 페이지에 표시할 댓글을 가져옵니다.
  const currentComments = commentData?.slice(indexOfFirstItem, indexOfLastItem);

  if (isLoading) {
    return <div>로딩 중 ...</div>; // 댓글 데이터를 가져오는 중일 때 로딩 화면을 표시합니다.
  }

  if (isError) {
    return <div>{(error as Error).message}</div>;
  }

  if (!commentData) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

  // 현재 로그인한 사용자의 이메일을 가져옵니다.
  const email = sessionStorage.getItem("userEmail")?.toLowerCase();

  return (
    <div>
      {/* 총 댓글 개수를 표시합니다. */}
      <p>{commentData.length}개의 댓글</p>
      <br />
      {/* 삭제된 댓글인 경우 로딩 메시지를 표시합니다. */}
      {deleted ? (
        <div>로딩 중 ...</div>
      ) : (
        <>
          {/* 현재 페이지의 댓글을 매핑하여 표시합니다. */}
          {currentComments?.map((comment) => (
            <S.CommentContainer key={comment.id}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    marginRight: "10px",
                  }}
                >
                  {/* 댓글 작성자의 프로필 이미지를 표시합니다. */}
                  <img
                    src={comment.avatar_url || comment.user_profile}
                    alt="User Avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  {/* 댓글 작성자의 닉네임을 표시합니다. */}
                  {email === comment.email ? (
                    <strong style={{ color: "#96908a" }}>
                      {comment.userNickname || "익명"}
                    </strong>
                  ) : (
                    <strong>{comment.userNickname || "익명"}</strong>
                  )}

                  <br />
                  <span style={{ color: "gray" }}>
                    {/* 댓글 작성 일시를 표시합니다. */}
                    {new Date(comment.date).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {/* 현재 사용자가 댓글 작성자인 경우 수정 및 삭제 버튼을 표시합니다. */}
                {email === comment.email && (
                  <div style={{ marginLeft: "auto" }}>
                    <S.EditButton
                      onClick={() => setEditingCommentId(comment.id)}
                    >
                      수정
                    </S.EditButton>
                    <S.DeleteButton onClick={() => handleDelete(comment.id)}>
                      삭제
                    </S.DeleteButton>
                  </div>
                )}
              </div>
              <br />
              {editingCommentId === comment.id ? (
                <Edit
                  id={comment.id}
                  onUpdateComplete={() => {
                    queryClient?.invalidateQueries(["comments", id]);
                    setEditingCommentId(null);
                  }}
                />
              ) : (
                <>
                  <div style={{ fontSize: "18px" }}>{comment.content}</div>
                  <br />
                  <br />
                </>
              )}
            </S.CommentContainer>
          ))}
          {/* 페이지네이션 컴포넌트를 표시하여 페이지를 변경할 수 있도록 합니다. */}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(commentData.length / itemsPerPage)}
            setCurrentPage={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default Comment;
