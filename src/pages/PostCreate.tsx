import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid"; // uuid 패키지에서 v4 함수 임포트
import { supabase } from "../supabase";
import PostImg from "../components/posts/PostImg";
import Swal from "sweetalert2";

export default function PostCreate() {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const navigate = useNavigate();
  // 사용자 정보 가져오기
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userNickname = user ? user.user_metadata.user_name || user.user_metadata.full_name : null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ content });
    if (!title && !content.trim()) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "제목과 내용을 입력해주세요.",
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
    try {
      const { error } = await supabase.from("posts").insert([
        {
          id: uuid(),
          title,
          content,
          date: new Date().toISOString(),
          userNickname: userNickname,
          email: user?.email,
        },
      ]);

      if (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "게시글 작성 오류",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1200,
        });
        return;
      }
      Swal.fire({
        position: "center",
        icon: "success",
        title: "작성이 완료되었습니다.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      navigate("/community");
      // 입력 필드 초기화
      setTitle("");
      setContent("");
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "게시글 작성 오류",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
    }
  };

  const handleGoBack = async () => {
    const result = await Swal.fire({
      title: "이전으로 가면 작성 내용이 사라집니다.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "이전",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      navigate("/community");
    }
  };

  return (
    <OuterContainer>
      <Container>
        <h2 className="detailtext">게시글 작성</h2>
        <Form onSubmit={handleSubmit}>
          <FormItem>
            <Input type="text" value={title} onChange={handleTitleChange} placeholder="제목을 입력해주세요" />
          </FormItem>
          <FormItem>
            <PostImg onContentChange={handleContentChange} initialContent={content} />
          </FormItem>
          <FormButtons>
            <SubmitButton type="button" className="backbtn" onClick={handleGoBack}>
              이전
            </SubmitButton>
            <SubmitButton type="submit" className="submitbtn">
              등록
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

  // @media screen and (max-width: 700px) {
  //   height: 100vh;
  // }
`;

const Container = styled.div`
  padding-top: 70px;
  margin: 0 auto;
  background-color: #fdfaf6;

  h2 {
    text-align: center;
    margin-bottom: 40px;
  }

  @media screen and (max-width: 700px) {
    height: 100vh;
    position: fixed; /* 화면에 고정 */
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
