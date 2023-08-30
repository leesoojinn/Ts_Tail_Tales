import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Edit from "./Edit";
import Delete from "./Delete";
import { supabase } from "../../supabase"; // Supabase 클라이언트 임포트
import { User } from "@supabase/supabase-js";

interface CommentProps {
  comments?: any[];
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

  // 사용자 닉네임 가져오기
  useEffect(() => {
    async function fetchUserNickname() {
      if (user) {
        const { data, error } = await supabase.from("users").select("nickname").eq("id", user.id).single();
        if (error) {
          console.error("사용자 정보를 가져올 수 없습니다:", error);
        } else {
          setUserNickname(data?.nickname || null);
        }
      }
    }
    fetchUserNickname();
  }, [user]);

  const handleDelete = async (commentId: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await supabase.from("comments").delete().eq("id", commentId);
        queryClient.invalidateQueries(["comments", id]);
        window.location.reload();
      } catch (error) {
        console.error("댓글 삭제 오류:", error);
      }
    }
  };

  if (isLoading) {
    return <div>로딩 중 ...</div>;
  }

  if (isError) {
    return <div>{(error as Error).message}</div>;
  }

  if (!commentData) {
    console.log("commentData is empty or undefined:", commentData);
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

  const email = sessionStorage.getItem("userEmail")?.toLowerCase();

  console.log("user", user);
  return (
    <div>
      <p>{commentData.length}개의 댓글</p>
      <br />
      {deleted ? (
        <div>로딩 중 ...</div>
      ) : (
        <>
          {commentData?.map((comment) => (
            <div key={comment.id}>
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
                  <img src={comment.avatar_url || "/image/profile.jpg"} alt="User Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <strong>{comment.userNickname || "익명"}</strong> <br />
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
                    <button style={{ color: "gray", marginRight: "5px", border: "none", background: "none", cursor: "pointer" }} onClick={() => setEditingCommentId(comment.id)}>
                      수정
                    </button>
                    <button style={{ color: "#dd3a3a", border: "none", background: "none", cursor: "pointer" }} onClick={() => handleDelete(comment.id)}>
                      삭제
                    </button>
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
            </div>
          ))}
        </>
      )}
    </div>
  );
}
