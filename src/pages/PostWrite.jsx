import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PostWrite({ user }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://jsonplaceholder.typicode.com/posts', {
      title, body, userId: user.id
    })
    .then((res) => {
      console.log('생성 완료 데이터:', res.data);
      alert('성공적으로 글이 작성되었습니다!');
      navigate('/');
    })
    .catch((err) => console.error('글쓰기 실패', err));
  };

  return (
    <div className="post-detail">
      <h2>새 글 작성</h2>
      <p style={{ marginBottom: '20px', fontSize: '14px' }}>작성자: <strong>{user.name}</strong></p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="내용을 입력하세요" value={body} onChange={(e) => setBody(e.target.value)} required rows="10" />
        <button type="submit" className="form-submit-btn">등록하기</button>
      </form>
    </div>
  );
}