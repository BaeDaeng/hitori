import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import PostWrite from './pages/PostWrite';
import PostEdit from './pages/PostEdit';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPage from './pages/MyPage';
import SearchResults from './pages/SearchResults';
import EditProfile from './pages/EditProfile';
import UserProfile from './pages/UserProfile';
import api from './api'; // 🌟 API 호출을 위해 추가
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);

  // 🌟 새로고침 시 로그인 유지 (자동 로그인 로직)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // 토큰이 있으면 서버에 내 정보를 요청해서 상태를 복구함
      api.get('/api/users/my-info')
        .then(res => {
          if (res.data.success) {
            setUser(res.data.data);
          }
        })
        .catch((err) => {
          console.error('자동 로그인 실패:', err);
          // 토큰이 만료되었거나 유효하지 않으면 토큰 삭제
          localStorage.removeItem('accessToken');
        });
    }
  }, []);

  // 🌟 실제 로그아웃 처리
  const handleLogout = async () => {
    try {
      // 백엔드 로그아웃 API 호출 (명세에 따라 GET/POST 확인 필요, 일반적으로 POST)
      await api.post('/api/auths/logout'); 
    } catch (error) {
      console.error('로그아웃 API 호출 에러:', error);
    } finally {
      localStorage.removeItem('accessToken'); // 브라우저 토큰 삭제
      setUser(null); // 리액트 상태 초기화
      alert('로그아웃 되었습니다.');
    }
  };

  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/" className="nav-logo">HOME</Link>
        <div className="nav-user">
          {user ? (
            <>
              <Link to="/write" className="nav-btn">새 글 쓰기</Link>
              <Link to="/mypage" className="nav-btn">마이페이지</Link>
              {/* 🌟 기존 단순 setUser(null)에서 handleLogout 함수로 변경 */}
              <button onClick={handleLogout} className="logout-btn">로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn">로그인</Link>
              <Link to="/signup" className="nav-btn">회원가입</Link>
            </>
          )}
        </div>
      </nav>

      <div className="app-main-layout">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/post/:id" element={<PostDetail user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/mypage" element={user ? <MyPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/edit-profile" element={user ? <EditProfile /> : <Navigate to="/login" />} />
          
          {/* 🌟 PostWrite, PostEdit에서 불필요한 user props 제거 */}
          <Route path="/write" element={user ? <PostWrite /> : <Navigate to="/login" />} />
          <Route path="/edit/:id" element={user ? <PostEdit /> : <Navigate to="/login" />} />
          
          <Route path="/user/:id" element={<UserProfile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}