import React, { useState, FormEvent } from "react";
import { supabase } from "../supabase";
import { styled } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const signupHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!email && !password && !nickname) {
      alert("이메일과 비밀번호, 닉네임을 입력해주세요.");
      return;
    }
    // 추가: 이메일 유효성 검사
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)?$/;
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }
    // 추가: 비밀번호 유효성 검사
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    } else if (password.length < 6) {
      alert("비밀번호 6자리 이상 입력해주세요.");
      return;
    }
    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              user_name: nickname,
            },
          },
        });
      if (!signUpError) {
        // 회원 가입 성공 시 추가 정보 업데이트
        if (signUpData?.user) {
          // .user 프로퍼티 확인
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .upsert([
              {
                id: signUpData.user.id as string,
                nickname,
              },
            ]);
          alert("회원 가입 완료되었습니다.");
          navigate("/home");
        } else {
          alert("회원 가입 중 오류가 발생했습니다.");
        }
      } else {
        alert(signUpError.message);
      }
    } catch (error) {
      alert("알 수 없는 오류가 발생했습니다.");
    }
  };
  return (
    <SignupContainer>
      <form onSubmit={signupHandler}>
        <InputContainer>
          <div>
            <InputLabel>이메일</InputLabel>
            ​
            <InputBox
              type="email"
              id="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <InputLabel>비밀번호</InputLabel>
            ​
            <InputBox
              type="password"
              id="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <InputLabel>닉네임</InputLabel>
            ​
            <InputBox
              type="text"
              id="nickname"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <StButton type="submit">회원가입</StButton>
          <NoAccountMessage>
            계정이 있으신가요?
            <Link to="/login">로그인</Link>
          </NoAccountMessage>
        </InputContainer>
      </form>{" "}
    </SignupContainer>
  );
}
const SignupContainer = styled.div`
  margin: auto;
  background-color: #fff;
  padding: 20px;
  width: 420px;
  height: 700px;
  border-radius: 10px;
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #9f9a9a;
  padding: 40px;
  margin-top: 20px;
  border-radius: 10px;
`;
const InputLabel = styled.div`
  margin: 5px 5px 5px 5px;
  font-weight: bold;
  justify-content: center;
`;
const InputBox = styled.input`
  width: 282px;
  height: 30px;
  margin: 5px 5px 10px;
  padding-left: 10px;
  font-size: 15px;
  display: inline-block;
  outline: none;
  ​ &:focus {
    border: 2px solid #333;
    border-radius: 3px;
  }
`;
const StButton = styled.button`
  width: 300px;
  height: 50px;
  margin: 30px;
  cursor: pointer;
  font-size: 15px;
  border-radius: 3px;
  background-color: #333;
  border: #333;
  color: white;
`;
const NoAccountMessage = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #555;

  a {
    color: #333;
    text-decoration: underline;

    &:hover {
      color: #555;
    }
  }
`;
export default SignUp;
