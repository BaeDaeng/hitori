import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function PostEdit({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    api.get(`/posts/${id}`).then((res) => {
      setTitle(res.data.title);
      setBody(res.data.body);
    });
  }, [id]);

  const handleEdit = (e) => {
    e.preventDefault();
    api.put(`/posts/${id}`, { id, title, body, userId: user.id })
      .then(() => { alert('수정되었습니다.'); navigate(`/post/${id}`); });
  };

  return (
    <div style={{ display: 'block', width: '100%', padding: '50px 15px' }}>
      <div style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '800px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ borderBottom: '2px solid #dee2e6', paddingBottom: '15px', marginBottom: '20px' }}>내 글 수정하기</h2>
        <form onSubmit={handleEdit}>
          <input type="text" value={title} readOnly title="제목은 수정 불가능" style={{ backgroundColor: '#e9ecef', color: '#6c757d' }} />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} required rows="15" />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => navigate(-1)} className="action-btn" style={{ flex: 1 }}>취소</button>
            <button type="submit" className="primary-btn" style={{ flex: 2 }}>수정 완료</button>
          </div>
        </form>
      </div>
    </div>
  );
}