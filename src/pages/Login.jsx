import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ setUser }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ id: id, pw: password, name: '배재훈', nickname: 'Jaehoon', gender: '남성', phone: '010-1234-5678', email: `${id}@test.com`, profilePic: null }); 
    navigate('/');
  };

  return (
    /* 🚨 100% 무조건 가운데로 보내는 절대 스타일 (margin: '0 auto' 직접 주입) */
    <div style={{ display: 'block', width: '100%', padding: '50px 15px' }}>
      <div style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '450px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', border: 'none' }}>로그인</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} required />
          <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="primary-btn" style={{ marginTop: '10px' }}>로그인</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/signup" style={{ color: '#0d6efd', fontWeight: 'bold' }}>회원가입 하러가기</Link>
        </div>
      </div>
    </div>
  );
}