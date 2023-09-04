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
      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("date", { ascending: false });

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

  return (
    <>
      <Title>커뮤니티</Title>
      <Container>
        <PostsGrid>
          {currentPosts?.map((post) => (
            <PostBox key={post.id}>
              <Link
                to={`/post-detail/${post.id}`}
                style={{ textDecoration: "none" }}
              >
                <PostContent>
                  <ImgDiv>
                    {extractImages(post.content).length > 0 && (
                      <ImageContainer>
                        {extractImages(post.content)?.map((imgUrl, index) => (
                          <img
                            src={extractImages(post.content)[0]}
                            alt={`Image ${index}`}
                            key={index}
                          />
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
        <CreateButton to="/create">
          <h5 className="fas fa-plus">작성</h5>
        </CreateButton>
      </Container>
      <PaginationContainer>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(posts.length / itemsPerPage)}
          setCurrentPage={setCurrentPage}
        />
      </PaginationContainer>
    </>
  );
}

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const Container = styled.div`
  padding: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
`;

const PostBox = styled.div`
  border: none;
  padding: 10px;
  padding-top: 30px;
  margin-top: 10px;
  width: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
  overflow: hidden;
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
  height: 100px;
  background-color: #f8b3b3;
  color: white;
  border-radius: 50%;
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
  height: 250px;
`;

const PostTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: black;
`;

const ImageContainer = styled.div`
  max-width: 100%;
  height: 0;
  padding-bottom: ${(250 / 300) * 100}%;
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
  margin-top: 20px;
`;
