import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import styled from "styled-components";
import PostImg from "../components/posts/PostImg";
import { supabase } from "../supabase";
import { FiArrowLeft } from "react-icons/fi";

export default function PostEdit() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useQuery(["posts", id], async () => {
    const { data } = await supabase.from("posts").select("*").eq("id", id).single();
    return data;
  });

  const handleAddNewPost = useMutation(
    async (updatedData) => {
      await supabase.from("posts").upsert([updatedData]);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts", id]);
        navigate(`/post-detail/${id}`);
      },
    }
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setContent(data?.content);
    }
  }, [data]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !content) {
      alert("제목을 입력해주세요, 내용을 입력해주세요.");
      return;
    }
    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content) {
      alert("내용을 입력해주세요.");
      return;
    }
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      console.error("사용자 정보가 없습니다.");
      return;
    }

    const user = JSON.parse(storedUser);
    const userEmail = user?.email;

    if (!userEmail) {
      console.error("사용자 이메일이 없습니다.");
      return;
    }
    const userNickname = sessionStorage.getItem("userNickname"); // Get userNickname from sessionStorage
    if (data.email !== userEmail) {
      alert("자신의 게시물만 수정할 수 있습니다.");
      return;
    }
    const isConfirmed = window.confirm("정말로 수정하시겠습니까?");

    if (isConfirmed) {
      const updatedPost: any = {
        id: data.id,
        title,
        content,
        date: data.date || new Date().toISOString(),
        userNickname,
        email: userEmail,
      };
      handleAddNewPost.mutate(updatedPost);
    }

    if (isLoading) {
      return <LoadingText>로딩 중 ...</LoadingText>;
    }
    if (isError) {
      return <ErrorText>{(error as Error).message}</ErrorText>;
    }
    if (!data) {
      return <ErrorText>게시물을 찾을 수 없습니다.</ErrorText>;
    }
  };

  return (
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
        <h2 className="detailtext">게시글 수정</h2>
      </StDetailText>
      <Form onSubmit={handleUpdate}>
        <FormItem>
          <label>제목:</label>
          <Input type="text" value={title} onChange={handleTitleChange} />
        </FormItem>
        <FormItem>
          <label>내용:</label>
          <PostImg onContentChange={handleContentChange} initialContent={data.content} />
        </FormItem>
        <SubmitButton type="submit">수정</SubmitButton>
      </Form>
    </Container>
  );
}
const StDetailText = styled.div`
  // margin-top: 30px;
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
`;

const Container = styled.div`
  padding: 20px;
  width: 1000px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  width: 1000px;
`;
const Input = styled.input`
  width: 978px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px; /* 테두리 둥글게 처리 */
`;
const SubmitButton = styled.button`
  width: 80px;
  height: 40px;
  padding: 10px 20px;
  background-color: #746464;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 8px; /* 테두리 둥글게 처리 */
  &:hover {
    background-color: #dd3a3a;
    transform: scale(1.05);
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
