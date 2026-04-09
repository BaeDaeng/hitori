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

    const fetchSearchResults = async () => {
      try {
        // 1. 게시물 데이터 불러오기 및 검색
        const postRes = await api.get('/api/posts/all-post');
        let allPosts = [];
        
        if (postRes.data.success) {
          allPosts = postRes.data.data;
          
          // 게시물 필터링 (부분 일치)
          const filteredPosts = allPosts.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.postContent.toLowerCase().includes(query.toLowerCase())
          );
          setPostResults(filteredPosts);
        }

        // 2. 사용자 검색 (기존 부분 일치 + API 정확도 일치 융합)
        
        // 2-1. 기존 방식: 모든 게시글에서 작성자 닉네임 추출
        const uniqueWriters = [...new Set(allPosts.map(post => post.writer))];

        // 2-2. 검색어가 닉네임에 일부분이라도 포함된 사람 필터링 (부분 검색 유지)
        const matchedWriters = uniqueWriters.filter(writer => 
          writer.toLowerCase().includes(query.toLowerCase())
        );

        // 2-3. 핵심 추가 로직: 게시글을 한 번도 안 쓴 사람을 찾기 위해 '정확한 검색어'를 탐색 명단에 억지로 추가
        // (이미 부분 검색으로 들어간 사람은 제외)
        const exactMatchExists = matchedWriters.some(w => w.toLowerCase() === query.toLowerCase());
        if (!exactMatchExists) {
          matchedWriters.push(query);
        }

        // 2-4. 수집된 닉네임들(부분일치 + 정확한검색어)의 프로필을 API로 일괄 요청
        const userPromises = matchedWriters.map(writer => 
          api.get(`/api/users/user-info/${writer}`)
            .then(response => {
              if (response.data.success) return response.data.data;
              return null;
            })
            .catch(() => {
              // [에러 처리 분기]
              // 1. 게시글을 쓴 적이 확실한 유저라면? (본인 조회 차단 에러일 수 있으므로 강제 표시)
              if (uniqueWriters.includes(writer)) {
                return { 
                  userId: writer, 
                  nickname: writer, 
                  name: '회원', 
                  profileImageUrl: null 
                };
              }
              // 2. 게시글을 쓴 적도 없고, 검색어로만 찔러본 경우라면? (진짜로 회원가입 안 한 사람임)
              return null; 
            })
        );

        // 모든 유저 정보 요청이 끝날 때까지 기다린 후 null(없는 유저)을 필터링하고 세팅
        const usersData = await Promise.all(userPromises);
        setUserResults(usersData.filter(user => user !== null));

      } catch (error) {
        console.error('검색 중 오류 발생:', error);
      }
    };

    fetchSearchResults();
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
                  <div>조회수: {views} | 좋아요: {post.likeCount || 0}</div>
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