import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import UserModal from '../components/UserModal';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [keyword, setKeyword] = useState(query);
  
  const [postResults, setPostResults] = useState([]); 
  const [userResults, setUserResults] = useState([]); 
  
  const [popupUserId, setPopupUserId] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) return;

    // 1. 게시물 검색
    api.get('/api/posts/all-post')
      .then((res) => {
        if (res.data.success) {
          const filteredPosts = res.data.data.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.postContent.toLowerCase().includes(query.toLowerCase())
          );
          setPostResults(filteredPosts);
        }
      })
      .catch((error) => console.error(error)); // 여기서도 만약을 위해 명시적으로 처리

    // 2. 사용자 검색
    api.get(`/api/users/user-info/${query}`)
      .then((res) => {
        if (res.data.success && res.data.data) {
          setUserResults([res.data.data]);
        } else {
          setUserResults([]);
        }
      })
      .catch((error) => {
        console.error(error); // 🌟 ESLint 에러 해결 (변수 사용)
        setUserResults([]);
      });
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/search?q=${keyword}`);
  };

  return (
    <div className="page-wrapper">
      <form className="search-bar" onSubmit={handleSearch}>
        <input 
          type="text" 
          value={keyword} 
          onChange={(e) => setKeyword(e.target.value)} 
          placeholder="검색어를 입력하세요 (유저 검색은 닉네임 정확히 입력)"
          style={{ margin: 0 }} 
        />
        <button type="submit" className="primary-btn" style={{ width: '100px', margin: 0 }}>검색</button>
      </form>

      <h2 style={{ marginBottom: '30px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        "{query}" 검색 결과
      </h2>

      {/* 1. 사용자 검색 결과 섹션 */}
      <div style={{ marginBottom: '50px' }}>
        <h3 style={{ marginBottom: '20px', color: '#495057' }}>사용자 ({userResults.length})</h3>
        {userResults.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {userResults.map(user => (
              <div 
                key={user.userId} 
                onClick={() => setPopupUserId(user.nickname)}
                style={{ 
                  backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #dee2e6', 
                  textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' 
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#e9ecef', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd', overflow: 'hidden' }}>
                  {user.profilePic ? <img src={user.profilePic} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '사진'}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0d6efd' }}>{user.nickname}</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>{user.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '20px', color: '#868e96', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>일치하는 사용자가 없습니다.</div>
        )}
      </div>

      {/* 2. 게시물 검색 결과 섹션 */}
      <div>
        <h3 style={{ marginBottom: '20px', color: '#495057' }}>게시물 ({postResults.length})</h3>
        {postResults.length > 0 ? (
          postResults.map((post) => {
            const views = localStorage.getItem(`view_${post.postId}`) || 0;
            return (
              <div key={post.postId} className="post-item">
                <div className="post-item-top">
                  <Link to={`/post/${post.postId}`} className="post-title">{post.title}</Link>
                  <div className="post-preview">{post.postContent}</div>
                </div>
                <div className="post-item-bottom">
                  <div style={{ marginBottom: '5px' }}>
                    작성자: <span onClick={() => setPopupUserId(post.writer)} style={{ fontWeight: 'bold', color: '#0d6efd', cursor: 'pointer' }}>{post.writer}</span>
                  </div>
                  <div>조회수: {views} | 좋아요: {post.likeCount || 0} | 댓글: {post.comments ? post.comments.length : 0}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ padding: '20px', color: '#868e96', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>일치하는 게시물이 없습니다.</div>
        )}
      </div>

      <UserModal userId={popupUserId} onClose={() => setPopupUserId(null)} />
    </div>
  );
}