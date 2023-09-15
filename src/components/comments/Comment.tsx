import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Edit from "./Edit";
import { supabase } from "../../supabase";
import Pagination from "../Pagination";
import styled from "styled-components";
import usePageHook from "../../hooks/pageHook";
import Swal from "sweetalert2";

interface CommentProps {
  comments?: string[];
  postId?: string;
}

export default function Comment({ comments: commentsProp }: CommentProps) {
  const { id } = useParams<{ id: string }>();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);
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

  // const handleDelete = async (commentId: string) => {
  //   if (window.confirm("정말 삭제?")) {
  //     try {
  //       await supabase.from("comments").delete().eq("id", commentId);
  //       queryClient.invalidateQueries(["comments", id]);
  //     } catch (error) {
  //       Swal.fire({
  //         position: "center",
  //         icon: "error",
  //         title: "댓글 삭제 오류",
  //         showConfirmButton: false,
  //         timerProgressBar: true,
  //         timer: 3000,
  //       });
  //     }
  //   }
  // };

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
            <CommentContainer key={comment.id}>
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
                    <EditButton onClick={() => setEditingCommentId(comment.id)}>수정</EditButton>
                    <DeleteButton onClick={() => handleDelete(comment.id)}>삭제</DeleteButton>
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
            </CommentContainer>
          ))}
          <Pagination currentPage={currentPage} totalPages={Math.ceil(commentData.length / itemsPerPage)} setCurrentPage={handlePageChange} />
        </>
      )}
    </div>
  );
}

const CommentContainer = styled.div`
  border-radius: 8px;
  padding: 10px 0 0 20px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  background-color: white;
  border: 1px solid #fdfaf6;
  font-family: "NanumSquareNeo-Regular";
`;
const EditButton = styled.button`
  background-color: #bdb7b0;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  text-decoration: none;
  font-size: 13px;
  margin-right: 10px;
  font-family: "BMJUA-Regular";

  &:hover {
    background-color: #606060;
  }
`;

const DeleteButton = styled.button`
  background-color: #746464;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  text-decoration: none;
  font-size: 13px;
  margin-right: 10px;
  font-family: "BMJUA-Regular";

  &:hover {
    background-color: #606060;
  }
`;
