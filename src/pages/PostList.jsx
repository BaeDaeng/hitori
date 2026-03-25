import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = useState('');
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
                {/* 🌟 작성자 이름 클릭 시 프로필로 이동 */}
                <div style={{ marginBottom: '5px' }}>
                  작성자: <Link to={`/user/${post.userId}`} style={{ fontWeight: 'bold', color: '#0d6efd', cursor: 'pointer' }}>User{post.userId}</Link>
                </div>
                <div>조회수: {views} | 좋아요: {Math.floor(0)} | 댓글: {Math.floor(0)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}