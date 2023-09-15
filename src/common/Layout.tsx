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

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isHeaderVisible = scrollY < 300;

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const nickname = parsedUser.user_metadata?.user_name || parsedUser.user_metadata?.full_name;
      setUserNickname(nickname);
    }

    const authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const parsedUser = session.user;
        setUser(parsedUser);
        sessionStorage.setItem("user", JSON.stringify(parsedUser));

        const nickname = parsedUser.user_metadata?.user_name || parsedUser.user_metadata?.full_name;
        setUserNickname(nickname);

        if (parsedUser.email) {
          sessionStorage.setItem("userEmail", parsedUser.email);
        }
        sessionStorage.setItem("userNickname", nickname);

        if (!sessionStorage.getItem("sweetalertShown")) {
          await Swal.fire({
            icon: "success",
            title: `환영합니다, ${nickname}님!`,
          });
          sessionStorage.setItem("sweetalertShown", "true");
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        sessionStorage.removeItem("user");
        setUserNickname(null);
        sessionStorage.removeItem("userNickname");
        sessionStorage.removeItem("userEmail");
        sessionStorage.removeItem("sweetalertShown");
        sessionStorage.removeItem("userProfile");
      } else if (event === "USER_UPDATED" && session) {
        const parsedUser = session.user;
        setUser(parsedUser);
        sessionStorage.setItem("user", JSON.stringify(parsedUser));
      }
    });

    return () => {
      authSubscription.data.subscription.unsubscribe();
    };
  }, []);

  const shouldShowScrollToTop = location.pathname !== "/" && location.pathname !== "/community";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 850) {
        setShowMobileMenu(false);
      } else {
        setShowMobileMenu(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <S.Wrap>
      {isHeaderVisible && (
        <S.Header>
          <S.LogoLink to="/">TailTales</S.LogoLink>
          <S.HeaderContent>
            {window.innerWidth < 850 ? (
              <S.MobileMenuButton onClick={() => setShowMobileMenu(!showMobileMenu)}>
                <FontAwesomeIcon icon={showMobileMenu ? faTimes : faBars} style={{ color: "gray" }} />
              </S.MobileMenuButton>
            ) : (
              <>
                {user && userNickname && (
                  <>
                    <S.UserContainer>
                      <S.UserImage>
                        <img src={user?.user_metadata.avatar_url || user?.user_metadata.user_profile} alt="User Avatar" />
                      </S.UserImage>
                    </S.UserContainer>
                    <S.UserName>
                      <S.NickName>{userNickname}님, 환영합니다! &nbsp; &nbsp; &nbsp;</S.NickName>
                      <span>
                        <S.Buttons to={`/mypage/${user.id}`}>마이페이지&nbsp;</S.Buttons>
                      </span>
                    </S.UserName>
                  </>
                )}
                <S.Buttons to="/home">기다리는 친구들&nbsp;</S.Buttons>
                <S.Buttons to="/community">커뮤니티 </S.Buttons>
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

      {showMobileMenu && window.innerWidth < 850 && (
        <S.SideMenu onClick={() => setShowMobileMenu(false)}>
          <button className="xbtn" onClick={() => setShowMobileMenu(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>

          {user && userNickname && (
            <S.UserContainer>
              <S.UserImage>
                <img src={user?.user_metadata.avatar_url || user?.user_metadata.user_profile} alt="User Avatar" />
              </S.UserImage>
              <S.UserSideName className="username">
                <div>{userNickname}님, 환영합니다!</div>
              </S.UserSideName>
            </S.UserContainer>
          )}
          {user && userNickname && <S.MenuItem to={`/mypage/${user.id}`}>마이 페이지</S.MenuItem>}
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
        <Outlet />
      </S.OutletWrap>
      {shouldShowScrollToTop && <ScrollToTop />}
    </S.Wrap>
  );
}

export default Layout;
