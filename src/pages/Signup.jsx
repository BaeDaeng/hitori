import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({ id: '', pw: '', pwConfirm: '', name: '', nickname: '', gender: '남성', phone: '', email: '' });
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleCheckId = () => {
    if(!formData.id) return alert('아이디를 입력하세요.');
    alert('사용 가능한 아이디입니다.');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (formData.pw !== formData.pwConfirm) return alert('비밀번호가 일치하지 않습니다.');
    alert('회원가입 성공! 로그인 페이지로 돌아가서 로그인 해주세요');
    navigate('/login');
  };

  return (
    // 중앙 정렬 속성 추가
    <div className="page-wrapper" style={{ alignItems: 'center' }}>
      {/* 폼을 감싸는 하얀색 중앙 박스 (최대 너비 600px) */}
      <div style={{ width: '100%', maxWidth: '600px', backgroundColor: '#fff', padding: '40px 5%', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', border: 'none' }}>회원가입</h2>
        <form onSubmit={handleSignup} style={{ width: '100%' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#eee', margin: '0 auto 10px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
              {profilePic ? <img src={profilePic} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>사진 등록</span>}
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePicUpload} style={{ display: 'none' }} />
            <span style={{ fontSize: '0.85rem', color: '#888' }}>*프로필 사진 (선택)</span>
          </div>

          <div className="input-group" style={{ display: 'flex', gap: '10px' }}>
            <input type="text" name="id" placeholder="아이디" value={formData.id} onChange={handleChange} required style={{ marginBottom: 0 }} />
            <button type="button" onClick={handleCheckId} className="action-btn">중복 확인</button>
          </div>
          
          <input type="password" name="pw" placeholder="비밀번호" value={formData.pw} onChange={handleChange} required style={{ marginTop: '15px' }} />
          <input type="password" name="pwConfirm" placeholder="비밀번호 확인" value={formData.pwConfirm} onChange={handleChange} required />
          <input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} required />
          <input type="text" name="nickname" placeholder="닉네임" value={formData.nickname} onChange={handleChange} required />
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </select>
          <input type="tel" name="phone" placeholder="전화번호" value={formData.phone} onChange={handleChange} required />
          <input type="email" name="email" placeholder="이메일" value={formData.email} onChange={handleChange} required />
          
          <button type="submit" className="primary-btn" style={{ marginTop: '20px' }}>가입하기</button>
        </form>
      </div>
    </div>
  );
}