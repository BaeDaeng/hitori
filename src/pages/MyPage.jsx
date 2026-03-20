import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyPage({ user, setUser }) {
  const [newName, setNewName] = useState(user.name);
  const navigate = useNavigate();

  const handleUpdate = () => {
    setUser({ ...user, name: newName });
    alert('회원 정보가 수정되었습니다.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말 탈퇴하시겠습니까? 데이터가 모두 삭제됩니다.')) {
      setUser(null);
      alert('탈퇴 처리되었습니다.');
      navigate('/');
    }
  };

  return (
    <div className="form-box">
      <h2>마이페이지</h2>
      <div className="form-group">
        <label style={{ fontSize: '14px', color: '#666' }}>아이디: {user.id}</label>
      </div>
      <div className="form-group">
        <input 
          type="text" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)} 
          placeholder="새 닉네임" 
        />
      </div>
      <button onClick={handleUpdate} className="form-submit-btn">정보 수정</button>
      <button onClick={handleDeleteAccount} className="withdraw-btn">회원 탈퇴</button>
    </div>
  );
}