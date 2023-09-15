import React, { useState, FormEvent } from "react";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styled from "styled-components"; // 추가: 스타일 컴포넌트 라이브러리

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null); // File 또는 null로 타입 설정

  const navigate = useNavigate();

  const signupHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password || !passwordConfirm || !nickname) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "모든 필수 필드를 입력해주세요.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }

    if (password !== passwordConfirm) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "비밀번호가 일치하지 않습니다.",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      return;
    }

    try {
      let imagePath = null;
      if (profileImage) {
        // 프로필 사진이 있는 경우에만 업로드

        const { data, error } = await supabase.storage
          .from("image/profiles") //
          .upload(`${email}/${profileImage.name}`, profileImage);

        if (error) {
          console.error("프로필 사진 업로드 오류:", error);
          return;
        }

        imagePath = `https://livvtclsfcwcjiljzxhh.supabase.co/storage/v1/object/public/image/profiles/${email}/${profileImage.name}`;
      }

      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              user_name: nickname,
              user_profile: imagePath,
            },
          },
        });

      if (signUpError) {
        if (signUpError.message === "User already registered") {
          Swal.fire({
            title: "회원가입 실패",
            text: "이미 가입되어있는 정보입니다.",
            icon: "error",
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "회원 가입 중 오류가 발생했습니다.",
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
          });
        }
        return;
      }

      if (signUpData?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .upsert([
            {
              id: signUpData.user.id as string,
              nickname,
            },
          ]);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "회원 가입 완료되었습니다.",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1200,
        });
        navigate("/home");
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "회원 가입 중 오류가 발생했습니다.",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1200,
        });
      }
    } catch (error: any) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "회원 가입 중 오류",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // const regex = /[!@#$%^&*(),.?":{}|<>ㄱ-ㅎㅏ-ㅣ가-힣]/;
      // if (regex.test(file.name)) {
      //   Swal.fire({
      //     icon: "error",
      //     text: "사진 이름에 특수 문자나 한글이 포함되어 있으면 안됩니다.",
      //   });
      // } else {
      //   setProfileImage(file);
      // }
      setProfileImage(file);
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
            <InputBox
              type="password"
              id="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <InputBox
              type="password"
              id="passwordConfirm"
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <p>최소 6자리 이상</p>
          </div>
          <div>
            <InputLabel>닉네임</InputLabel>
            <InputBox
              type="text"
              id="nickname"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div>
            <InputLabel>프로필 사진</InputLabel>
            <InputBox
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
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
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fdfaf6;

  h2 {
    padding: 100px 0 20px;
    margin-top: 50px;
  }

  .emailtext {
    margin-top: 100px;
  }

  form {
    display: flex;
    flex-direction: column;

    div {
      margin-bottom: 10px;
    }

    p {
      font-size: small;
      margin: 0 10px 10px;
    }

    input {
      width: 100%;
      height: 45px;
      padding: 5px 10px;
      font-size: 15px;
      border: none;
      border-radius: 10px;
      background: #e4dfd9;
      transition: transform 0.3s ease;
      cursor: pointer;

      &:focus {
        border-radius: 10px;
      }

      &:hover {
        transform: scale(1.05);
      }
    }

    button {
      width: 100%;
      height: 44px;
      margin: 5px 11px;
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
    @media (max-width: 850px) {
      width: 84%;
      padding-right: 30px;
    }
  }
`;

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
  font-family: "NanumSquareNeo-Regular";

  &:focus {
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
  font-family: "BMJUA-Regular";
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
