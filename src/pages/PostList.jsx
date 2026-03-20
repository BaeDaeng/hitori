import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/posts?_limit=10').then((res) => setPosts(res.data)).catch(console.error);
  }, []);

  return (
    <div className="page-wrapper">
      <h2>게시글 목록</h2>
      <div>
        {posts.map((post) => (
          <div key={post.id} className="post-item">
            <div style={{ flex: 1, paddingRight: '20px' }}>
              <Link to={`/post/${post.id}`} className="post-title">{post.title}</Link>
            </div>
            <div style={{ textAlign: 'right', fontSize: '13px', color: '#666', minWidth: '100px' }}>
              <div>작성자: User{post.userId}</div>
              <div>좋아요: {Math.floor(0)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}