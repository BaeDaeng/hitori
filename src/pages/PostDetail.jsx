import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function PostDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    api.get(`/posts/${id}`).then((res) => setPost(res.data));
    api.get(`/posts/${id}/comments`).then((res) => setComments(res.data));
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('삭제하시겠습니까?')) {
      api.delete(`/posts/${id}`).then(() => navigate('/'));
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!user) return alert('로그인이 필요합니다.');
    setComments([...comments, { id: Date.now(), name: user.name, body: newComment }]);
    setNewComment('');
  };

  if (!post) return <div>로딩 중...</div>;

  return (
    <div className="page-wrapper">
      {/* 헤더 (제목 및 버튼) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ border: 'none', margin: 0, padding: 0 }}>{post.title}</h2>
        {user && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to={`/edit/${id}`} className="action-btn">수정</Link>
            <button onClick={handleDelete} className="danger-btn">삭제</button>
          </div>
        )}
      </div>

      <div style={{ color: '#666', marginBottom: '20px' }}>작성자: User{post.userId}</div>
      
      {/* 내용 영역 */}
      <div className="post-content-box">{post.body}</div>
      
      {/* 좋아요 */}
      <div style={{ marginBottom: '40px' }}>
        <button onClick={() => setLikes(likes + 1)} className="like-btn">👍 좋아요 {likes}</button>
      </div>

      {/* 댓글 영역 */}
      <div>
        <h3 style={{ marginBottom: '15px' }}>댓글</h3>
        <form onSubmit={handleComment} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            type="text" 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
            placeholder={user ? "댓글을 입력하세요" : "로그인 후 댓글 작성 가능"} 
            disabled={!user}
            style={{ margin: 0 }}
          />
          <button type="submit" disabled={!user} className="primary-btn" style={{ width: '100px', padding: '15px 0' }}>전송</button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px' }}>
              <strong style={{ display: 'block', marginBottom: '5px' }}>{comment.name}</strong>
              <div>{comment.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}