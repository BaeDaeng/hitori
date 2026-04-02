import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function UserProfile() {
  // 이제 URL 파라미터 'id'는 실제로는 유저의 닉네임(nickname/writer)을 의미합니다.
  const { id } = useParams(); 
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // 1. 유저 정보 불러오기 API 연동 (닉네임 기반)
    api.get(`/api/users/user-info/${id}`)
      .then((res) => {
        if (res.data.success) {
          setProfileUser(res.data.data);
        }
      })
      .catch((error) => {
        console.error(error); // ESLint 에러 방지
        // 에러 시 임시 처리 또는 빈 화면 방지
        setProfileUser({
          name: '알 수 없음',
          nickname: id,
          gender: '비공개',
          age: '비공개',
          profilePic: null,
        });
      });

    // 2. 이 유저가 작성한 글 목록 불러오기
    // 특정 유저의 글만 조회하는 API가 없으므로 전체 글을 가져와 프론트에서 필터링합니다.
    api.get('/api/posts/all-post')
      .then((res) => {
        if (res.data.success) {
          // 작성자(writer)가 현재 프로필 유저(id)와 일치하는 게시물만 필터링
          const filteredPosts = res.data.data.filter(post => post.writer === id);
          setUserPosts(filteredPosts);
        }
      })
      .catch((error) => console.error(error));
  }, [id]);

  if (!profileUser) return <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩 중...</div>;

  return (
    <div style={{ display: 'block', width: '100%', padding: '50px 15px' }}>
      <div style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '800px' }}>
        
        {/* 상단: 프로필 정보 */}
        <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '30px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#f8f9fa', border: '1px solid #ddd', overflow: 'hidden', flexShrink: 0, margin: '0 auto' }}>
            {profileUser.profilePic ? (
              <img src={profileUser.profilePic} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>사진 없음</span>
            )}
          </div>
          
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h2 style={{ borderBottom: '2px solid #dee2e6', paddingBottom: '15px', marginBottom: '20px', borderTop: 'none', textAlign: 'left' }}>
              {profileUser.nickname}님의 프로필
            </h2>
            <div style={{ fontSize: '1.1rem', lineHeight: '2', color: '#212529' }}>
              <div><strong>이름:</strong> {profileUser.name}</div>
              <div><strong>닉네임:</strong> {profileUser.nickname}</div>
              <div><strong>성별:</strong> {profileUser.gender === 'MAN' ? '남성' : profileUser.gender === 'WOMAN' ? '여성' : profileUser.gender}</div>
              {/* API 명세서에 맞춰 email 대신 age(생년월일)를 보여줍니다. */}
              <div><strong>생년월일:</strong> {profileUser.age || '비공개'}</div>
            </div>
          </div>
        </div>

        {/* 하단: 유저가 쓴 글 목록 */}
        <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', color: '#212529', borderBottom: '2px solid #dee2e6', paddingBottom: '10px' }}>
            {profileUser.nickname}이(가) 쓴 글 ({userPosts.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {userPosts.length > 0 ? (
              userPosts.map((post) => {
                const views = localStorage.getItem(`view_${post.postId}`) || 0;
                return (
                  // post.id -> post.postId로 변경
                  <Link to={`/post/${post.postId}`} key={post.postId} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="post-item" style={{ margin: 0, transition: 'background-color 0.2s', border: '1px solid #eee' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor='#f8f9fa'} onMouseOut={(e) => e.currentTarget.style.backgroundColor='#fff'}>
                      <div className="post-item-top">
                        <span className="post-title" style={{ color: '#0d6efd' }}>{post.title}</span>
                        {/* post.body -> post.postContent로 변경 */}
                        <div className="post-preview">{post.postContent}</div>
                      </div>
                      <div className="post-item-bottom">
                        {/* 서버 데이터의 likeCount와 comments 적용 */}
                        <div>조회수: {views} | 좋아요: {post.likeCount || 0} | 댓글: {post.comments ? post.comments.length : 0}</div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', color: '#6c757d', padding: '20px' }}>작성한 글이 없습니다.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}