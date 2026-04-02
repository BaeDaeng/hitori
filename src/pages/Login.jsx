import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api'; // 수정된 api 불러오기

export default function Login({ setUser }) {
  const [email, setEmail] = useState(''); // id 대신 email 사용
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. 실제 로그인 API 호출
      const res = await api.post('/api/auths/login', { 
        email: email, 
        password: password 
      });
      
      // 2. 응답이 성공적이면 (success: true)
      if (res.data.success) {
        const userData = res.data.data; // 안쪽 data 객체 꺼내기
        
        // 3. 토큰을 브라우저에 저장
        localStorage.setItem('accessToken', userData.accessToken);
        
        // 4. 리액트 전역 상태(user) 업데이트
        setUser({
          userId: userData.userId,
          name: userData.name,
          nickname: userData.nickname
        });
        
        alert('로그인되었습니다.');
        navigate('/'); // 메인 화면으로 이동
      }
    } catch (error) {
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'block', width: '100%', padding: '50px 15px' }}>
      <div className="center-form-box" style={{ maxWidth: '450px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', border: 'none' }}>로그인</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
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