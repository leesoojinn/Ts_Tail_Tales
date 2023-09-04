import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid"; // uuid 패키지에서 v4 함수 임포트
import { User } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import PostImg from "../components/posts/PostImg";
import { FiArrowLeft } from "react-icons/fi";

export default function PostCreate(data: any) {
  const [title, setTitle] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자 정보 가져오기
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      setUserNickname(
        user.user_metadata.user_name || user.user_metadata.full_name
      );
    }
  }, []);

  useEffect(() => {
    if (data && data.initialContent) {
      setContent(data.initialContent);
    }
  }, [data]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !content) {
      window.alert("제목을 입력해주세요, 내용을 입력해주세요.");
      return;
    }
    if (!title) {
      window.alert("제목을 입력해주세요.");
      return;
    }
    if (!content) {
      window.alert("내용을 입력해주세요.");
      return;
    }

    try {
      // Supabase에 데이터 추가
      const { data, error } = await supabase.from("posts").upsert([
        {
          id: uuid(), // uuid 함수 사용
          title,
          content,
          date: new Date().toISOString(),
          userNickname: userNickname,
          email: user!.email,
        },
      ]);

      if (error) {
        console.error("게시글 작성 오류:", error);
        return;
      }

      console.log("게시글 작성 결과:", data);
      window.alert("작성이 완료되었습니다.");
      navigate("/community");

      // 입력 필드 초기화
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("게시글 작성 오류:", error);
    }
  };

  return (
    <Container>
      <BackButton
        onClick={() => {
          window.history.back();
        }}
      >
        <BackIcon />
        뒤로가기
      </BackButton>
      <Form onSubmit={handleSubmit}>
        <h2>게시글 작성</h2>
        <FormItem>
          <label>제목:</label>
          <Input type="text" value={title} onChange={handleTitleChange} />
        </FormItem>
        <FormItem>
          <label>내용:</label>
          <PostImg
            onContentChange={handleContentChange}
            initialContent={content}
          />
          {/* data.content가 아닌 content를 사용 */}
        </FormItem>
        <SubmitButton type="submit">작성</SubmitButton>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  width: 1000px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background-color: #f8b3b3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    background-color: #f8b3b3;
    transform: scale(1.05);
  }

  /* @media (max-width: 768px) {
    // 화면 너비가 768px 이하일 때
    margin-left: 0; // 마진을 0으로 조정하여 가운데 정렬
    margin-top: 10px; // 상단 마진을 추가하여 버튼 간 간격 확보/
  } */
`;

const BackIcon = styled(FiArrowLeft)`
  margin-right: 5px;
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
  padding: 10px 20px;
  background-color: #f8b3b3;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 8px; /* 테두리 둥글게 처리 */
  &:hover {
    background-color: #dd3a3a;
    transform: scale(1.05);
  }
`;
