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
    <div className="page-wrapper">
      {/* [경고 해결] 폼을 감싸는 박스에 'margin: 0 auto'를 추가하여 가로 중앙 정렬했습니다. */}
      <div style={{ width: '100%', maxWidth: '450px', backgroundColor: '#fff', padding: '40px 5%', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', border: 'none' }}>로그인</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} required />
          <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="primary-btn" style={{ marginTop: '10px' }}>로그인</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/signup" style={{ color: '#007bff', fontWeight: 'bold' }}>회원가입 하러가기</Link>
        </div>
      </div>
    </div>
  );
}