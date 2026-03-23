import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [keyword, setKeyword] = useState(query);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/posts').then((res) => {
      const filtered = res.data.filter(post => 
        post.title.includes(query) || `User${post.userId}`.includes(query)
      );
      setResults(filtered);
    });
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/search?q=${keyword}`);
  };

  return (
    <div className="page-wrapper">
      <form className="search-bar" onSubmit={handleSearch}>
        <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ margin: 0 }} />
        <button type="submit" className="primary-btn" style={{ width: '100px', margin: 0 }}>검색</button>
      </form>

      <h3 style={{ marginBottom: '20px' }}>"{query}" 검색 결과 ({results.length}건)</h3>
      
      <div>
        {results.length > 0 ? results.map((post) => {
          const views = localStorage.getItem(`view_${post.id}`) || 0;
          return (
            <div key={post.id} className="post-item">
              <div className="post-item-top">
                <Link to={`/post/${post.id}`} className="post-title">{post.title}</Link>
                <div className="post-preview">{post.body}</div>
              </div>
              <div className="post-item-bottom">
                <div>작성자: User{post.userId}</div>
                <div>조회수: {views} | 좋아요 수: 0 | 댓글 수: 0</div>
              </div>
            </div>
          );
        }) : <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>검색 결과가 없습니다.</div>}
      </div>
    </div>
  );
}