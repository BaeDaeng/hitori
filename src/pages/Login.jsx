import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ setUser }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({
      id: id,
      pw: password, 
      name: '임시이름', 
      nickname: '임시닉네임',
      gender: '남성', 
      phone: '010-1234-5678', 
      email: `${id}@test.com`, 
      profilePic: null
    });
    navigate('/');
  };

  return (
    <div className="page-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '450px', backgroundColor: '#fff', padding: '50px 5%', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', border: 'none', padding: 0, marginBottom: '30px' }}>로그인</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} required />
          <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="primary-btn" style={{ marginTop: '10px' }}>로그인</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <Link to="/signup" style={{ color: '#424242', fontWeight: 'bold' }}>회원가입</Link>
        </div>
      </div>
    </div>
  );
}