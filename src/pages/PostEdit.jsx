import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

// { user } props를 제거했습니다.
export default function PostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  useEffect(() => {
    api.get(`/api/posts/${id}`)
      .then((res) => {
        if (res.data.success) {
          setTitle(res.data.data.title);
          setPostContent(res.data.data.postContent);
        }
      })
      .catch((error) => {
        console.error(error);
        alert('게시글 정보를 불러오는데 실패했습니다.');
      });
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/api/posts/${id}`, { 
        title: title, 
        postContent: postContent 
      });

      if (res.data.success) {
        alert('수정되었습니다.');
        navigate(`/post/${id}`); 
      }
    } catch (error) {
      console.error(error);
      alert('게시글 수정에 실패했습니다.');
    }
  };

  return (
    <div style={{ display: 'block', width: '100%', padding: '50px 15px' }}>
      <div style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '800px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ borderBottom: '2px solid #dee2e6', paddingBottom: '15px', marginBottom: '20px' }}>내 글 수정하기</h2>
        <form onSubmit={handleEdit}>
          <input 
            type="text" 
            value={title} 
            readOnly 
            title="제목은 수정 불가능" 
            style={{ backgroundColor: '#e9ecef', color: '#6c757d', marginBottom: '15px', width: '100%' }} 
          />
          <textarea 
            value={postContent} 
            onChange={(e) => setPostContent(e.target.value)} 
            required 
            rows="15" 
            placeholder="내용을 입력하세요"
            style={{ width: '100%', marginBottom: '15px', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => navigate(-1)} className="action-btn" style={{ flex: 1 }}>취소</button>
            <button type="submit" className="primary-btn" style={{ flex: 2 }}>수정 완료</button>
          </div>
        </form>
      </div>
    </div>
  );
}