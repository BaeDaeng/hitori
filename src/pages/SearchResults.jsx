import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import UserModal from '../components/UserModal'; // 🌟 유저 모달 컴포넌트 추가

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [keyword, setKeyword] = useState(query);
  
  const [postResults, setPostResults] = useState([]); // 게시물 결과
  const [userResults, setUserResults] = useState([]); // 🌟 사용자 결과 추가
  
  const [popupUserId, setPopupUserId] = useState(null); // 팝업용 ID 상태
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) return;

    // 1. 게시물 검색 (제목에 키워드 포함 여부)
    api.get('/posts').then((res) => {
      const filteredPosts = res.data.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase())
      );
      setPostResults(filteredPosts);
    });

    // 2. 사용자 검색 (이름 또는 유저네임에 키워드 포함 여부)
    api.get('/users').then((res) => {
      const filteredUsers = res.data.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) || 
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setUserResults(filteredUsers);
    }).catch(() => {
      // API 오류 시 빈 배열 처리
      setUserResults([]);
    });
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/search?q=${keyword}`);
  };

  return (
    <div className="page-wrapper">
      {/* 상단 검색바 유지 */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input 
          type="text" 
          value={keyword} 
          onChange={(e) => setKeyword(e.target.value)} 
          placeholder="검색어를 입력하세요"
          style={{ margin: 0 }} 
        />
        <button type="submit" className="primary-btn" style={{ width: '100px', margin: 0 }}>검색</button>
      </form>

      <h2 style={{ marginBottom: '30px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        "{query}" 검색 결과
      </h2>

      {/* 🌟 1. 사용자 검색 결과 섹션 */}
      <div style={{ marginBottom: '50px' }}>
        <h3 style={{ marginBottom: '20px', color: '#495057' }}>사용자 ({userResults.length})</h3>
        {userResults.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {userResults.map(user => (
              <div 
                key={user.id} 
                onClick={() => setPopupUserId(user.id)} // 클릭 시 모달 오픈
                style={{ 
                  backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #dee2e6', 
                  textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' 
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#e9ecef', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd' }}>
                  사진
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0d6efd' }}>{user.username || `User${user.id}`}</div>
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
            const views = localStorage.getItem(`view_${post.id}`) || 0;
            return (
              <div key={post.id} className="post-item">
                <div className="post-item-top">
                  <Link to={`/post/${post.id}`} className="post-title">{post.title}</Link>
                  <div className="post-preview">{post.body}</div>
                </div>
                <div className="post-item-bottom">
                  <div style={{ marginBottom: '5px' }}>
                    작성자: <span onClick={() => setPopupUserId(post.userId)} style={{ fontWeight: 'bold', color: '#0d6efd', cursor: 'pointer' }}>User{post.userId}</span>
                  </div>
                  <div>조회수: {views} | 좋아요: 0 | 댓글: 0</div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ padding: '20px', color: '#868e96', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>일치하는 게시물이 없습니다.</div>
        )}
      </div>

      {/* 유저 클릭 시 상세 팝업 */}
      <UserModal userId={popupUserId} onClose={() => setPopupUserId(null)} />
    </div>
  );
}