import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function UserModal({ userId, onClose }) {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    
    // 유저 간략 정보 불러오기 (가짜 API용 처리)
    api.get(`/users/${userId}`).then(res => {
      setUserInfo({ 
        id: userId, 
        nickname: res.data.username || `User${userId}`, 
        name: res.data.name 
      });
    }).catch(() => {
      setUserInfo({ id: userId, nickname: `User${userId}`, name: `회원 ${userId}` });
    });
  }, [userId]);

  // 클릭된 userId가 없으면 팝업을 아예 화면에 그리지 않음
  if (!userId) return null;

  return (
    // 팝업 뒷배경 (어둡게 처리 & 클릭 시 팝업 닫힘)
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }} onClick={onClose}>
      
      {/* 팝업 하얀 박스 (클릭해도 안 닫히게 이벤트 막음) */}
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '320px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} onClick={(e) => e.stopPropagation()}>
        {userInfo ? (
          <>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f8f9fa', border: '1px solid #ddd', margin: '0 auto 15px', overflow: 'hidden' }}>
              <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '0.85rem' }}>사진</span>
            </div>
            
            <h3 style={{ margin: '0 0 5px 0', color: '#212529', fontSize: '1.2rem' }}>{userInfo.nickname}</h3>
            <p style={{ margin: '0 0 25px 0', color: '#6c757d', fontSize: '0.9rem' }}>{userInfo.name}</p>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={onClose} className="action-btn" style={{ flex: 1, padding: '10px' }}>닫기</button>
              <button 
                onClick={() => { onClose(); navigate(`/user/${userInfo.id}`); }} 
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