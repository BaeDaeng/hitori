import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile({ user, setUser }) {
  const [formData, setFormData] = useState({ nickname: user.nickname, pw: user.pw, pwConfirm: user.pw, phone: user.phone });
  const [profilePic, setProfilePic] = useState(user.profilePic);
  
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawId, setWithdrawId] = useState('');
  
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (formData.pw !== formData.pwConfirm) return alert('비밀번호가 일치하지 않습니다.');
    setUser({ ...user, ...formData, profilePic });
    alert('정보가 수정되었습니다.');
    navigate('/mypage');
  };

  const handleWithdraw = () => {
    alert('탈퇴 처리되었습니다.');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="center-wrapper">
      <div className="center-box" style={{ maxWidth: '600px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', border: 'none' }}>정보 수정</h2>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#eee', margin: '0 auto 10px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
            {profilePic ? <img src={profilePic} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>사진 변경</span>}
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePicUpload} style={{ display: 'none' }} />
        </div>

        <label>닉네임</label>
        <input type="text" value={formData.nickname} onChange={(e) => setFormData({...formData, nickname: e.target.value})} />
        <label>새 비밀번호</label>
        <input type="password" value={formData.pw} onChange={(e) => setFormData({...formData, pw: e.target.value})} />
        <label>새 비밀번호 확인</label>
        <input type="password" value={formData.pwConfirm} onChange={(e) => setFormData({...formData, pwConfirm: e.target.value})} />
        <label>전화번호</label>
        <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />

        <button onClick={handleSave} className="primary-btn" style={{ marginTop: '20px' }}>적용</button>

        <div style={{ marginTop: '50px', borderTop: '1px solid #ddd', paddingTop: '20px', textAlign: 'center' }}>
          {!showWithdraw ? (
            <button onClick={() => setShowWithdraw(true)} className="danger-btn">회원탈퇴</button>
          ) : (
            <div style={{ backgroundColor: '#fff1f0', padding: '20px', borderRadius: '8px', border: '1px solid #ffa39e' }}>
              <p style={{ color: '#f5222d', fontWeight: 'bold', marginBottom: '15px' }}>탈퇴를 하면 기존 정보가 사라집니다. 정말 탈퇴하시겠습니까?<br/>탈퇴하시려면 본인의 아이디를 입력해주세요.</p>
              <input type="text" placeholder="본인 아이디 입력" value={withdrawId} onChange={(e) => setWithdrawId(e.target.value)} style={{ marginBottom: '10px' }} />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => setShowWithdraw(false)} className="action-btn">취소</button>
                <button onClick={handleWithdraw} disabled={withdrawId !== user.id} className="danger-btn">최종 탈퇴</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}