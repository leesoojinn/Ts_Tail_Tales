import { Avatar } from "antd";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

function MyProfile() {
  const [user, setUser] = useState<User | null>(null); // 사용자 정보를 저장하는 상태 변수
  const [Image, setImage] = useState<string | null>(null); // 사용자 프로필 이미지 URL을 저장하는 상태 변수

  useEffect(() => {
    // 컴포넌트가 마운트될 때 실행되는 부분
    const storedImage = sessionStorage.getItem("user"); // 세션 스토리지에서 사용자 정보를 가져옵니다.

    if (storedImage) {
      const parsedUser = JSON.parse(storedImage); // JSON 형식의 사용자 정보를 객체로 파싱합니다.
      setUser(parsedUser); // 파싱된 사용자 정보를 상태 변수에 설정합니다.
      const myProfile = parsedUser.user_metadata.user_profile; // 사용자 프로필 이미지 URL을 가져옵니다.
      setImage(myProfile); // 사용자 프로필 이미지 URL을 상태 변수에 설정합니다.
    }
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 설정합니다.

  return (
    <>
      <Avatar src={Image} size={200} />{" "}
      {/* Ant Design의 Avatar 컴포넌트를 사용하여 사용자 프로필 이미지를 표시합니다. */}
    </>
  );
}

export default MyProfile;
