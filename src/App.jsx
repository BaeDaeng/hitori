import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import PostWrite from './pages/PostWrite';
import PostEdit from './pages/PostEdit';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPage from './pages/MyPage';
import SearchResults from './pages/SearchResults'; // 신규
import EditProfile from './pages/EditProfile'; // 신규
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/" className="nav-logo">HOME</Link>
        <div className="nav-user">
          {user ? (
            <>
              <Link to="/write" className="nav-btn">새 글 쓰기</Link>
              <Link to="/mypage" className="nav-btn">마이페이지</Link>
              <button onClick={() => setUser(null)} className="logout-btn">로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn">로그인</Link>
              <Link to="/signup" className="nav-btn">회원가입</Link>
            </>
          )}
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/post/:id" element={<PostDetail user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mypage" element={user ? <MyPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/edit-profile" element={user ? <EditProfile user={user} setUser={setUser} /> : <Navigate to="/login" />} />
          <Route path="/write" element={user ? <PostWrite user={user} /> : <Navigate to="/login" />} />
          <Route path="/edit/:id" element={user ? <PostEdit user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}