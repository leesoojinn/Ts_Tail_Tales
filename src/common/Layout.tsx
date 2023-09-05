import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { supabase } from "../supabase";
import { User } from "@supabase/supabase-js";

function Layout() {
  // 사용자 및 사용자 닉네임 상태를 관리하는 상태 변수 정의
  const [user, setUser] = useState<User | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);

  useEffect(() => {
    // 세션 스토리지에서 사용자 정보 가져오기
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Supabase 인증 상태 변경 이벤트 구독
    const authSubscription = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // 사용자가 로그인한 경우 상태 업데이트 및 세션 스토리지에 저장
          setUser(session.user);
          sessionStorage.setItem("user", JSON.stringify(session.user));
        } else if (event === "SIGNED_OUT") {
          // 사용자가 로그아웃한 경우 상태 초기화 및 세션 스토리지에서 사용자 정보 삭제
          setUser(null);
          sessionStorage.removeItem("user");
        }
      }
    );

    return () => {
      // 컴포넌트 언마운트 시 인증 상태 변경 이벤트 구독 해제
      authSubscription.data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // 사용자가 로그인한 경우 사용자 닉네임 설정 및 세션 스토리지에 저장
    if (user) {
      setUserNickname(
        user.user_metadata.user_name || user.user_metadata.full_name
      );
      if (user.email) {
        sessionStorage.setItem("userEmail", user.email);
      }

      sessionStorage.setItem(
        "userNickname",
        user.user_metadata.user_name || user.user_metadata.full_name
      );
    }
  }, [user]);

  const renderLoginButton = () => {
    if (user) {
      // 사용자가 로그인한 경우 로그아웃 링크를 표시
      return (
        <Link
          style={{
            color: "white",
            textDecoration: "none",
          }}
          to="/"
          onClick={async () => {
            await supabase.auth.signOut();
            setUser(null);
            setUserNickname(null); // 로그아웃 시 사용자 닉네임 초기화
            sessionStorage.removeItem("user"); // 로그아웃 시 사용자 정보 제거
            sessionStorage.removeItem("userNickname"); // 로그아웃 시 사용자 닉네임 제거
            sessionStorage.removeItem("userEmail"); // 로그아웃 시 사용자 이메일 제거
            alert("로그아웃 됐다~~~");
          }}
        >
          로그아웃
        </Link>
      );
    } else {
      return (
        <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
          로그인
        </Link>
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        paddingBottom: "90px",
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          position: "fixed",
          height: "30px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", // 수직 가운데 정렬을 위해 추가
          padding: "24px",
          backgroundColor: "#746464",
          color: "white",
          zIndex: 1000,
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "30px",
          }}
        >
          TailTales
        </Link>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center", // 수직 가운데 정렬을 위해 추가
          }}
        >
          {user && (userNickname || user?.user_metadata.full_name) ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginRight: "10px",
                }}
              >
                <img
                  src={
                    user?.user_metadata.avatar_url ||
                    process.env.PUBLIC_URL + "/image/profile.jpg" // 기본 이미지 경로
                  }
                  alt="User Avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <span>
                {userNickname ? (
                  <Link
                    to={`/mypage/${user.id}`}
                    style={{
                      color: "white",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    {userNickname}님
                  </Link>
                ) : (
                  `${user?.user_metadata.full_name}님`
                )}
                , 환영합니다!
              </span>
            </div>
          ) : null}
          <Link to="/home" style={{ color: "white", textDecoration: "none" }}>
            기다리는 친구들 |
          </Link>
          <Link
            to="/community"
            style={{ color: "white", textDecoration: "none" }}
          >
            커뮤니티 |
          </Link>
          {renderLoginButton()} {/* 이 위치에서 renderLoginButton 함수 호출 */}
        </div>
      </header>
      <div
        style={{
          paddingTop: "80px",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
