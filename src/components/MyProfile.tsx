import { Avatar } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import Swal from "sweetalert2";

export default function MyProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [Image, setImage] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    const storedImage = sessionStorage.getItem("user");

    if (storedImage) {
      const parsedUser = JSON.parse(storedImage);
      setUser(parsedUser);
      const myProfile = parsedUser.user_metadata.user_profile;
      setImage(myProfile);
      console.log("myProfile", myProfile);
    }
  }, []);

  const handleAvatarChange = async (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadAvatarToSupabase(file);
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  };

  const uploadAvatarToSupabase = async (imageFile: any) => {
    try {
      const uniqueName = `${Date.now()}_${imageFile.name}`;
      const { data, error } = await supabase.storage.from("image").upload(`profiles/${uniqueName}`, imageFile, {
        cacheControl: "3600",
      });

      if (error) {
        throw error;
      }

      const imageUrlObject = supabase.storage.from("image").getPublicUrl(`profiles/${uniqueName}`);

      if (imageUrlObject && imageUrlObject.data) {
        const imageUrl = imageUrlObject.data.publicUrl;
        setUserAvatar(imageUrl);

        sessionStorage.setItem("user_profile", imageUrl);
      } else {
        throw new Error("Failed to obtain the image URL");
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "이미지 업로드 중 오류 발생",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
      });
      throw error;
    }
  };

  return (
    <>
      <Avatar src={Image} style={{ margin: "20px" }} size={200} />
      <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInput} onChange={handleAvatarChange} />
      <button style={{ display: "block", margin: "0 auto" }}>프로필 설정</button>
    </>
  );
}
