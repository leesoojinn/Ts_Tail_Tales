import { Routes, Route, Link } from "react-router-dom";
import Detail from "./pages/Detail";
import Login from "./pages/Login";
import Layout from "./common/Layout";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Mypage from "./pages/Mypage";
import Landing from "./pages/Landing";
import PostCreate from "./pages/PostCreate";
import PostEdit from "./pages/PostEdit";
import Community from "./pages/Community";
import PostDetail from "./pages/PostDetail";
import { FavoritesProvider } from "./components/FavoritesContext";

// animals={[]} loading={false} error={null} />}

function App() {
  return (
    <FavoritesProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/create" element={<PostCreate />} />
          <Route path="/post-edit/:id" element={<PostEdit />} />
          <Route path="/post-detail/:id" element={<PostDetail />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage/:id" element={<Mypage />} />
          <Route path="/community" element={<Community />} />
        </Route>

        <Route
          path="*"
          element={
            <>
              <div>없는 페이지입니다.</div>
              <Link to="/">홈으로 이동</Link>
            </>
          }
        />
      </Routes>
    </FavoritesProvider>
  );
}

export default App;
