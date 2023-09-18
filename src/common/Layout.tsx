import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import { User } from "@supabase/supabase-js";
import ScrollToTop from "../components/ScrollToTop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import * as S from "../styles/common/style.layout";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // 스크롤 이벤트를 처리하는 함수를 등록합니다.
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    // 스크롤 이벤트를 감지하여 'handleScroll' 함수를 호출합니다.
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 스크롤 위치에 따라 헤더의 표시 여부를 결정합니다.
  const isHeaderVisible = scrollY < 300;

  useEffect(() => {
    // sessionStorage에서 'user' 키로 저장된 사용자 정보를 가져옵니다.
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      // 저장된 사용자 정보가 있을 경우 파싱하여 상태로 설정합니다.
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // 사용자의 닉네임을 설정합니다. (user_name 또는 full_name 사용)
      const nickname =
        parsedUser.user_metadata?.user_name ||
        parsedUser.user_metadata?.full_name;
      setUserNickname(nickname);
    }

    // Supabase 인증 상태 변화를 구독하고, 상태에 따라 처리하는 함수를 정의합니다.
    const authSubscription = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // 사용자가 로그인한 경우, 세션 정보를 기반으로 사용자 상태를 업데이트합니다.
          const parsedUser = session.user;
          setUser(parsedUser);
          sessionStorage.setItem("user", JSON.stringify(parsedUser));

          // 사용자의 닉네임을 설정합니다. (user_name 또는 full_name 사용)
          const nickname =
            parsedUser.user_metadata?.user_name ||
            parsedUser.user_metadata?.full_name;
          setUserNickname(nickname);

          if (parsedUser.email) {
            sessionStorage.setItem("userEmail", parsedUser.email);
          }
          sessionStorage.setItem("userNickname", nickname);

          // SweetAlert를 사용하여 사용자에게 환영 메시지를 표시합니다.
          if (!sessionStorage.getItem("sweetalertShown")) {
            await Swal.fire({
              icon: "success",
              title: `환영합니다, ${nickname}님!`,
            });
            sessionStorage.setItem("sweetalertShown", "true");
          }
        } else if (event === "SIGNED_OUT") {
          // 사용자가 로그아웃한 경우, 사용자 상태를 초기화하고 sessionStorage에서 관련 정보를 삭제합니다.
          setUser(null);
          sessionStorage.removeItem("user");
          setUserNickname(null);
          sessionStorage.removeItem("userNickname");
          sessionStorage.removeItem("userEmail");
          sessionStorage.removeItem("sweetalertShown");
          sessionStorage.removeItem("userProfile");
        } else if (event === "USER_UPDATED" && session) {
          // 사용자 정보가 업데이트된 경우, 상태를 업데이트하고 sessionStorage를 갱신합니다.
          const parsedUser = session.user;
          setUser(parsedUser);
          sessionStorage.setItem("user", JSON.stringify(parsedUser));
        }
      }
    );
    // 컴포넌트가 언마운트되면 인증 상태 변화 구독을 해제합니다.
    return () => {
      authSubscription.data.subscription.unsubscribe();
    };
  }, []);

  // 스크롤 위치에 따라 'ScrollToTop' 버튼을 표시할지 여부를 결정합니다.
  const shouldShowScrollToTop =
    location.pathname !== "/" && location.pathname !== "/community";

  useEffect(() => {
    // 화면 크기 변경 이벤트를 감지하여 모바일 화면인지 여부에 따라 메뉴를 표시/숨김 처리합니다.

    const handleResize = () => {
      if (window.innerWidth < 850) {
        setShowMobileMenu(false);
      } else {
        setShowMobileMenu(true);
      }
    };
    // 초기 화면 크기에 따라 메뉴 표시/숨김 상태를 설정합니다.
    handleResize();

    // 화면 크기 변경 이벤트 리스너를 등록합니다.
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 언마운트되면 화면 크기 변경 이벤트 리스너를 제거합니다.
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <S.Wrap>
      {/* 헤더가 화면 상단에 보이는 경우에만 렌더링합니다. */}
      {isHeaderVisible && (
        <S.Header>
          <S.LogoLink to="/">TailTales</S.LogoLink>
          <S.HeaderContent>
            {/* 화면 너비에 따라 모바일 메뉴 버튼 또는 다른 메뉴들을 렌더링합니다. */}
            {window.innerWidth < 850 ? (
              <S.MobileMenuButton
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {/* 모바일 메뉴 아이콘을 렌더링합니다. */}
                <FontAwesomeIcon
                  icon={showMobileMenu ? faTimes : faBars}
                  style={{ color: "gray" }}
                />
              </S.MobileMenuButton>
            ) : (
              <>
                {/* 사용자 정보가 있고 유저 닉네임이 있는 경우에 메뉴를 렌더링합니다. */}
                {user && userNickname && (
                  <>
                    <S.UserContainer>
                      <S.UserImage>
                        {/* 사용자 아바타 이미지를 렌더링합니다. */}
                        <img
                          src={
                            user?.user_metadata.avatar_url ||
                            user?.user_metadata.user_profile
                          }
                          alt="User Avatar"
                        />
                      </S.UserImage>
                    </S.UserContainer>
                    <S.UserName>
                      <S.NickName>
                        {/* 사용자 닉네임 및 환영 메시지를 렌더링합니다. */}
                        {userNickname}님, 환영합니다! &nbsp; &nbsp; &nbsp;
                      </S.NickName>
                      <span>
                        {/* 마이페이지로 이동하는 버튼을 렌더링합니다. */}
                        <S.Buttons to={`/mypage/${user.id}`}>
                          마이페이지&nbsp;
                        </S.Buttons>
                      </span>
                    </S.UserName>
                  </>
                )}
                <S.Buttons to="/home">기다리는 친구들&nbsp;</S.Buttons>
                <S.Buttons to="/community">커뮤니티 </S.Buttons>
                {/* 사용자가 로그인한 경우 로그아웃 버튼을, 로그인하지 않은 경우 로그인 버튼을 렌더링합니다. */}
                {user ? (
                  <S.LogoutButton
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setUser(null);
                      setUserNickname(null);
                      Swal.fire({
                        title: "로그아웃",
                        text: "로그아웃이 완료되었습니다.",
                        icon: "success",
                      });
                      navigate("/");
                    }}
                  >
                    로그아웃&nbsp;
                  </S.LogoutButton>
                ) : (
                  <S.Buttons to="/login">로그인&nbsp;</S.Buttons>
                )}
              </>
            )}
          </S.HeaderContent>
        </S.Header>
      )}
      {/* 모바일 메뉴가 표시되고 화면 너비가 850 미만인 경우 모바일 메뉴를 렌더링합니다. */}
      {showMobileMenu && window.innerWidth < 850 && (
        <S.SideMenu onClick={() => setShowMobileMenu(false)}>
          <button className="xbtn" onClick={() => setShowMobileMenu(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>

          {user && userNickname && (
            <S.UserContainer>
              <S.UserImage>
                <img
                  src={
                    user?.user_metadata.avatar_url ||
                    user?.user_metadata.user_profile
                  }
                  alt="User Avatar"
                />
              </S.UserImage>
              <S.UserSideName className="username">
                <div>{userNickname}님, 환영합니다!</div>
              </S.UserSideName>
            </S.UserContainer>
          )}
          {user && userNickname && (
            <S.MenuItem to={`/mypage/${user.id}`}>마이 페이지</S.MenuItem>
          )}
          <S.MenuItem to="/home">기다리는 친구들</S.MenuItem>
          <S.MenuItem to="/community">커뮤니티</S.MenuItem>
          <div>
            {user ? (
              <S.ButtonItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                  setUserNickname(null);
                  Swal.fire({
                    title: "로그아웃",
                    text: "로그아웃이 완료되었습니다.",
                    icon: "success",
                  });
                  navigate("/");
                }}
              >
                로그아웃
              </S.ButtonItem>
            ) : (
              <S.MenuItem to="/login">로그인</S.MenuItem>
            )}
          </div>
        </S.SideMenu>
      )}
      <S.OutletWrap>
        {/* 라우터의 Outlet을 렌더링합니다. */}
        <Outlet />
      </S.OutletWrap>
      {/* 스크롤 맨 위로 이동하는 버튼을 표시할지 여부를 결정하여 렌더링합니다. */}
      {shouldShowScrollToTop && <ScrollToTop />}
    </S.Wrap>
  );
}

export default Layout;
