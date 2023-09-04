import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
import PostImg from "../components/posts/PostImg";
import { supabase } from "../supabase"; // Supabase 클라이언트 임포트
import { FiArrowLeft } from "react-icons/fi";

interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
  userNickname: string;
}

export default function PostEdit() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 게시물 데이터를 불러오는 쿼리
  const { data, isLoading, isError, error } = useQuery(["posts", id], async () => {
    const { data } = await supabase.from("posts").select("*").eq("id", id).single();

    return data;
  });
  console.log("data", data);

  // 게시물 삭제를 처리하는 뮤테이션
  const deletePost = useMutation(
    async () => {
      await supabase.from("posts").delete().eq("id", id);
    },
    {
      onSuccess: () => {
        // 삭제 성공 후 게시글 추가 로직을 수행합니다.
        handleAddNewPost();
        queryClient.invalidateQueries(["posts", id]);
      },
    }
  );

  // 게시글 추가를 처리하는 함수
  const handleAddNewPost = async () => {
    // 사용자 정보 가져오기
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

    // 업데이트할 게시물 객체 생성
    const updatedPost: any = {
      // any 타입으로 변경
      id: data.id,
      title,
      content,
      date: data.date || new Date().toISOString(),
      userNickname, // 상태로부터 사용자 닉네임 가져옴
      email: userEmail, // 사용자 이메일 추가
    };

    // 게시물 추가 뮤테이션 실행
    await supabase.from("posts").upsert([updatedPost]);
  };

  // 컴포넌트 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userNickname, setUserNickname] = useState(""); // 사용자 닉네임 상태 추가

  // 데이터 로딩 후 게시물 정보를 상태로 설정
  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setContent(data?.content);
    }

    // 사용자 닉네임을 가져와서 상태 업데이트
    const userNicknameFromSessionStorage = sessionStorage.getItem("userNickname");
    if (userNicknameFromSessionStorage) {
      setUserNickname(userNicknameFromSessionStorage);
    }
  }, [data]);

  // 제목 변경 핸들러
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // 내용 변경 핸들러
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  // 수정 버튼 클릭 핸들러
  const handleUpdate = (e: React.FormEvent) => {
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

    const inCinfirmed = window.confirm("정말로 수정하시겠습니까?");

    if (inCinfirmed) deletePost.mutate();

    // 수정이 완료되면 PostDetail 페이지로 돌아감
    navigate(`/post-detail/${id}`);
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
      <BackButton
        onClick={() => {
          window.history.back();
        }}
      >
        <BackIcon />
        뒤로가기
      </BackButton>
      <Form onSubmit={handleUpdate}>
        <h2>게시글 수정</h2>
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

const LoadingText = styled.div`
  font-size: 1.2rem;
  color: gray;
`;

const ErrorText = styled.div`
  font-size: 1.2rem;
  color: red;
`;
