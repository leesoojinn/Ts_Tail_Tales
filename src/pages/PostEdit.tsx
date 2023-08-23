import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import styled from "styled-components";

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function PostEdit() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useQuery(["posts", id], async () => {
    const response = await axios.get(`http://localhost:4000/posts/${id}`);
    return response.data;
  });

  const updatePost = useMutation(
    async (updatedPost: Post) => {
      await axios.put(`http://localhost:4000/posts/${id}`, updatedPost);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts", id]);
        window.alert("수정이 완료되었습니다.");
        navigate(`/post-detail/${id}`);
      },
    }
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setContent(data.content);
    }
  }, [data]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPost: Post = {
      id: data.id,
      title,
      content,
    };
    updatePost.mutate(updatedPost);
  };

  if (isLoading) {
    return <LoadingText>로딩 중 ...</LoadingText>;
  }

  if (isError) {
    return <ErrorText>{(error as Error).message}</ErrorText>;
  }

  if (!data) {
    return <ErrorText>게시물을 찾을 수 없습니다.</ErrorText>;
  }

  return (
    <Container>
      <Form onSubmit={handleUpdate}>
        <h2>게시글 수정</h2>
        <FormItem>
          <label>제목:</label>
          <Input type="text" value={title} onChange={handleTitleChange} />
        </FormItem>
        <FormItem>
          <label>내용:</label>
          <Textarea value={content} onChange={handleContentChange} />
        </FormItem>
        <SubmitButton type="submit">수정 완료</SubmitButton>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
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
`;

const Input = styled.input`
  width: 1000px;
  padding: 10px;
`;

const Textarea = styled.textarea`
  width: 1000px;
  height: 300px;
  padding: 10px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
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
