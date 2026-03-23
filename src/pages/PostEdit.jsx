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
    <div className="center-wrapper">
      <div className="center-box" style={{ maxWidth: '800px' }}>
        <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '15px', marginBottom: '20px' }}>내 글 수정하기</h2>
        <form onSubmit={handleEdit}>
          <input type="text" value={title} readOnly title="제목은 수정 불가능" style={{ backgroundColor: '#f0f0f0', color: '#888' }} />
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