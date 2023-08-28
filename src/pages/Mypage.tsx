import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

interface FavoritePost {
  animalId: string;
}

export default function Mypage() {
  const [favoritePosts, setFavoritePosts] = useState<FavoritePost[]>([]);
  const [favoriteData, setFavoriteData] = useState<any[]>([]); // Change this type according to the data structure

  useEffect(() => {
    async function fetchFavoritePosts() {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("Error getting user:", userError);
          return;
        }

        const user = userData?.user;
        const userId = user?.id;

        if (!userId) {
          console.error("User ID not found.");
          return;
        }

        const { data, error } = await supabase
          .from("favorites")
          .select("animalId")
          .eq("userId", userId);
        console.log("data", data);

        if (error) {
          console.error("Error fetching favorite posts:", error);
          return;
        }

        setFavoritePosts(data || []);
      } catch (error) {
        console.error("Error fetching favorite posts:", error);
      }
    }

    fetchFavoritePosts();
  }, []);

  return (
    <div>
      <h2>즐겨찾기 목록</h2>
      <div>
        {favoriteData.length === 0 ? (
          <p>즐겨찾기한 게시물이 없습니다.</p>
        ) : (
          favoriteData?.map((data) => (
            <div key={data.animalId}>{data.animalId}</div>
          ))
        )}
      </div>
    </div>
  );
}
