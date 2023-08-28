import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

import styled from "styled-components";
import Create from "../components/comments/Create";
import Comment from "../components/comments/Comment";
import { supabase } from "../supabase";
import ReactHtmlParser from "react-html-parser";

interface Post {
  id: number;
  title: string;
  content: string;
  userNickname: string;
}

export default function PostDetail() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 게시물 데이터 가져오기
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery(["posts", id], async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  });
  console.log("detailpostid", post);

  // 댓글 목록 가져오기
  const { data: comments, isLoading: isLoadingComments } = useQuery(
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

      return data;
    }
  );

  // 게시물 수정 후 댓글 목록 다시 가져오기
  const refreshPostData = async () => {
    await queryClient.invalidateQueries(["comments", id]);
  };

  if (isLoading || isLoadingComments) {
    return <LoadingText>로딩 중 ...</LoadingText>;
  }

  if (isError) {
    return <ErrorText>{(error as Error).message}</ErrorText>;
  }

  if (!post) {
    navigate("/community");
    return null;
  }

  const isUserAuthorized = post.email === sessionStorage.getItem("userEmail");

  // 게시물 삭제 함수
  const deletePost = async (postId: number) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      throw error;
    }
  };

  // 게시물 삭제 핸들러
  const handleDelete = async () => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      await deletePost(post.id);
      navigate("/community");
    }
  };

  return (
    <Container>
      <h2>디테일 페이지</h2>
      <p>{post.userNickname}님의 글입니다.</p>
      <h3>{post.title}</h3>
      {ReactHtmlParser(post.content)}
      <ButtonContainer>
        {isUserAuthorized && (
          <>
            <EditButton to={`/post-edit/${post.id}`}>수정</EditButton>
            <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
          </>
        )}
      </ButtonContainer>
      <p>댓글</p>
      <Create onCommentAdded={refreshPostData} postId={post.id} />
      <Comment comments={comments} />
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const EditButton = styled(Link)`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  text-decoration: none;
`;

const DeleteButton = styled.button`
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
`;

const LoadingText = styled.div`
  font-size: 1.2rem;
  color: gray;
`;

const ErrorText = styled.div`
  font-size: 1.2rem;
  color: red;
`;
