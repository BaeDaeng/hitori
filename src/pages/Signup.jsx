import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    alert('회원가입 완료! 로그인 해주세요.');
    navigate('/login');
  };

  return (
    <div className="form-box">
      <h2>회원가입</h2>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <input type="text" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} required />
        </div>
        <div className="form-group">
          <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="form-submit-btn">가입하기</button>
      </form>
    </div>
  );
}