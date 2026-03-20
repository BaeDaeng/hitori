import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function MyPage({ user, setUser }) {
  const [newName, setNewName] = useState(user.name);
  const [myPosts, setMyPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/posts?userId=1').then((res) => setMyPosts(res.data)).catch(console.error);
  }, []);

  const handleUpdate = () => {
    setUser({ ...user, name: newName });
    alert('정보가 수정되었습니다.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말 탈퇴하시겠습니까?')) {
      setUser(null);
      navigate('/');
    }
  };

  return (
    <div className="page-wrapper" style={{ gap: '50px' }}>
      {/* 내 정보 수정 영역 */}
      <div>
        <h2>마이페이지 - 정보 수정</h2>
        <div style={{ marginBottom: '15px' }}><strong>아이디:</strong> {user.id}</div>
        <div style={{ marginBottom: '15px' }}><strong>이메일:</strong> {user.email}</div>
        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="새 닉네임" />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleDeleteAccount} className="danger-btn" style={{ flex: 1 }}>회원 탈퇴</button>
          <button onClick={handleUpdate} className="primary-btn" style={{ flex: 2 }}>수정 저장</button>
        </div>
      </div>

      {/* 내가 쓴 글 영역 */}
      <div>
        <h2>내가 쓴 글 (수정하기)</h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {myPosts.map((post) => (
            <div key={post.id} className="post-item">
              <Link to={`/post/${post.id}`} className="post-title" style={{ flex: 1 }}>{post.title}</Link>
              <Link to={`/edit/${post.id}`} className="action-btn">수정</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}