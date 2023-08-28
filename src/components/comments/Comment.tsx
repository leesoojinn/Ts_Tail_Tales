import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Edit from "./Edit";
import Delete from "./Delete";
import { supabase } from "../../supabase"; // Supabase 클라이언트 임포트

interface CommentProps {
  comments?: any[];
}

export default function Comment({ comments: commentsProp }: CommentProps) {
  const { id } = useParams<{ id: string }>();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);
  const queryClient = useQueryClient();
  console.log(id);
  const {
    data: commentData,
    isLoading,
    isError,
    error,
  } = useQuery(
    ["comments", id],
    async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("postId", id)
        .order("date", { ascending: true });

      if (error) {
        throw error;
      }
      console.log(id);
      console.log(data);

      return data;
    },
    {
      enabled: !!id,
    }
  );

  console.log("comment", commentData);
  console.error(error);

  const updateCommentMutation = useMutation(
    async (updatedComment) => {
      const { data, error } = await supabase
        .from("comments")
        .upsert([updatedComment]);

      if (error) {
        console.error("댓글 수정 중 오류 발생:", error);
        throw error;
      }

      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", id]);
        setEditingCommentId(null);
      },
    }
  );

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

  return (
    <div>
      {deleted ? (
        <div>로딩 중</div>
      ) : (
        <>
          {commentData?.map((comment) => (
            <div key={comment.id}>
              <div>작성자: {comment.userNickname}님</div>
              <div>
                {new Date(comment.date).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div>댓글: {comment.content}</div>
              {email === comment.email && (
                <>
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
                      <button onClick={() => setEditingCommentId(comment.id)}>
                        수정
                      </button>
                      <button onClick={() => handleDelete(comment.id)}>
                        삭제
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
