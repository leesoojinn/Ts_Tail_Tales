import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import Pagination from "../components/Pagination";

interface Comment {
  id: number;
  content: string;
  userNickname: string;
}

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  comments: Comment[];
}

export default function Community() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [posts, setPosts] = useState<Post[]>([]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);

  const fetchPosts = async () => {
    try {
      const { data: posts, error } = await supabase.from("posts").select("*").order("date", { ascending: false });

      if (error) {
        console.error("게시물 가져오기 오류:", error);
      } else {
        setPosts(posts);
      }
    } catch (error) {
      console.error("게시물 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const extractImages = (content: string): string[] => {
    const imgTags = content.match(/<img[^>]+src="([^">]+)"/g);
    if (imgTags) {
      return imgTags.map((tag) => {
        const match = tag.match(/src="([^">]+)"/);
        return match ? match[1] : "";
      });
    }
    return [];
  };

  const user = JSON.parse(sessionStorage.getItem("user") || "{}") as { email: string } | null;

  return (
    <>
      <Title>커뮤니티</Title>
      <Container>
        <PostsGrid>
          {currentPosts?.map((post) => (
            <PostBox key={post.id}>
              <Link to={`/post-detail/${post.id}`} style={{ textDecoration: "none" }}>
                <PostContent>
                  <ImgDiv>
                    {extractImages(post.content).length > 0 && (
                      <ImageContainer>
                        {extractImages(post.content)?.map((imgUrl, index) => (
                          <img src={imgUrl} alt={`Image ${index}`} key={index} />
                        ))}
                      </ImageContainer>
                    )}
                  </ImgDiv>
                  <PostTitle>{post.title}</PostTitle>
                  <div>{post.author}</div>
                </PostContent>
              </Link>
            </PostBox>
          ))}
        </PostsGrid>
        {user?.email && (
          <CreateButton to="/create">
            <CreateBtn className="fas fa-plus">작성하기</CreateBtn>
          </CreateButton>
        )}
      </Container>
      <PaginationContainer>
        <Pagination currentPage={currentPage} totalPages={Math.ceil(posts.length / itemsPerPage)} setCurrentPage={setCurrentPage} />
      </PaginationContainer>
    </>
  );
}

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 50px;
`;

const Container = styled.div`
  padding: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  margin: 0 auto;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
`;

const PostBox = styled.div`
  border: none;
  padding: 10px;
  padding-top: 20px; /* 상단 여백을 줄임 */
  margin-top: 10px;
  width: 100%; /* 이미지 박스의 가로 너비를 100%로 설정 */
  max-width: 300px; /* 최대 가로 너비를 지정하고, 화면 크기에 따라 조절됩니다. */
  display: flex;
  flex-direction: column; /* 포스트 내용을 세로로 정렬하기 위해 추가 */
  align-items: center;
  justify-content: center;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border-radius: 20px;
`;

const PostContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CreateButton = styled(Link)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 40px;
  background-color: #746464;
  color: white;
  border-radius: 40px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #dd3a3a;
    transform: scale(1.05);
  }
`;

const ImgDiv = styled.div`
  width: 300px;
  height: 200px;
`;

const PostTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: black;
`;

const ImageContainer = styled.div`
  max-width: 100%;
  height: 0;
  padding-bottom: ${(200 / 300) * 100}%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  & img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    object-fit: cover;
    border-radius: 10px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

const CreateBtn = styled.h2`
  font-size: 15px;
`;
