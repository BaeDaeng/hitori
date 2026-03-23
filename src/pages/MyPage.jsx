import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function MyPage({ user }) {
  const [myPosts, setMyPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/posts?userId=1').then((res) => setMyPosts(res.data));
  }, []);

  const handleEditClick = () => {
    const pw = window.prompt('정보를 수정하려면 비밀번호를 입력하세요.');
    if (pw === user.pw) navigate('/edit-profile');
    else if (pw !== null) alert('비밀번호가 일치하지 않습니다.');
  };

  return (
    <div className="page-wrapper" style={{ gap: '30px' }}>
      {/* CSS 적용: 창 작아지면 세로 정렬됨 */}
      <div className="responsive-flex" style={{ backgroundColor: '#fff', padding: '5%', borderRadius: '8px', display: 'flex', gap: '40px', width: '100%' }}>
        
        {/* 프로필 이미지 (모바일 가운데 정렬) */}
        <div className="responsive-img-container" style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden', flexShrink: 0 }}>
          {user.profilePic ? <img src={user.profilePic} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>사진 없음</span>}
        </div>
        
        {/* 내 정보 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ border: 'none', marginBottom: '20px', padding: 0 }}>내 정보</h2>
          <div style={{ fontSize: '1.1rem', lineHeight: '2', color: '#222', marginBottom: 'auto' }}>
            <div><strong>이름:</strong> {user.name}</div>
            <div><strong>닉네임:</strong> {user.nickname}</div>
            <div><strong>성별:</strong> {user.gender}</div>
            <div><strong>전화번호:</strong> {user.phone}</div>
            <div><strong>이메일:</strong> {user.email}</div>
          </div>
          <div style={{ alignSelf: 'flex-end', marginTop: '20px', width: '100%' }}>
            <button onClick={handleEditClick} className="action-btn" style={{ float: 'right' }}>정보수정</button>
          </div>
        </div>
      </div>

      <div style={{ width: '100%' }}>
        <h3 style={{ marginBottom: '20px' }}>내가 쓴 글</h3>
        <div style={{ width: '100%' }}>
          {myPosts.map((post) => {
            const views = localStorage.getItem(`view_${post.id}`) || 0;
            return (
              <div key={post.id} className="post-item" onClick={() => navigate(`/edit/${post.id}`)} style={{ cursor: 'pointer' }}>
                <div className="post-item-top">
                  <span className="post-title">{post.title}</span>
                  <div className="post-preview">{post.body}</div>
                </div>
                <div className="post-item-bottom">
                  <div>작성자: {user.nickname}</div>
                  <div>조회수: {views} | 좋아요 수: 0 | 댓글 수: 0</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}