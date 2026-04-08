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

    api.get('/api/posts/all-post')
      .then(async (res) => {
        if (res.data.success) {
          const allPosts = res.data.data;

          // 1. 게시물 검색 (부분 일치)
          const filteredPosts = allPosts.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.postContent.toLowerCase().includes(query.toLowerCase())
          );
          setPostResults(filteredPosts);

          //  2. 사용자 검색 우회 로직 (부분 일치 & 본인 포함)
          // 2-1. 모든 게시글에서 작성자 닉네임만 추출 후 중복 제거
          const uniqueWriters = [...new Set(allPosts.map(post => post.writer))];

          // 2-2. 검색어가 닉네임에 일부분이라도 포함된 사람만 필터링
          const matchedWriters = uniqueWriters.filter(writer => 
            writer.toLowerCase().includes(query.toLowerCase())
          );

          // 2-3. 필터링된 유저들의 상세 프로필을 각각 요청
          const userPromises = matchedWriters.map(writer => 
            api.get(`/api/users/user-info/${writer}`)
              .then(response => {
                if (response.data.success) return response.data.data;
                return null;
              })
              .catch((error) => {
                console.error(`프로필 조회 실패 (${writer}):`, error);
                // 백엔드가 본인 조회를 막아서 에러가 나더라도 화면에 표시 (profileImageUrl로 수정)
                return { 
                  userId: writer, 
                  nickname: writer, 
                  name: '회원', 
                  profileImageUrl: null // 변수명 수정 완료!
                };
              })
          );

          // 모든 유저 정보 요청이 끝날 때까지 기다린 후 상태 업데이트
          const usersData = await Promise.all(userPromises);
          setUserResults(usersData.filter(user => user !== null));
        }
      })
      .catch((error) => console.error('검색 중 오류 발생:', error));

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
          placeholder="검색어를 입력하세요 (닉네임 일부만 입력해도 검색 가능)"
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
                key={user.userId || user.nickname} 
                onClick={() => setPopupUserId(user.nickname)}
                style={{ 
                  backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #dee2e6', 
                  textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' 
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#e9ecef', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd', overflow: 'hidden' }}>
                  {user.profileImageUrl ? <img src={user.profileImageUrl} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '사진'}
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