import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { supabase } from "../supabase";
import { User } from "@supabase/supabase-js";

function Layout() {
  const [user, setUser] = useState<User | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
        sessionStorage.setItem("user", JSON.stringify(session.user));
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        sessionStorage.removeItem("user");
      }
    });

    return () => {
      authSubscription.data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      setUserNickname(user.user_metadata.user_name || user.user_metadata.full_name);
      if (user.email) {
        sessionStorage.setItem("userEmail", user.email);
      }

      sessionStorage.setItem("userNickname", user.user_metadata.user_name || user.user_metadata.full_name);
    }
  }, [user]);

  // renderLoginButton 함수 정의
  const renderLoginButton = () => {
    if (user) {
      return (
        <Link
          style={{
            color: "black",
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
        <Link to="/login" style={{ color: "black", textDecoration: "none" }}>
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
          backgroundColor: "#F8B3B3",
          color: "white",
          zIndex: 1000,
        }}
      >
        <Link to="/" style={{ color: "black", textDecoration: "none" }}>
          로고
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
                    user?.user_metadata.avatar_url || process.env.PUBLIC_URL + "/image/profile.jpg" // 기본 이미지 경로
                  }
                  alt="User Avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <span>
                {userNickname ? (
                  <Link to={`/mypage/${user.id}`} style={{ color: "black", textDecoration: "none" }}>
                    {userNickname}님
                  </Link>
                ) : (
                  `${user?.user_metadata.full_name}님`
                )}
                , 환영합니다!
              </span>
            </div>
          ) : null}
          <Link to="/home" style={{ color: "black", textDecoration: "none" }}>
            기다리는 친구들 |
          </Link>
          <Link to="/location" style={{ color: "black", textDecoration: "none" }}>
            location |
          </Link>
          <Link to="/community" style={{ color: "black", textDecoration: "none" }}>
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
