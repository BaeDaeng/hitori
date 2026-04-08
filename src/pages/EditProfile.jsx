import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function EditProfile() {
  const [formData, setFormData] = useState({ name: '', nickname: '', age: '' });
  const [pwData, setPwData] = useState({ password: '', newPassword: '', newPasswordConfirm: '' });
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawId, setWithdrawId] = useState('');
  
  const navigate = useNavigate();
  const fileInputRef = useRef();

  useEffect(() => {
    api.get('/api/users/my-info')
      .then((res) => {
        if (res.data.success) {
          const d = res.data.data;
          const formattedAge = d.age ? d.age.split('T')[0] : '';
          
          setFormData({ 
            name: d.name || '', 
            nickname: d.nickname || '', 
            age: formattedAge 
          });
          setProfileImageUrl(d.profileImageUrl || null);
        }
      })
      .catch(console.error);
  }, []);

  const handlePicSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setProfileImageUrl(URL.createObjectURL(file)); 
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.nickname.trim()) {
      return alert('이름과 닉네임은 필수입니다.');
    }

    try {
      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('nickname', formData.nickname.trim());
      
      if (formData.age) {
        payload.append('age', formData.age);
      }

      if (selectedFile) {
        payload.append('profileImage', selectedFile);
      }

      const infoRes = await api.post('/api/users/update-info', payload);

      if (infoRes.data.success) {
        // 비밀번호가 입력되었을 때만 비밀번호 변경 API 호출
        if (pwData.newPassword) {
          if (pwData.newPassword !== pwData.newPasswordConfirm) return alert('새 비밀번호 불일치');
          await api.put('/api/users/update-pw', {
            password: pwData.password,
            newPassword: pwData.newPassword
          });
        }
        alert('정보가 수정되었습니다.');
        navigate('/mypage');
      }
    } catch (error) {
      console.error("수정 실패 상세:", error.response?.data);
      const msg = error.response?.data?.message || '입력 양식을 확인해주세요.';
      alert(`정보 수정 실패: ${msg}`);
    }
  };

  const handleWithdraw = async () => {
    try {
      const res = await api.delete('/api/users/delete-user');
      if (res.data.success) {
        alert('탈퇴 처리되었습니다.');
        localStorage.removeItem('accessToken');
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      console.error("탈퇴 처리 중 에러 발생:", error); 
      alert('탈퇴 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ display: 'block', width: '100%', padding: '50px 15px' }}>
      <div style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '600px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>정보 수정</h2>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#f8f9fa', border: '1px solid #ddd', margin: '0 auto 10px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
            {profileImageUrl ? <img src={profileImageUrl} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#999' }}>사진 변경</span>}
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePicSelect} style={{ display: 'none' }} />
        </div>

        <label style={{ display: 'block', marginTop: '10px' }}>이름</label>
        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        
        <label style={{ display: 'block', marginTop: '10px' }}>닉네임</label>
        <input type="text" value={formData.nickname} onChange={(e) => setFormData({...formData, nickname: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}/>
        
        <label style={{ display: 'block', marginTop: '10px' }}>생년월일</label>
        <input type="date" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', fontFamily: 'inherit' }} />

        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 15px 0' }}>비밀번호 변경</h4>
          <input type="password" placeholder="기존 비밀번호" onChange={(e) => setPwData({...pwData, password: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <input type="password" placeholder="새 비밀번호" onChange={(e) => setPwData({...pwData, newPassword: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <input type="password" placeholder="새 비밀번호 확인" onChange={(e) => setPwData({...pwData, newPasswordConfirm: e.target.value})} style={{ width: '100%', padding: '10px' }} />
        </div>

        <button onClick={handleSave} className="primary-btn" style={{ width: '100%', marginTop: '20px', padding: '12px' }}>적용</button>

        <div style={{ marginTop: '50px', borderTop: '1px solid #dee2e6', paddingTop: '20px', textAlign: 'center' }}>
          {!showWithdraw ? (
            <button onClick={() => setShowWithdraw(true)} className="danger-btn">회원탈퇴</button>
          ) : (
            <div style={{ backgroundColor: '#f8d7da', padding: '20px', borderRadius: '8px' }}>
              <p>본인 닉네임을 입력하여 탈퇴를 확인하세요.</p>
              <input type="text" value={withdrawId} onChange={(e) => setWithdrawId(e.target.value)} style={{ padding: '8px', marginBottom: '10px', width: '80%' }} />
              <div>
                <button onClick={handleWithdraw} disabled={withdrawId !== formData.nickname} className="danger-btn">최종 탈퇴</button>
                <button onClick={() => setShowWithdraw(false)} className="action-btn" style={{ marginLeft: '10px' }}>취소</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}