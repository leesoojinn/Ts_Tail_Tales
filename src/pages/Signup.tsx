import React, { useState, FormEvent } from "react";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as S from "../styles/pages/style.signup";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const navigate = useNavigate();

  const signupHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password || !passwordConfirm || !nickname || !profileImage) {
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
        const { data, error } = await supabase.storage
          .from("image/profiles") //
          .upload(`${email}/${profileImage.name}`, profileImage);

        if (error) {
          console.error("프로필 사진 업로드 오류:", error);
          return;
        }

        imagePath = `https://livvtclsfcwcjiljzxhh.supabase.co/storage/v1/object/public/image/profiles/${email}/${profileImage.name}`;
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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
        const { data: profileData, error: profileError } = await supabase.from("profiles").upsert([
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
      const regex = /^[a-zA-Z0-9\s-_---.]+$/;
      if (!regex.test(file.name)) {
        Swal.fire({
          icon: "error",
          text: "사진 이름에 특수 문자나 한글이 포함되어 있으면 안됩니다.",
        });
      }
      setProfileImage(file);
    }
  };
  return (
    <S.SignupContainer>
      <S.LeftSide>
        <img src="/image/login/login.png" alt="사진" />
      </S.LeftSide>
      <S.RightSide>
        <form onSubmit={signupHandler}>
          <div>
            <S.InputLabel className="emailtext">이메일</S.InputLabel>
            <S.InputBox type="email" id="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <S.InputLabel>비밀번호</S.InputLabel>
            <S.InputBox type="password" id="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <S.InputBox type="password" id="passwordConfirm" placeholder="비밀번호 확인" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
            <p>최소 6자리 이상</p>
          </div>
          <div>
            <S.InputLabel>닉네임</S.InputLabel>
            <S.InputBox type="text" id="nickname" placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </div>
          <div>
            <S.InputLabel>프로필 사진</S.InputLabel>
            <S.InputBox type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <S.StButton type="submit">회원가입</S.StButton>
        </form>
        <S.NoAccountMessage>
          계정이 있으신가요?
          <Link to="/login">로그인</Link>
        </S.NoAccountMessage>
      </S.RightSide>
    </S.SignupContainer>
  );
}

export default SignUp;
