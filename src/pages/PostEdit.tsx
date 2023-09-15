import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import styled from "styled-components";
import PostImg from "../components/posts/PostImg";
import { supabase } from "../supabase";
import Swal from "sweetalert2";
interface UpdatedData {
  id: string;
}

export default function PostEdit() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useQuery(["posts", id], async () => {
    const { data } = await supabase.from("posts").select("*").eq("id", id).single();
    return data;
  });

  const handleAddNewPost = useMutation(
    async (updatedData: UpdatedData) => {
      await supabase.from("posts").update(updatedData).eq("id", updatedData.id);
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !content) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "제목을 입력해주세요, 내용을 입력해주세요.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }
    if (!title) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "제목을 입력해주세요.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }
    if (!content.trim() || content === "<p><br></p>") {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "내용을 입력해주세요.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "사용자 정보가 없습니다.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }

    const user = JSON.parse(storedUser);
    const userEmail = user?.email;

    if (!userEmail) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "사용자 이메일이 없습니다.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }
    const userNickname = sessionStorage.getItem("userNickname"); // Get userNickname from sessionStorage
    if (data.email !== userEmail) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "자신의 게시물만 수정할 수 있습니다.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }

    const result = await Swal.fire({
      title: "정말로 수정하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "수정",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
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

  const handleGoBack = async () => {
    // if (window.confirm("이전으로 가면 수정 내용이 사라집니다.")) {
    //   navigate(`/post-detail/${id}`);
    // }

    const result = await Swal.fire({
      title: "이전으로 가면 수정 내용이 사라집니다.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "이전",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      navigate(`/post-detail/${id}`);
    }
  };

  return (
    <OuterContainer>
      <Container>
        <h2 className="detailtext">게시글 수정</h2>
        <Form onSubmit={handleUpdate}>
          <FormItem>
            <Input type="text" value={title} onChange={handleTitleChange} placeholder="제목을 입력해주세요" />
          </FormItem>
          <FormItem>
            <PostImg onContentChange={handleContentChange} initialContent={data.content} />
          </FormItem>
          <FormButtons>
            <SubmitButton type="button" className="backbtn" onClick={handleGoBack}>
              이전
            </SubmitButton>
            <SubmitButton type="submit" className="submitbtn">
              수정
            </SubmitButton>
          </FormButtons>
        </Form>
      </Container>
    </OuterContainer>
  );
}

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
  padding: 70px;
  margin: 0 auto;
  background-color: #fdfaf6;

  h2 {
    text-align: center;
    margin-bottom: 40px;
  }

  @media screen and (max-width: 700px) {
    height: 100vh;
    // position: fixed; /* 화면에 고정 */
    left: 0; /* 화면 맨 왼쪽에 배치 */
    right: 0; /* 화면 맨 오른쪽에 배치 */
    overflow-y: auto; /* 내용이 넘칠 경우 스크롤 허용 */
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  padding-bottom: 25px;

  @media screen and (max-width: 700px) {
    position: absolute;
    width: 250px;
    margin-top: 550px;
  }
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;
const Input = styled.input`
  width: 978px;
  height: 30px;
  padding: 15px 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  font-size: large;

  @media screen and (max-width: 700px) {
    width: 350px;
  }
`;

const SubmitButton = styled.button`
  color: white;
  border: none;
  cursor: pointer;
  width: 192px;
  height: 44px;
  padding: 8px;
  border-radius: 999px;
  background: #746464;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
  font-family: "BMJUA-Regular";

  ${(props) => (props.className === "backbtn" ? "background: #bdb7b0;" : "background: #746464;")}

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
