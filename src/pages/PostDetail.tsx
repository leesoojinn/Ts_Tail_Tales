import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import Create from "../components/comments/Create";
import Comment from "../components/comments/Comment";
import { supabase } from "../supabase";
import ReactHtmlParser from "react-html-parser";
import Swal from "sweetalert2";
import * as S from "../styles/pages/style.postdetail";

function PostDetail() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery(["posts", id], async () => {
    const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
    if (error) {
      throw error;
    }

    return data;
  });

  if (isLoading) {
    return <S.LoadingText>로딩 중 ...</S.LoadingText>;
  }

  if (isError) {
    return <S.ErrorText>{(error as Error).message}</S.ErrorText>;
  }

  if (!post) {
    navigate("/community");
    return null;
  }

  const isUserAuthorized = post.email === sessionStorage.getItem("userEmail");

  const deletePost = async (postId: number) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      throw error;
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "정말로 이 게시물을 삭제하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      await deletePost(post.id);
      navigate("/community");
    }
  };

  return (
    <S.OuterContainer>
      <S.Container>
        <S.StDetailText style={{ display: "flex", alignItems: "center" }}>
          <S.BackIcon
            className="backBtn"
            onClick={() => {
              navigate("/community");
            }}
          >
            〈
          </S.BackIcon>
          <h2 className="detailtext">
            <strong>{post.userNickname}</strong>님의 글입니다.
          </h2>
        </S.StDetailText>

        <S.Title>{post.title}</S.Title>
        <S.Content>
          {ReactHtmlParser(post.content)}
          <S.ButtonContainer>
            {isUserAuthorized && (
              <>
                <S.EditButton to={`/post-edit/${post.id}`}>수정</S.EditButton>
                <S.DeleteButton onClick={handleDelete}>삭제</S.DeleteButton>
              </>
            )}
          </S.ButtonContainer>
        </S.Content>

        <Create postId={post.id} />
        <Comment postId={post.id} />
      </S.Container>
    </S.OuterContainer>
  );
}

export default PostDetail;
