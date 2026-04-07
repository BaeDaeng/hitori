import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function EditProfile({ user, setUser }) {
  // 1. 기본 정보 상태
  const [formData, setFormData] = useState({
    name: user?.name || '',
    nickname: user?.nickname || '',
    age: user?.age || ''
  });

  // 2. 비밀번호 변경 상태
  const [pwData, setPwData] = useState({
    password: '',
    newPassword: '',
    newPasswordConfirm: ''
  });

  // 🌟 변수명을 백엔드와 동일하게 profileImageUrl로 통일합니다.
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || null);
  
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawId, setWithdrawId] = useState('');
  
  const navigate = useNavigate();
  const fileInputRef = useRef();

  // 페이지 진입 시 최신 정보 불러오기
  useEffect(() => {
    api.get('/api/users/my-info')
      .then((res) => {
        if (res.data.success) {
          const myData = res.data.data;
          setFormData({
            name: myData.name || '',
            nickname: myData.nickname || '',
            age: myData.age || ''
          });
          // 🌟 백엔드 응답 필드명인 profileImageUrl에서 데이터를 가져옵니다.
          setProfileImageUrl(myData.profileImageUrl || null);
        }
      })
      .catch((error) => console.error("내 정보 불러오기 실패:", error));
  }, []);

  // S3 이미지 업로드 API 연동
  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await api.post('/api/s3/image-upload?pathName=PROFILE', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        // S3 업로드 성공 시 반환되는 URL을 상태에 저장
        setProfileImageUrl(res.data.data.imageUrl); 
        alert('프로필 이미지가 업로드되었습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  // 🌟 정보 수정 저장 (사진 주소 포함)
  const handleSave = async () => {
    try {
      // (1) 회원 정보 수정 API 호출 시 profileImageUrl을 반드시 포함합니다.
      const infoRes = await api.put('/api/users/update-info', {
        name: formData.name,
        nickname: formData.nickname,
        age: formData.age,
        profileImageUrl: profileImageUrl // 🌟 이 부분이 추가되어야 DB에 사진이 저장됩니다!
      });

      if (!infoRes.data.success) throw new Error('정보 수정 실패');

      // (2) 비밀번호 수정 로직 (입력된 경우에만)
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

      // 수정 성공 시 리액트 전역 상태 업데이트
      setUser({ ...user, ...formData, profileImageUrl });
      alert('정보가 성공적으로 수정되었습니다.');
      navigate('/mypage');

    } catch (error) {
      console.error(error);
      alert('정보 수정 중 오류가 발생했습니다.');
    }
  };

  // 회원 탈퇴
  const handleWithdraw = async () => {
    try {
      const res = await api.delete('/api/users/delete-user');
      if (res.data.success) {
        alert('탈퇴 처리되었습니다. 이용해 주셔서 감사합니다.');
        localStorage.removeItem('accessToken');
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert('탈퇴 처리 중 오류가 발생했습니다.\n(작성하신 게시물이나 댓글이 남아있어 탈퇴가 제한될 수 있습니다.)');
    }
  };

  return (
    <div style={{ display: 'block', width: '100%', padding: '50px 15px' }}>
      <div style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '600px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', border: 'none' }}>정보 수정</h2>
        
        {/* 프로필 이미지 */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#f8f9fa', border: '1px solid #ddd', margin: '0 auto 10px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>사진 변경</span>
            )}
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePicUpload} style={{ display: 'none' }} />
        </div>

        <label style={{ display: 'block', marginBottom: '5px' }}>이름</label>
        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />

        <label style={{ display: 'block', marginBottom: '5px' }}>닉네임</label>
        <input type="text" value={formData.nickname} onChange={(e) => setFormData({...formData, nickname: e.target.value})} />
        
        <label style={{ display: 'block', marginBottom: '5px' }}>생년월일 (YYYY-MM-DD)</label>
        <input type="text" placeholder="예: 2002-10-28" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />

        {/* 비밀번호 변경 영역 */}
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
              <p style={{ color: '#842029', fontWeight: 'bold', marginBottom: '15px' }}>탈퇴를 하면 기존 정보가 사라집니다. 정말 탈퇴하시겠습니까?<br/>확인을 위해 본인의 닉네임을 입력해주세요.</p>
              <input type="text" placeholder="본인 닉네임 입력" value={withdrawId} onChange={(e) => setWithdrawId(e.target.value)} style={{ marginBottom: '10px' }} />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => setShowWithdraw(false)} className="action-btn">취소</button>
                <button onClick={handleWithdraw} disabled={withdrawId !== formData.nickname} className="danger-btn">최종 탈퇴</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}