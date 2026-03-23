import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function PostDetail({ user }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  
  const [views] = useState(() => {
    const currentView = parseInt(localStorage.getItem(`view_${id}`) || '0', 10);
    return currentView + 1;
  });

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');

  const mockTime = "2026-03-23 10:00";

  useEffect(() => {
    api.get(`/posts/${id}`).then((res) => setPost(res.data));
    api.get(`/posts/${id}/comments`).then((res) => setComments(res.data));
    localStorage.setItem(`view_${id}`, views);
  }, [id, views]);

  const toggleLike = () => {
    if (!user) return alert('로그인 상태여야만 가능합니다.');
    if (isLiked) { setLikes(likes - 1); setIsLiked(false); } 
    else { setLikes(likes + 1); setIsLiked(true); }
  };

  const toggleCommentLike = (commentId) => {
    if (!user) return alert('로그인 상태여야만 가능합니다.');
    setComments(comments.map(c => {
      if (c.id === commentId) {
        const currentlyLiked = c.isLiked || false;
        return { ...c, isLiked: !currentlyLiked, likes: (c.likes || 0) + (currentlyLiked ? -1 : 1) };
      }
      return c;
    }));
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!user) return alert('로그인이 필요합니다.');
    setComments([...comments, { id: Date.now(), name: user.nickname, body: newComment, likes: 0, isLiked: false }]);
    setNewComment('');
  };

  if (!post) return <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩 중...</div>;

  return (
    <div className="page-wrapper" style={{ backgroundColor: '#fff', padding: '5%', borderRadius: '8px', width: '100%' }}>
      
      {/* CSS 적용: 창 작아지면 제목과 버튼 그룹이 위아래로 나뉨 */}
      <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ddd', paddingBottom: '15px', marginBottom: '20px' }}>
        <h2 style={{ border: 'none', margin: 0, padding: 0, flex: 1, paddingRight: '15px' }}>{post.title}</h2>
        <div style={{ textAlign: 'right', color: '#666', fontSize: '0.9rem', flexShrink: 0 }}>
          <div>작성시간 : {mockTime}</div>
          {user && (
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Link to={`/edit/${id}`} className="action-btn" style={{ padding: '5px 10px' }}>수정</Link>
            </div>
          )}
        </div>
      </div>

      <div style={{ minHeight: '300px', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '40px', color: '#222' }}>
        {post.body}
      </div>
      
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
        <button onClick={toggleLike} className={`like-btn ${isLiked ? 'active' : ''}`}>
          {likes === 0 ? "👍좋아요" : `👍좋아요 ${likes}`}
        </button>
        <span style={{ color: '#666', fontWeight: 'bold' }}>조회수 : {views}</span>
      </div>

      <div style={{ borderTop: '1px solid #ddd', paddingTop: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>댓글</h3>
        
        {/* CSS 적용: 창 작아지면 세로 배열됨 */}
        <form className="input-group" onSubmit={handleComment} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={user ? "댓글을 입력하세요" : "로그인 후 댓글 작성 가능"} disabled={!user} style={{ margin: 0 }} />
          <button type="submit" disabled={!user} className="primary-btn" style={{ width: '100px', margin: 0 }}>전송</button>
        </form>

        <div style={{ width: '100%' }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px', marginBottom: '10px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                <strong>{comment.name}</strong>
                <button onClick={() => toggleCommentLike(comment.id)} className={`like-btn ${comment.isLiked ? 'active' : ''}`} style={{ padding: '3px 10px', fontSize: '0.8rem' }}>
                  {(comment.likes || 0) === 0 ? "👍좋아요" : `👍좋아요 ${comment.likes}`}
                </button>
              </div>
              <div style={{ color: '#222' }}>{comment.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}