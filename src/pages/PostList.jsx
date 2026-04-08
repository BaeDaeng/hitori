import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import UserModal from '../components/UserModal';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [popupUserId, setPopupUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/posts/all-post')
      .then((res) => {
        if (res.data.success) {
          setPosts(res.data.data); // 서버 포맷에 맞춰 데이터 추출
        }
      })
      .catch(console.error);
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
          // postId를 기준으로 로컬스토리지 조회수 불러오기
          const views = localStorage.getItem(`view_${post.postId}`) || 0;
          
          return (
            <div key={post.postId} className="post-item">
              <div className="post-item-top">
                <Link to={`/post/${post.postId}`} className="post-title">{post.title}</Link>
                {/* body 대신 postContent 사용 */}
                <div className="post-preview">{post.postContent}</div>
              </div>
              <div className="post-item-bottom">
                <div style={{ marginBottom: '5px' }}>
                  {/* userId 대신 writer(닉네임) 사용 */}
                  작성자: <span onClick={() => setPopupUserId(post.writer)} style={{ fontWeight: 'bold', color: '#0d6efd', cursor: 'pointer' }}>{post.writer}</span>
                </div>
                {/* 실제 서버 데이터의 likeCount와 comments.length를 연동 */}
                <div>조회수: {views} | 좋아요: {post.likeCount || 0} | 댓글: {post.comments ? post.comments.length : 0}</div>
              </div>
            </div>
          );
        })}
      </div>

      <UserModal userId={popupUserId} onClose={() => setPopupUserId(null)} />
    </div>
  );
}