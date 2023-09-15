import { Link } from "react-router-dom";
import styled from "styled-components";

export const Header = styled.header`
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

export const LogoLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2), 1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2), 1px 1px 0 rgba(0, 0, 0, 0.2);
`;

export const HeaderContent = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2), 1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2), 1px 1px 0 rgba(0, 0, 0, 0.2);
`;

export const UserContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const UserImage = styled.div`
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

export const NickName = styled.span`
  color: #e9e9e9;
  font-weight: bold;
  font-size: 15px;
`;

export const UserName = styled.span`
  color: white;
  font-weight: bold;
`;

export const UserSideName = styled.span`
  font-size: 20px;
  transition: color 0.2s;
  color: #333;
`;

export const Wrap = styled.header`
  min-height: 100vh;
  position: relative;
  padding-bottom: 90px;
  box-sizing: border-box;
`;

export const OutletWrap = styled.div`
  padding-top: 80px;
`;

export const Buttons = styled(Link)`
  text-decoration: none;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2), 1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2), 1px 1px 0 rgba(0, 0, 0, 0.2);

  &:hover {
    color: #007bff;
  }
`;

export const LogoutButton = styled.button`
  color: white;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.2), 1px -1px 0 rgba(0, 0, 0, 0.2), -1px 1px 0 rgba(0, 0, 0, 0.2), 1px 1px 0 rgba(0, 0, 0, 0.2);
  font-family: "BMJUA-Regular";

  &:hover {
    color: #007bff;
  }
`;

export const MobileMenuButton = styled.button`
  display: none;

  @media (max-width: 850px) {
    display: block;
    color: white;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
`;

export const SideMenu = styled.div`
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

export const MenuItem = styled(Link)`
  margin-left: 9px;
  text-decoration: none;
  font-size: 20px;
  transition: color 0.2s;
  color: #333;

  &:hover {
    color: #007bff;
  }
`;

export const ButtonItem = styled.button`
  font-size: 20px;
  transition: color 0.2s;
  color: #333;
  font-family: "BMJUA-Regular";

  &:hover {
    color: #007bff;
  }
`;
