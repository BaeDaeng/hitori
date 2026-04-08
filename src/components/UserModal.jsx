import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function UserModal({ userId, onClose }) {
  // 앞선 수정들로 인해 현재 userId 프롭스에는 숫자 ID가 아닌 '유저 닉네임'이 들어옵니다.
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    
    // 다른 사용자 정보 조회 API 연동 (닉네임 기반)
    api.get(`/api/users/user-info/${userId}`)
      .then(res => {
        if (res.data.success) {
          setUserInfo(res.data.data);
        }
      })
      .catch((error) => {
        console.error(error); // ESLint 에러 방지
        // API 통신 실패 시 넘어온 닉네임으로 기본값 세팅
        setUserInfo({ 
          nickname: userId, 
          name: '알 수 없는 유저',
          profileImageUrl: null
        });
      });
  }, [userId]);

  // 클릭된 userId(닉네임)가 없으면 팝업을 아예 화면에 그리지 않음
  if (!userId) return null;

  return (
    // 팝업 뒷배경 (어둡게 처리 & 클릭 시 팝업 닫힘)
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }} onClick={onClose}>
      
      {/* 팝업 하얀 박스 (클릭해도 안 닫히게 이벤트 막음) */}
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '320px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} onClick={(e) => e.stopPropagation()}>
        {userInfo ? (
          <>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f8f9fa', border: '1px solid #ddd', margin: '0 auto 15px', overflow: 'hidden' }}>
              {/* 🌟 렌더링 부분도 profileImageUrl 로 수정 */}
              {userInfo.profileImageUrl ? (
                <img src={userInfo.profileImageUrl} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '0.85rem' }}>사진</span>
              )}
            </div>
            
            <h3 style={{ margin: '0 0 5px 0', color: '#212529', fontSize: '1.2rem' }}>{userInfo.nickname}</h3>
            <p style={{ margin: '0 0 25px 0', color: '#6c757d', fontSize: '0.9rem' }}>{userInfo.name}</p>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={onClose} className="action-btn" style={{ flex: 1, padding: '10px' }}>닫기</button>
              <button 
                // 🌟 UserProfile 페이지가 닉네임을 받도록 수정되었으므로 nickname으로 넘김
                onClick={() => { onClose(); navigate(`/user/${userInfo.nickname}`); }} 
                className="primary-btn" 
                style={{ flex: 1, padding: '10px', fontSize: '1rem' }}
              >
                자세히 보기
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: '30px 0', color: '#6c757d' }}>정보를 불러오는 중...</div>
        )}
      </div>
    </div>
  );
}