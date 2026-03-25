import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function UserProfile() {
  const { id } = useParams(); // 주소창에서 유저 ID를 가져옴
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // 1. 유저 정보 불러오기 (가짜 API 특성상 없는 데이터는 가짜로 채워줌)
    api.get(`/users/${id}`).then((res) => {
      setProfileUser({
        id: res.data.id,
        name: res.data.name,
        nickname: res.data.username || `User${id}`,
        gender: id % 2 === 0 ? '여성' : '남성', // 성별 임시 설정
        email: res.data.email,
        profilePic: null,
      });
    }).catch(() => {
      // API에 유저가 없을 경우의 기본값
      setProfileUser({
        id: id,
        name: `회원 ${id}`,
        nickname: `User${id}`,
        gender: '비공개',
        email: `user${id}@example.com`,
        profilePic: null,
      });
    });

    // 2. 이 유저가 작성한 글 목록 불러오기
    api.get(`/posts?userId=${id}`).then((res) => setUserPosts(res.data));
  }, [id]);

  if (!profileUser) return <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩 중...</div>;

  return (
    <div style={{ display: 'block', width: '100%', padding: '50px 15px' }}>
      <div style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '800px' }}>
        
        {/* 상단: 프로필 정보 (수정/탈퇴 버튼 없음) */}
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
              <div><strong>성별:</strong> {profileUser.gender}</div>
              <div><strong>이메일:</strong> {profileUser.email}</div>
            </div>
          </div>
        </div>

        {/* 하단: 유저가 쓴 글 목록 (수정 버튼 없음, 보기만 가능) */}
        <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', color: '#212529', borderBottom: '2px solid #dee2e6', paddingBottom: '10px' }}>
            {profileUser.nickname}이(가) 쓴 글
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {userPosts.length > 0 ? (
              userPosts.map((post) => {
                const views = localStorage.getItem(`view_${post.id}`) || 0;
                return (
                  <Link to={`/post/${post.id}`} key={post.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="post-item" style={{ margin: 0, transition: 'background-color 0.2s', border: '1px solid #eee' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor='#f8f9fa'} onMouseOut={(e) => e.currentTarget.style.backgroundColor='#fff'}>
                      <div className="post-item-top">
                        <span className="post-title" style={{ color: '#0d6efd' }}>{post.title}</span>
                        <div className="post-preview">{post.body}</div>
                      </div>
                      <div className="post-item-bottom">
                        <div>조회수: {views} | 좋아요: 0 | 댓글: 0</div>
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