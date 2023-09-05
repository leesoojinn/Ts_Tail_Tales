import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import styled from "styled-components";
import Create from "../components/comments/Create";
import Comment from "../components/comments/Comment";
import { supabase } from "../supabase";
import ReactHtmlParser from "react-html-parser";
import { FiArrowLeft } from "react-icons/fi"; // 이모티콘을 위한 아이콘 라이브러리 import

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
    const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();

    if (error) {
      throw error;
    }

    return data;
  });
  console.log("detailpostid", post);

  // 댓글 목록 가져오기
  const { data: comments, isLoading: isLoadingComments } = useQuery(["comments", id], async () => {
    const { data, error } = await supabase.from("comments").select("*").eq("postId", id).order("date", { ascending: true });

    if (error) {
      throw error;
    }

    return data;
  });

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
    <OuterContainer>
      <Container>
        <BackButton
          onClick={() => navigate("/community")}
          className="backbutton"
        >
          <BackIcon className="backicon">&lt;</BackIcon>
        </BackButton>

        <UserInfo>
          <strong>{post.userNickname}</strong>님의 글입니다.
        </UserInfo>

        <Title>{post.title}</Title>
        <Content>
          {ReactHtmlParser(post.content)}
          <ButtonContainer>
            {isUserAuthorized && (
              <>
                <EditButton to={`/post-edit/${post.id}`}>수정</EditButton>
                <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
              </>
            )}
          </ButtonContainer>
        </Content>

        <Create onCommentAdded={refreshPostData} postId={post.id} />
        <Comment comments={comments} />
      </Container>
    </OuterContainer>
  );
}

const BackButton = styled.button`
  padding: 10px 20px;
  background-color: #fdfaf6;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #bdb7b0;
    transform: scale(1.05);
  }
`;

const BackIcon = styled.span`
  margin-right: 5px;
  font-size: 20px;
  border-radius: 50%;
  color: black;
`;

const Container = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background-color: #fdfaf6;
  border-radius: 20px;
  /* 중앙 정렬 및 양옆 공백 설정 */
  /* max-width: 1200px; */ /* 이 부분을 제거합니다. */
  /* margin: 0 auto; */ /* 이 부분을 제거합니다. */
  /* padding: 0 1rem; */ /* 이 부분을 제거합니다. */
`;
const OuterContainer = styled.div`
  background-color: #fdfaf6;
  display: flex;
  justify-content: center;
`;

const UserInfo = styled.p`
  text-align: center;
  margin-top: 20px;
`;

const Title = styled.h3`
  border: 1px solid #fdfaf6;
  border-radius: 8px;
  padding: 10px;
  font-size: 32px;
  text-align: center;
  margin: 20px 0;
  background-color: white;
  border-radius: 20px;
`;

const Content = styled.div`
  border: 1px solid #fdfaf6;
  border-radius: 8px;
  text-align: center;
  overflow: hidden; /* 내용이 넘칠 경우 숨김 처리 */
  margin-bottom: 20px;
  padding: 20px; /* 내용의 안쪽 여백 조정 */
  background-color: white;
  border-radius: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
  padding: 10px 0;
`;

const EditButton = styled(Link)`
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

const LoadingText = styled.div`
  font-size: 1.2rem;
  color: gray;
`;

const ErrorText = styled.div`
  font-size: 1.2rem;
  color: red;
`;
