import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import styled from "styled-components";
import Create from "../components/comments/Create";
import { supabase } from "../supabase";
import ReactHtmlParser from "react-html-parser";

export default function PostDetail() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 게시물 데이터 가져오기
  const {
    data: post,
    isError,
    error,
  } = useQuery(["posts", id], async () => {
    const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();

    if (error) {
      throw error;
    }

    return data;
  });

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
        <StDetailText style={{ display: "flex", alignItems: "center" }}>
          <BackIcon
            className="backBtn"
            onClick={() => {
              navigate("/community");
            }}
          >
            〈
          </BackIcon>
          <h2 className="detailtext">
            <strong>{post.userNickname}</strong>님의 글입니다.
          </h2>
        </StDetailText>

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

        <Create
          onCommentAdded={() => {
            queryClient.invalidateQueries(["comments", id]);
          }}
          postId={post.id}
        />
      </Container>
    </OuterContainer>
  );
}

const StDetailText = styled.div`
  margin-top: 100px;
  padding-left: 20px;
  color: black;

  .backBtn {
    background: none;
    border: none;
    color: black;
  }
  .detailtext {
    margin: 0 auto;
    max-width: 350px;
    padding: 20px 0 20px;
  }

  strong {
    color: #746464;
  }
`;
const BackIcon = styled.span`
  margin-right: 5px;
  font-size: 20px;
  font-weight: bolder;
  border-radius: 50%;
  color: black;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.7);
    color: #868686;
  }
`;

const OuterContainer = styled.div`
  background-color: #fdfaf6;
  display: flex;
  justify-content: center;
  position: relative;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

const Container = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background-color: #fdfaf6;
  border-radius: 20px;
`;

const Title = styled.h3`
  border: 1px solid #fdfaf6;
  border-radius: 3px;
  padding: 10px;
  font-size: 32px;
  text-align: center;
  margin: 20px 0;
  background-color: white;
  border-radius: 20px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  border: 1px solid #fdfaf6;
  border-radius: 8px;
  text-align: center;
  overflow: hidden;
  margin-bottom: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
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

const ErrorText = styled.div`
  font-size: 1.2rem;
  color: red;
`;
