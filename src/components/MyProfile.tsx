import { Avatar } from "antd";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

function MyProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [Image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const storedImage = sessionStorage.getItem("user");

    if (storedImage) {
      const parsedUser = JSON.parse(storedImage);
      setUser(parsedUser);
      const myProfile = parsedUser.user_metadata.user_profile;
      setImage(myProfile);
    }
  }, []);

  return (
    <>
      <Avatar src={Image} size={200} />
    </>
  );
}

export default MyProfile;
