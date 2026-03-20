import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import PostWrite from './pages/PostWrite';
import PostEdit from './pages/PostEdit';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPage from './pages/MyPage';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      {/* 네비게이션 바 클래스 적용 */}
      <nav className="navbar">
        <Link to="/" className="nav-logo">게시판</Link>
        <div className="nav-links">
          <Link to="/">홈</Link>
          {user && <Link to="/write">새 글 쓰기</Link>}
          {user && <Link to="/mypage">마이페이지</Link>}
        </div>
        
        <div className="nav-user">
          {user ? (
            <>
              <span>{user.name}님</span>
              <button onClick={() => setUser(null)} className="logout-btn">로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login">로그인</Link>
              <Link to="/signup">회원가입</Link>
            </>
          )}
        </div>
      </nav>

      {/* 메인 컨테이너 클래스 적용 */}
      <div className="container">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post/:id" element={<PostDetail user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mypage" element={user ? <MyPage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
          <Route path="/write" element={user ? <PostWrite user={user} /> : <Navigate to="/login" />} />
          <Route path="/edit/:id" element={user ? <PostEdit user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}