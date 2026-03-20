import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ setUser }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ id: id, name: id, email: `${id}@test.com`, phone: '010-1234-5678' }); 
    navigate('/');
  };

  return (
    <div className="page-wrapper">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} required />
        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="primary-btn" style={{ marginTop: '10px' }}>로그인</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/signup" style={{ color: '#007bff', fontWeight: 'bold' }}>회원가입 하러가기</Link>
      </div>
    </div>
  );
}