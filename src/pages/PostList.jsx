import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import UserModal from '../components/UserModal'; // 🌟 팝업 컴포넌트 불러오기

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [popupUserId, setPopupUserId] = useState(null); // 🌟 팝업에 띄울 유저 ID 상태
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/posts?_limit=15').then((res) => setPosts(res.data)).catch(console.error);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/search?q=${keyword}`);
  };

  return (
    <div className="page-wrapper">
      <form className="search-bar" onSubmit={handleSearch}>
        <input type="text" placeholder="게시물 제목 또는 작성자 이름 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ margin: 0 }} />
        <button type="submit" className="primary-btn" style={{ width: '100px', margin: 0 }}>검색</button>
      </form>

      <div>
        {posts.map((post) => {
          const views = localStorage.getItem(`view_${post.id}`) || 0;
          return (
            <div key={post.id} className="post-item">
              <div className="post-item-top">
                <Link to={`/post/${post.id}`} className="post-title">{post.title}</Link>
                <div className="post-preview">{post.body}</div>
              </div>
              <div className="post-item-bottom">
                <div style={{ marginBottom: '5px' }}>
                  {/* 🌟 팝업창 띄우기 이벤트 적용 */}
                  작성자: <span onClick={() => setPopupUserId(post.userId)} style={{ fontWeight: 'bold', color: '#0d6efd', cursor: 'pointer' }}>User{post.userId}</span>
                </div>
                <div>조회수: {views} | 좋아요: {Math.floor(0)} | 댓글: {Math.floor(0)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🌟 유저 팝업 모달 (popupUserId 값이 있을 때만 화면에 나옴) */}
      <UserModal userId={popupUserId} onClose={() => setPopupUserId(null)} />
    </div>
  );
}