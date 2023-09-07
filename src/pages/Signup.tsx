import React, { useState, FormEvent } from "react";
import { supabase } from "../supabase";
import { styled } from "styled-components";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
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
    } else if (!/^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(password)) {
      alert("비밀번호는 영문, 숫자, 특수 문자 중 하나 이상을 포함해야 합니다.");
      return;
    }

    if (!password || !passwordConfirm) {
      alert("비밀번호 또는 비밀번호 확인을 확인해주세요.");
      return;
    } else if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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
          const { data: profileData, error: profileError } = await supabase.from("profiles").upsert([
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
        alert("이미 가입되어있는 정보입니다.");
      }
    } catch (error) {
      alert("알 수 없는 오류가 발생했습니다.");
    }
  };
  return (
    <SignupContainer>
      <LeftSide>
        <img src="/image/login/login2-1.png" alt="사진" />
      </LeftSide>
      <RightSide>
        <form onSubmit={signupHandler}>
          <div>
            <InputLabel className="emailtext">이메일</InputLabel>
            <InputBox type="email" id="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <InputLabel>비밀번호</InputLabel>
            <InputBox type="password" id="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <InputBox type="password" id="passwordConfirm" placeholder="비밀번호 확인" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
            <p>영문 · 숫자 · 특수문자 조합, 최소 6자리 이상</p>
          </div>
          <div>
            <InputLabel>닉네임</InputLabel>
            <InputBox type="text" id="nickname" placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </div>
          <StButton type="submit">회원가입</StButton>
        </form>
        <NoAccountMessage>
          계정이 있으신가요?
          <Link to="/login">로그인</Link>
        </NoAccountMessage>
      </RightSide>
    </SignupContainer>
  );
}

export default SignUp;

const LeftSide = styled.div`
  width: 50%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RightSide = styled.div`
  width: 50%;
  /* padding: 20px; */
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fdfaf6;

  h2 {
    /* font-family: Haan Baekje M; */
    padding: 100px 0 20px;
    margin-top: 50px;
  }

  .emailtext {
    margin-top: 130px;
  }

  form {
    display: flex;
    flex-direction: column;
    /* margin-top: 50px; */

    div {
      margin-bottom: 10px;
    }

    p {
      font-size: small;
      margin: 0 10px 10px;
    }

    input {
      width: 270px;
      height: 45px;
      /* margin: 5px; */
      padding: 5px 10px;
      font-size: 15px;
      /* border: 1px solid #b4b4b4; */
      border: none;
      border-radius: 10px;
      background: #e4dfd9;
      transition: transform 0.3s ease;
      cursor: pointer;
      /* color: #888888; */
      /* display: inline-block; */
      /* outline: none; */
      &:focus {
        border-radius: 10px;
      }
      &:hover {
        transform: scale(1.05);
      }
    }

    button {
      width: 192px;
      height: 44px;
      /* padding: 8px; */
      margin: 5px 55px;
      cursor: pointer;
      font-size: 15px;
      border: none;
      color: white;
      border-radius: 999px;
      background: #746464;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
      &:hover {
        transform: scale(1.05);
      }
    }
  }
`;

//----------------------------
const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
