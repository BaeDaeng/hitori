import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ id: id, name: id }); 
    alert(`${id}님 로그인 성공!`);
    navigate('/');
  };

  return (
    <div className="form-box">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input type="text" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} required />
        </div>
        <div className="form-group">
          <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="form-submit-btn">로그인</button>
      </form>
    </div>
  );
}