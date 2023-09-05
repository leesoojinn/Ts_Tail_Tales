import React, { useState, useEffect, FormEvent } from "react";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import MainFooter from "../components/mains/MainFooter";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(""); // 추가: 이메일 유효성 에러 메시지
  const [passwordError, setPasswordError] = useState(""); // 추가: 비밀번호 유효성 에러 메시지
  const navigate = useNavigate();
  async function signInWithEmail(e: FormEvent) {
    e.preventDefault();
    if (!email && !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
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
    // 이메일 형식 검사
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error(error);
      // 에러 처리: 에러 메시지를 사용자에게 보여주거나 다른 처리를 수행합니다.
      alert("일치하는 정보가 없습니다.");
    } else if (data) {
      // 로그인 성공
      const { user, session } = data;
      const confirmed = window.confirm("로그인 하시겠습니까?");
      if (confirmed) {
        navigate("/home");
      }
    }
  }

  const loginWithKakao = async () => {
    const response = await supabase.auth.signInWithOAuth({
      provider: "kakao",
    });

    if (response.error) {
      console.error(response.error);
      // 에러 처리
    } else {
      alert("로그인 완료");
      // 다른 처리 또는 리디렉션을 여기에 추가할 수 있습니다.
    }
  };

  const loginWithGoogle = async () => {
    const response = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (response.error) {
      console.error(response.error);
      // 에러 처리
    }
    // else {
    //   alert("로그인하러 갈까요~?");
    // }
  };

  return (
    <>
      <Stdiv>
        <StloginText style={{ display: "flex", alignItems: "center" }}>
          <button
            className="backBtn"
            onClick={() => {
              window.history.back();
            }}
          >
            〈
          </button>
          <h2 className="logintext">로그인</h2>
        </StloginText>
        <LoginContainer>
          <Stlogo>TailTales</Stlogo>
          <form onSubmit={signInWithEmail}>
            <StInputBoxDiv>
              <InputBox
                type="email"
                id="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </StInputBoxDiv>
            <StInputBoxDiv>
              <InputBox
                type="password"
                id="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </StInputBoxDiv>
            <StButton>로그인</StButton>
          </form>

          <p>소셜 로그인</p>
          <div>
            <StKakaoLoginBtn onClick={loginWithKakao}>
              <img
                className="kakaoimg"
                src="/image/kakao.png"
                alt="Kakao Login"
              />
            </StKakaoLoginBtn>
            <StGoolgeLoginBtn onClick={loginWithGoogle}>
              <img
                className="googleimg"
                src="/image/google.png"
                alt="Google Login"
              />
            </StGoolgeLoginBtn>
          </div>

          <NoAccountMessage>
            계정이 없으신가요?
            <Link to="/signup">회원가입</Link>
          </NoAccountMessage>
        </LoginContainer>
      </Stdiv>
      <MainFooter />
    </>
  );
}

export default Login;

const StloginText = styled.div`
  margin-top: 0;
  padding-left: 20px;
  color: white;
  margin-bottom: 150px;

  .backBtn {
    background: none;
    border: none;
    color: white;
  }

  .logintext {
    margin: 0 auto;
    max-width: 350px;
    padding: 20px;
  }
`;

const Stdiv = styled.div`
  /* height: 1000px; */
  /* 머지 */
  background-image: url("/image/login2.png");
  background-size: cover;
  /* 이미지를 컨테이너에 맞게 확대/축소. */
  background-repeat: no-repeat; /* 이미지 반복 없음 */
  background-position: center; /*이미지 중앙 정렬*/
  padding: 0 50px 50px 50px;
`;

// 스타일 영역
const LoginContainer = styled.div`
  border-radius: 20px;
  background: #fdfaf6;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  margin: 150px 50px 200px auto;
  max-width: 350px;
  padding: 20px;
  width: 350px;
  height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #c7c4c4;
`;

const Stlogo = styled.h2`
  padding: 20px 0 20px;
`;

const StInputBoxDiv = styled.div`
  padding: 0 0 10px;
`;

const InputBox = styled.input`
  width: 270px;
  height: 35px;
  margin: 5px;
  padding: 5px 16px;
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
`;

const StButton = styled.button`
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
`;

const StKakaoLoginBtn = styled.button`
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  .kakaoimg {
    width: 45px;
    height: auto;
  }
`;

const StGoolgeLoginBtn = styled.button`
  background: none;
  /* width: 45px;
  height: 45px; */
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  .googleimg {
    width: 45px;
    height: auto;
  }
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
