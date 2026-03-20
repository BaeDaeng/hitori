import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({ id: '', pw: '', pwConfirm: '', name: '', phone: '', email: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = (e) => {
    e.preventDefault();
    if (formData.pw !== formData.pwConfirm) return alert('비밀번호가 일치하지 않습니다.');
    alert('회원가입 완료! 로그인 해주세요.');
    navigate('/login');
  };

  return (
    <div className="page-wrapper">
      <h2>회원가입</h2>
      <form onSubmit={handleSignup}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" name="id" placeholder="아이디" value={formData.id} onChange={handleChange} required />
          <button type="button" className="action-btn" style={{ marginBottom: '15px', whiteSpace: 'nowrap' }}>중복 확인</button>
        </div>
        <input type="password" name="pw" placeholder="비밀번호" value={formData.pw} onChange={handleChange} required />
        <input type="password" name="pwConfirm" placeholder="비밀번호 확인" value={formData.pwConfirm} onChange={handleChange} required />
        <input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="전화번호" value={formData.phone} onChange={handleChange} required />
        <input type="email" name="email" placeholder="이메일" value={formData.email} onChange={handleChange} required />
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="button" onClick={() => navigate(-1)} className="action-btn" style={{ flex: 1 }}>취소</button>
          <button type="submit" className="primary-btn" style={{ flex: 2 }}>가입하기</button>
        </div>
      </form>
    </div>
  );
}