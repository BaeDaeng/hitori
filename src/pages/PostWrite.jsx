import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function PostWrite() {
  const [title, setTitle] = useState('');
  const [postContent, setPostContent] = useState(''); // body -> postContent로 변경
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🌟 게시글 생성 API 연동
      const res = await api.post('/api/posts/post-create', { 
        title: title, 
        postContent: postContent 
        // userId는 토큰으로 서버가 식별하므로 생략
      });

      if (res.data.success) {
        alert('등록되었습니다.');
        // 작성 완료 후 메인(또는 방금 쓴 글)으로 이동
        navigate('/'); 
      }
    } catch (error) {
      console.error(error);
      alert('게시글 작성에 실패했습니다.');
    }
  };

  return (
    <div style={{ display: 'block', width: '100%', padding: '50px 15px' }}>
      <div style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '800px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ borderBottom: '2px solid #dee2e6', paddingBottom: '15px', marginBottom: '20px' }}>새 글 작성</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="제목을 입력하세요" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            style={{ width: '100%', marginBottom: '15px' }} 
          />
          <textarea 
            placeholder="내용을 입력하세요" 
            value={postContent} 
            onChange={(e) => setPostContent(e.target.value)} 
            required 
            rows="15" 
            style={{ width: '100%', marginBottom: '15px', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }} 
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => navigate(-1)} className="action-btn" style={{ flex: 1 }}>취소</button>
            <button type="submit" className="primary-btn" style={{ flex: 2 }}>작성 완료</button>
          </div>
        </form>
      </div>
    </div>
  );
}