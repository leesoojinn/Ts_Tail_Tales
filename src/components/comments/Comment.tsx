import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Edit from "./Edit";
import Delete from "./Delete";
import { supabase } from "../../supabase"; // Supabase 클라이언트 임포트
import { User } from "@supabase/supabase-js";
import Pagination from "../Pagination";
import styled from "styled-components";

interface CommentProps {
  // comments?: any[];
  comments?: string[];
}

export default function Comment({ comments: commentsProp }: CommentProps) {
  const { id } = useParams<{ id: string }>();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null); // 변경된 부분
  const queryClient = useQueryClient();
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

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
        sessionStorage.setItem("user", JSON.stringify(session.user));
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        sessionStorage.removeItem("user");
      }
    });

    return () => {
      authSubscription.data.subscription.unsubscribe();
    };
  }, []);

  const handleDelete = async (commentId: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await supabase.from("comments").delete().eq("id", commentId);
        queryClient.invalidateQueries(["comments", id]);
      } catch (error) {
        alert("댓글 삭제 오류");
      }
    }
  };

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가
  const itemsPerPage = 5; // 페이지당 댓글 수

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  const indexOfLastComment = currentPage * itemsPerPage;
  const indexOfFirstComment = indexOfLastComment - itemsPerPage;

  const currentComments = commentData!.slice(indexOfFirstComment, indexOfLastComment);

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
                    src={comment.avatar_url || "/image/header/profile.jpg"}
                    alt="User Avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  {email === comment.email ? <strong style={{ color: "#f8b3b3" }}>{comment.userNickname || "익명"}</strong> : <strong>{comment.userNickname || "익명"}</strong>}

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
              {editingCommentId !== comment.id ? (
                <>
                  <div style={{ fontSize: "20px" }}>{comment.content}</div>
                  <br />
                  <br />
                </>
              ) : null}
              {editingCommentId === comment.id && (
                <Edit
                  id={comment.id}
                  onUpdateComplete={() => {
                    queryClient?.invalidateQueries(["comments", id]);
                    setEditingCommentId(null);
                  }}
                />
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
  &:hover {
    background-color: #606060;
  }
`;
