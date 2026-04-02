import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function EditProfile({ user, setUser }) {
  // 1. 서버 API 명세에 맞춘 기본 정보 상태 (name, nickname, age)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    nickname: user?.nickname || '',
    age: user?.age || ''
  });

  // 2. 비밀번호 변경을 위한 별도 상태
  const [pwData, setPwData] = useState({
    password: '',
    newPassword: '',
    newPasswordConfirm: ''
  });

  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawId, setWithdrawId] = useState('');
  
  const navigate = useNavigate();
  const fileInputRef = useRef();

  // 🌟 S3 이미지 업로드 API 연동
  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file); // 스웨거 명세대로 'file' 이름 사용

    try {
      // 🌟 여기에 필수 파라미터인 ?pathName=PROFILE 을 추가했습니다!
      const res = await api.post('/api/s3/image-upload?pathName=PROFILE', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        setProfilePic(res.data.data.imageUrl); // S3 URL 저장
        alert('프로필 이미지가 업로드되었습니다.'); // 성공 알림 (선택사항)
      }
    } catch (error) {
      console.error(error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  // 🌟 회원정보 및 비밀번호 저장 API 연동
  const handleSave = async () => {
    try {
      // (1) 회원 정보 수정 API 호출
      const infoRes = await api.put('/api/users/update-info', {
        name: formData.name,
        nickname: formData.nickname,
        age: formData.age
      });

      if (!infoRes.data.success) throw new Error('정보 수정 실패');

      // (2) 새 비밀번호가 입력된 경우, 비밀번호 수정 API 호출
      if (pwData.newPassword) {
        if (pwData.newPassword !== pwData.newPasswordConfirm) {
          return alert('새 비밀번호가 일치하지 않습니다.');
        }
        if (!pwData.password) {
          return alert('기존 비밀번호를 입력해주세요.');
        }

        const pwRes = await api.put('/api/users/update-pw', {
          password: pwData.password,
          newPassword: pwData.newPassword
        });

        if (!pwRes.data.success) throw new Error('비밀번호 수정 실패');
      }

      // 수정이 모두 성공하면 프론트엔드 전역 user 상태도 업데이트
      setUser({ ...user, ...formData, profilePic });
      alert('정보가 성공적으로 수정되었습니다.');
      navigate('/mypage');

    } catch (error) {
      console.error(error);
      alert('정보 수정 중 오류가 발생했습니다.');
    }
  };

  // 🌟 회원 탈퇴 API 연동
  const handleWithdraw = async () => {
    try {
      const res = await api.delete('/api/users/delete-user');
      
      if (res.data.success) {
        alert('탈퇴 처리되었습니다. 이용해 주셔서 감사합니다.');
        localStorage.removeItem('accessToken'); // 브라우저에 저장된 토큰 삭제
        setUser(null); // 전역 유저 상태 초기화
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert('탈퇴 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ display: 'block', width: '100%', padding: '50px 15px' }}>
      <div style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '600px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', border: 'none' }}>정보 수정</h2>
        
        {/* 프로필 이미지 */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#f8f9fa', border: '1px solid #ddd', margin: '0 auto 10px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
            {profilePic ? <img src={profilePic} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>사진 변경</span>}
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePicUpload} style={{ display: 'none' }} />
        </div>

        {/* 기본 정보 수정 */}
        <label style={{ display: 'block', marginBottom: '5px' }}>이름</label>
        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />

        <label style={{ display: 'block', marginBottom: '5px' }}>닉네임</label>
        <input type="text" value={formData.nickname} onChange={(e) => setFormData({...formData, nickname: e.target.value})} />
        
        <label style={{ display: 'block', marginBottom: '5px' }}>생년월일 (YYYY-MM-DD)</label>
        <input type="text" placeholder="예: 2002-10-28" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />

        {/* 비밀번호 변경 영역 (구분을 위해 박스 처리) */}
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>비밀번호 변경 (변경 시에만 입력)</h4>
          
          <label style={{ display: 'block', marginBottom: '5px' }}>기존 비밀번호</label>
          <input type="password" value={pwData.password} onChange={(e) => setPwData({...pwData, password: e.target.value})} />
          
          <label style={{ display: 'block', marginBottom: '5px' }}>새 비밀번호</label>
          <input type="password" value={pwData.newPassword} onChange={(e) => setPwData({...pwData, newPassword: e.target.value})} />
          
          <label style={{ display: 'block', marginBottom: '5px' }}>새 비밀번호 확인</label>
          <input type="password" value={pwData.newPasswordConfirm} onChange={(e) => setPwData({...pwData, newPasswordConfirm: e.target.value})} />
        </div>

        <button onClick={handleSave} className="primary-btn" style={{ marginTop: '20px' }}>적용</button>

        {/* 회원 탈퇴 */}
        <div style={{ marginTop: '50px', borderTop: '1px solid #dee2e6', paddingTop: '20px', textAlign: 'center' }}>
          {!showWithdraw ? (
            <button onClick={() => setShowWithdraw(true)} className="danger-btn">회원탈퇴</button>
          ) : (
            <div style={{ backgroundColor: '#f8d7da', padding: '20px', borderRadius: '8px', border: '1px solid #f5c2c7' }}>
              <p style={{ color: '#842029', fontWeight: 'bold', marginBottom: '15px' }}>탈퇴를 하면 기존 정보가 사라집니다. 정말 탈퇴하시겠습니까?<br/>확인을 위해 본인의 <strong>닉네임</strong>을 입력해주세요.</p>
              <input type="text" placeholder="본인 닉네임 입력" value={withdrawId} onChange={(e) => setWithdrawId(e.target.value)} style={{ marginBottom: '10px' }} />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => setShowWithdraw(false)} className="action-btn">취소</button>
                {/* 닉네임을 정확히 입력해야만 탈퇴 버튼 활성화 */}
                <button onClick={handleWithdraw} disabled={withdrawId !== user.nickname} className="danger-btn">최종 탈퇴</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 