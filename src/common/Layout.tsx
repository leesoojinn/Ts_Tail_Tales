import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import { User } from "@supabase/supabase-js";
import styled from "styled-components";
import ScrollToTop from "../components/ScrollToTop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

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
      const nickname =
        parsedUser.user_metadata.user_name ||
        parsedUser.user_metadata.full_name;
      setUserNickname(nickname);
    }

    const authSubscription = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const parsedUser = session.user;
          setUser(parsedUser);
          sessionStorage.setItem("user", JSON.stringify(parsedUser));
          console.log("parsedUser", parsedUser);

          const nickname =
            parsedUser.user_metadata.user_name ||
            parsedUser.user_metadata.full_name;
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
          sessionStorage.removeItem("user_profile");
        }
      }
    );

    return () => {
      authSubscription.data.subscription.unsubscribe();
    };
  }, []);

  const shouldShowScrollToTop = location.pathname !== "/";

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
    <Wrap>
      {isHeaderVisible && (
        <Header>
          <LogoLink to="/">TailTales</LogoLink>
          <HeaderContent>
            {window.innerWidth < 850 ? (
              <MobileMenuButton
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <FontAwesomeIcon icon={showMobileMenu ? faTimes : faBars} />
              </MobileMenuButton>
            ) : (
              <>
                {user && userNickname && (
                  <>
                    <UserContainer>
                      <UserImage>
                        <img
                          src={
                            user?.user_metadata.avatar_url ||
                            user?.user_metadata.user_profile
                          }
                          alt="User Avatar"
                        />
                      </UserImage>
                    </UserContainer>
                    <UserName>
                      <NickName>
                        {userNickname}님, 환영합니다! &nbsp; &nbsp; &nbsp;
                      </NickName>
                      <span>
                        <Buttons to={`/mypage/${user.id}`}>
                          마이페이지&nbsp;
                        </Buttons>
                      </span>
                    </UserName>
                  </>
                )}
                <Buttons to="/home">기다리는 친구들&nbsp;</Buttons>
                <Buttons to="/community">커뮤니티 </Buttons>
                {user ? (
                  <LogoutButton
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
                  </LogoutButton>
                ) : (
                  <Buttons to="/login">로그인&nbsp;</Buttons>
                )}
              </>
            )}
          </HeaderContent>
        </Header>
      )}

      {showMobileMenu &&
        window.innerWidth < 850 && ( // 모바일 메뉴가 표시되고 화면이 850p 미만인 경우에만 SideMenu 표시
          <SideMenu onClick={() => setShowMobileMenu(false)}>
            <button className="xbtn" onClick={() => setShowMobileMenu(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>

            {user && userNickname && (
              <UserContainer>
                <UserImage>
                  <img
                    src={
                      user?.user_metadata.avatar_url ||
                      user?.user_metadata.user_profile
                    }
                    alt="User Avatar"
                  />
                </UserImage>
                <UserSideName className="username">
                  <div>{userNickname}님, 환영합니다!</div>
                </UserSideName>
              </UserContainer>
            )}
            {user && userNickname && (
              <MenuItem to={`/mypage/${user.id}`}>마이 페이지</MenuItem>
            )}
            <MenuItem to="/home">기다리는 친구들</MenuItem>
            <MenuItem to="/community">커뮤니티</MenuItem>
            <div>
              {user ? (
                <ButtonItem
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
                </ButtonItem>
              ) : (
                <MenuItem to="/login">로그인</MenuItem>
              )}
            </div>
          </SideMenu>
        )}

      <OutletWrap>
        <Outlet />
      </OutletWrap>
      {shouldShowScrollToTop && <ScrollToTop />}
    </Wrap>
  );
}

export default Layout;

const Header = styled.header`
  position: fixed;
  height: 32px;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background-color: transparent;
  color: white;
  z-index: 1000;
`;

const LogoLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2),
    1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2),
    1px 1px 0 rgba(0, 0, 0, 0.2);
`;

const HeaderContent = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2),
    1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2),
    1px 1px 0 rgba(0, 0, 0, 0.2);
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UserImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NickName = styled.span`
  color: #e9e9e9;
  font-weight: bold;
  font-size: 15px;
`;

const UserName = styled.span`
  color: white;
  font-weight: bold;
`;

const UserSideName = styled.span`
  font-size: 20px;
  transition: color 0.2s;
  color: #333;
`;

const Wrap = styled.header`
  min-height: 100vh;
  position: relative;
  padding-bottom: 90px;
  box-sizing: border-box;
`;

const OutletWrap = styled.div`
  padding-top: 80px;
`;

const Buttons = styled(Link)`
  text-decoration: none;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2),
    1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2),
    1px 1px 0 rgba(0, 0, 0, 0.2);

  &:hover {
    color: #007bff;
  }
`;

const LogoutButton = styled.button`
  color: white;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2),
    1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2),
    1px 1px 0 rgba(0, 0, 0, 0.2);
  font-family: "BMJUA-Regular";

  &:hover {
    color: #007bff;
  }
`;

const MobileMenuButton = styled.button`
  display: none; /* 초기에는 표시하지 않음 */

  @media (max-width: 850px) {
    display: block; /* 화면이 작을 때만 표시 */
    color: white;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
`;

const SideMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 70%;
  background-color: white;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  box-shadow: -2px 0px 5px 0px rgba(0, 0, 0, 0.3);

  button {
    align-self: flex-end;
    margin-right: 5px;
    font-size: 20px;
    border: none;
    background: none;
    cursor: pointer;
    color: #333;
  }
`;

const MenuItem = styled(Link)`
  margin-left: 9px;
  text-decoration: none;
  font-size: 20px;
  transition: color 0.2s;
  color: #333;

  &:hover {
    color: #007bff;
  }
`;

const ButtonItem = styled.button`
  font-size: 20px;
  transition: color 0.2s;
  color: #333;
  font-family: "BMJUA-Regular";

  &:hover {
    color: #007bff;
  }
`;
