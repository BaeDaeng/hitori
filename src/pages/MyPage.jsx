import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function MyPage({ user }) {
  // 전역 user 정보 외에도, 서버에서 가장 최신 정보를 불러와 담을 상태
  const [myInfo, setMyInfo] = useState(user || {});
  const [myPosts, setMyPosts] = useState([]);
  const navigate = useNavigate();

  // src/pages/MyPage.jsx 의 useEffect 부분 수정
useEffect(() => {
  api.get('/api/users/my-info')
    .then((res) => {
      if (res.data.success) {
        // 🌟 콘솔에서 주소를 직접 확인합니다.
        console.log("받아온 프로필 주소:", res.data.data.profileImageUrl);
        setMyInfo(res.data.data);
      }
    })
    .catch(console.error);

    // 2. 내가 쓴 글 목록 불러오기 API 연동
    api.get('/api/posts/my-post')
      .then((res) => {
        if (res.data.success) {
          setMyPosts(res.data.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleEditClick = () => {
    // 백엔드 연동 시 프론트엔드는 기존 비밀번호를 평문으로 알 수 없으므로,
    // 바로 수정 페이지로 이동시킵니다. (인증은 토큰이 담당합니다)
    navigate('/edit-profile');
  };

  return (
    <div className="page-wrapper" style={{ gap: '30px' }}>
      {/* 내 정보 섹션 */}
      <div className="responsive-flex" style={{ backgroundColor: '#fff', padding: '5%', borderRadius: '8px', display: 'flex', gap: '40px', width: '100%' }}>
        
        {/* 프로필 이미지 */}
        <div className="responsive-img-container" style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden', flexShrink: 0 }}>
          {/* 🌟 profilePic -> profileImageUrl 로 변경! */}
          {myInfo.profileImageUrl ? (
            <img src={myInfo.profileImageUrl} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>사진 없음</span>
          )}
        </div>
        
        {/* 내 정보 상세 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ border: 'none', marginBottom: '20px', padding: 0 }}>내 정보</h2>
          <div style={{ fontSize: '1.1rem', lineHeight: '2', color: '#222', marginBottom: 'auto' }}>
            <div><strong>이름:</strong> {myInfo.name}</div>
            <div><strong>닉네임:</strong> {myInfo.nickname}</div>
            {/* 서버에서 MAN, WOMAN 등으로 올 경우 한글로 변환 */}
            <div><strong>성별:</strong> {myInfo.gender === 'MAN' ? '남성' : myInfo.gender === 'WOMAN' ? '여성' : myInfo.gender}</div>
            <div><strong>전화번호:</strong> {myInfo.phone}</div>
            <div><strong>이메일:</strong> {myInfo.email}</div>
            {/* 서버 명세에 있는 age(생년월일) 추가 */}
            <div><strong>생년월일:</strong> {myInfo.age}</div> 
          </div>
          <div style={{ alignSelf: 'flex-end', marginTop: '20px', width: '100%' }}>
            <button onClick={handleEditClick} className="action-btn" style={{ float: 'right' }}>정보수정</button>
          </div>
        </div>
      </div>

      {/* 내가 쓴 글 섹션 */}
      <div style={{ width: '100%' }}>
        <h3 style={{ marginBottom: '20px' }}>내가 쓴 글</h3>
        <div style={{ width: '100%' }}>
          {myPosts.length > 0 ? (
            myPosts.map((post) => {
              const views = localStorage.getItem(`view_${post.postId}`) || 0;
              return (
                // 기존 코드는 클릭 시 수정(/edit)으로 갔으나, 일반적인 형태인 상세조회(/post)로 가도록 변경했습니다.
                <div key={post.postId} className="post-item" onClick={() => navigate(`/post/${post.postId}`)} style={{ cursor: 'pointer' }}>
                  <div className="post-item-top">
                    {/* title, postContent 등 서버 변수명으로 변경 */}
                    <span className="post-title">{post.title}</span>
                    <div className="post-preview">{post.postContent}</div>
                  </div>
                  <div className="post-item-bottom">
                    <div>작성자: {post.writer}</div>
                    {/* 실제 서버 데이터의 좋아요 수와 댓글 수 연동 */}
                    <div>조회수: {views} | 좋아요 수: {post.likeCount || 0} | 댓글 수: {post.comments ? post.comments.length : 0}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff', color: '#888', borderRadius: '8px', border: '1px solid #ddd' }}>
              작성한 글이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}