import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom"; // 스타일 관련 컴포넌트를 가져오는 모듈
import { supabase } from "../supabase"; // Supabase를 사용한 인증을 위한 모듈
import Swal from "sweetalert2"; // Swal 팝업 메시지를 표시하기 위한 모듈
import * as S from "../styles/pages/style.login";

function Login() {
  const [email, setEmail] = useState(""); // 이메일 입력 상태 관리
  const [password, setPassword] = useState(""); // 비밀번호 입력 상태 관리
  const navigate = useNavigate(); // React Router의 네비게이션 기능을 사용

  // 이메일과 비밀번호로 로그인하는 함수
  async function signInWithEmail(e: FormEvent) {
    e.preventDefault(); // 기본 폼 제출 동작을 막음

    // 이메일과 비밀번호가 비어있는 경우 경고 팝업 표시
    if (!email && !password) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "이메일과 비밀번호를 입력해주세요.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }

    // 이메일이 비어있는 경우 경고 팝업 표시
    if (!email) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "이메일을 입력해주세요.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }

    // 올바른 이메일 형식인지 확인
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)?$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "올바른 이메일 형식이 아닙니다.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }

    // 비밀번호가 비어있거나 6자리 미만인 경우 경고 팝업 표시
    if (!password) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "비밀번호를 입력해주세요.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    } else if (password.length < 6) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "비밀번호 6자리 이상 입력해주세요.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }

    // Supabase의 signInWithPassword 함수를 사용하여 이메일과 비밀번호로 로그인 시도
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // 로그인 실패 시 오류 메시지 표시
    if (error) {
      Swal.fire({
        title: "로그인 실패",
        text: "회원가입이 되어있지 계정입니다.",
        icon: "error",
      });
    } else if (data) {
      // 로그인 성공 시 홈 페이지로 이동
      navigate("/home");
    }
  }

  // Kakao 소셜 로그인 함수
  const loginWithKakao = async () => {
    const response = await supabase.auth.signInWithOAuth({
      provider: "kakao",
    });
    if (response.error) {
      Swal.fire({
        title: "로그인 실패",
        text: "kakao 로그인 중에 문제가 발생했습니다. 다시 시도해 주세요.",
        icon: "error",
      });
    }
  };

  // Google 소셜 로그인 함수
  const loginWithGoogle = async () => {
    const response = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (response.error) {
      Swal.fire({
        title: "로그인 실패",
        text: "google 로그인 중에 문제가 발생했습니다. 다시 시도해 주세요.",
        icon: "error",
      });
    }
  };

  return (
    <S.LoginContainer>
      <S.LeftSide>
        <img src="/image/login/login.png" alt="사진" />
      </S.LeftSide>
      <S.RightSide>
        <h2>TailTales</h2>
        <S.LoginFormContainer>
          <form onSubmit={signInWithEmail}>
            <div>
              <input
                type="email"
                id="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button className="loginbtn">로그인</button>
            </div>
          </form>
        </S.LoginFormContainer>
        <p>소셜 로그인</p>
        <div>
          <S.KakaoLoginBtn onClick={loginWithKakao}>
            <img
              className="kakaoimg"
              src="/image/social/kakao.png"
              alt="Kakao Login"
            />
          </S.KakaoLoginBtn>
          <S.GoogleLoginBtn onClick={loginWithGoogle}>
            <img
              className="googleimg"
              src="/image/social/google.png"
              alt="Google Login"
            />
          </S.GoogleLoginBtn>
        </div>
        <S.NoAccountMessage>
          계정이 없으신가요?
          <Link to="/signup">회원가입</Link>
        </S.NoAccountMessage>
      </S.RightSide>
    </S.LoginContainer>
  );
}

export default Login;
