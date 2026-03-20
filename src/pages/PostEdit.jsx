import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function PostEdit({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => {
        setTitle(res.data.title);
        setBody(res.data.body);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleEdit = (e) => {
    e.preventDefault();
    axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      id, title, body, userId: user.id
    })
    .then((res) => {
      console.log('수정 완료 데이터:', res.data);
      alert('수정이 완료되었습니다!');
      navigate(`/post/${id}`);
    })
    .catch((err) => console.error(err));
  };

  return (
    <div className="post-detail">
      <h2>글 수정하기</h2>
      <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} required rows="10" />
        <button type="submit" className="form-submit-btn">수정 완료</button>
      </form>
    </div>
  );
}