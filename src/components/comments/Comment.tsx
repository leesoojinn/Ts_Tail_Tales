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
  const { id } = useParams<{ id: string }>();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [deleted] = useState(false);
  const queryClient = useQueryClient();

  const { currentPage, setCurrentPage, indexOfLastItem, indexOfFirstItem, itemsPerPage } = usePageHook(5);

  const {
    data: commentData,
    isLoading,
    isError,
    error,
  } = useQuery(
    ["comments", id],
    async () => {
      const { data, error } = await supabase.from("comments").select("*").eq("postId", id).order("date", { ascending: true });

      if (error) {
        throw error;
      }

      return data;
    },
    {
      enabled: !!id,
    }
  );

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
        await supabase.from("comments").delete().eq("id", commentId);
        queryClient.invalidateQueries(["comments", id]);
      } catch (error) {
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

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  const currentComments = commentData?.slice(indexOfFirstItem, indexOfLastItem);

  if (isLoading) {
    return <div>로딩 중 ...</div>;
  }

  if (isError) {
    return <div>{(error as Error).message}</div>;
  }

  if (!commentData) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

  const email = sessionStorage.getItem("userEmail")?.toLowerCase();

  return (
    <div>
      <p>{commentData.length}개의 댓글</p>
      <br />
      {deleted ? (
        <div>로딩 중 ...</div>
      ) : (
        <>
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
                  {email === comment.email ? <strong style={{ color: "#96908a" }}>{comment.userNickname || "익명"}</strong> : <strong>{comment.userNickname || "익명"}</strong>}

                  <br />
                  <span style={{ color: "gray" }}>
                    {new Date(comment.date).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {email === comment.email && (
                  <div style={{ marginLeft: "auto" }}>
                    <S.EditButton onClick={() => setEditingCommentId(comment.id)}>수정</S.EditButton>
                    <S.DeleteButton onClick={() => handleDelete(comment.id)}>삭제</S.DeleteButton>
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
          <Pagination currentPage={currentPage} totalPages={Math.ceil(commentData.length / itemsPerPage)} setCurrentPage={handlePageChange} />
        </>
      )}
    </div>
  );
}

export default Comment;
