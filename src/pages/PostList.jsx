import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts?_limit=10')
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>게시글 목록</h2>
      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className="post-item">
            <Link to={`/post/${post.id}`} className="post-title">
              {post.id}. {post.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}