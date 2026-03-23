import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function PostWrite({ user }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/posts', { title, body, userId: user.id })
      .then(() => { alert('등록되었습니다.'); navigate('/'); })
      .catch(console.error);
  };

  return (
    <div style={{ display: 'block', width: '100%', padding: '50px 15px' }}>
      <div style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '800px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ borderBottom: '2px solid #dee2e6', paddingBottom: '15px', marginBottom: '20px' }}>새 글 작성</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="내용을 입력하세요" value={body} onChange={(e) => setBody(e.target.value)} required rows="15" />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => navigate(-1)} className="action-btn" style={{ flex: 1 }}>취소</button>
            <button type="submit" className="primary-btn" style={{ flex: 2 }}>작성 완료</button>
          </div>
        </form>
      </div>
    </div>
  );
}