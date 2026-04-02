import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import UserModal from '../components/UserModal';

export default function PostDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  
  const [views] = useState(() => {
    const currentView = parseInt(localStorage.getItem(`view_${id}`) || '0', 10);
    return currentView + 1;
  });

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [popupUserId, setPopupUserId] = useState(null); 

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentBody, setEditCommentBody] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  useEffect(() => {
    api.get(`/api/posts/${id}`)
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          setPost(data);
          setComments(data.comments || []);
          setLikes(data.likeCount || 0);
          setIsLiked(data.liked || false);
        }
      })
      .catch(console.error);
    
    localStorage.setItem(`view_${id}`, views);
  }, [id, views]);

  const toggleLike = async () => {
    if (!user) return alert('로그인 상태여야만 가능합니다.');
    try {
      if (isLiked) {
        await api.delete(`/api/postlike/${id}/like`);
        setLikes(likes - 1);
        setIsLiked(false);
      } else {
        await api.post(`/api/postlike/${id}/like`);
        setLikes(likes + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error(error); // ESLint 에러 해결
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('정말 게시글을 삭제하시겠습니까?')) {
      try {
        const res = await api.delete(`/api/posts/${id}`);
        if (res.data.success) {
          alert('게시글이 삭제되었습니다.');
          navigate('/');
        }
      } catch (error) {
        console.error(error); // ESLint 에러 해결
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  const toggleCommentLike = async (comment) => {
    if (!user) return alert('로그인 상태여야만 가능합니다.');
    try {
      if (comment.liked) {
        await api.delete(`/api/commentlike/${comment.commentId}/like`);
        setComments(comments.map(c => 
          c.commentId === comment.commentId ? { ...c, liked: false, likeCount: c.likeCount - 1 } : c
        ));
      } else {
        await api.post(`/api/commentlike/${comment.commentId}/like`);
        setComments(comments.map(c => 
          c.commentId === comment.commentId ? { ...c, liked: true, likeCount: c.likeCount + 1 } : c
        ));
      }
    } catch (error) {
      console.error(error); // ESLint 에러 해결
      alert('댓글 좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert('로그인이 필요합니다.');
    if (!newComment.trim()) return alert('댓글 내용을 입력하세요.');

    try {
      const res = await api.post(`/api/comments/${id}/comment`, {
        commentContent: newComment
      });
      if (res.data.success) {
        setComments([...comments, res.data.data]);
        setNewComment('');
      }
    } catch (error) {
      console.error(error); // ESLint 에러 해결
      alert('댓글 작성에 실패했습니다.');
    }
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditCommentBody(comment.commentContent);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditCommentBody('');
  };

  const saveEdit = async (commentId) => {
    if (!editCommentBody.trim()) return alert('댓글 내용을 입력해주세요.');
    try {
      const res = await api.put(`/api/comments/${commentId}`, { 
        commentContent: editCommentBody
      });
      if (res.data.success) {
        setComments(comments.map(c => 
          c.commentId === commentId ? { ...c, commentContent: editCommentBody, updatedAt: new Date().toISOString() } : c
        ));
        setEditingCommentId(null);
        setEditCommentBody('');
      }
    } catch (error) {
      console.error(error); // ESLint 에러 해결
      alert('댓글 수정에 실패했습니다.');
    }
  };

  const deleteComment = async (commentId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      try {
        const res = await api.delete(`/api/comments/${commentId}`);
        if (res.data.success) {
          setComments(comments.filter(c => c.commentId !== commentId));
        }
      } catch (error) {
        console.error(error); // ESLint 에러 해결
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  if (!post) return <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩 중...</div>;

  return (
    <div style={{ display: 'block', width: '100%', padding: '50px 15px' }}>
      <div style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '900px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        
        <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ddd', paddingBottom: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1, paddingRight: '15px' }}>
            <h2 style={{ border: 'none', margin: 0, padding: 0 }}>{post.title}</h2>
            <div style={{ marginTop: '10px', fontSize: '0.95rem', color: '#666' }}>
              작성자: <span onClick={() => setPopupUserId(post.writer)} style={{ fontWeight: 'bold', color: '#0d6efd', cursor: 'pointer' }}>{post.writer}</span>
            </div>
          </div>
          
          <div style={{ textAlign: 'right', color: '#666', fontSize: '0.9rem', flexShrink: 0 }}>
            <div>작성시간 : {formatDate(post.createdAt)}</div>
            {user && user.nickname === post.writer && (
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Link to={`/edit/${id}`} className="action-btn" style={{ padding: '5px 10px', fontSize: '0.85rem' }}>수정</Link>
                <button onClick={handleDeletePost} className="danger-btn" style={{ padding: '5px 10px', fontSize: '0.85rem' }}>삭제</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ minHeight: '300px', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '40px', color: '#222', whiteSpace: 'pre-wrap' }}>
          {post.postContent}
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
          <button onClick={toggleLike} className={`like-btn ${isLiked ? 'active' : ''}`}>
            {likes === 0 ? "👍좋아요" : `👍좋아요 ${likes}`}
          </button>
          <span style={{ color: '#666', fontWeight: 'bold' }}>조회수 : {views}</span>
        </div>

        <div style={{ borderTop: '1px solid #ddd', paddingTop: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>댓글 ({comments.length})</h3>
          <form className="input-group" onSubmit={handleComment} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={user ? "댓글을 입력하세요" : "로그인 후 댓글 작성 가능"} disabled={!user} style={{ margin: 0 }} />
            <button type="submit" disabled={!user} className="primary-btn" style={{ width: '100px', margin: 0 }}>전송</button>
          </form>

          <div style={{ width: '100%' }}>
            {comments.map((comment) => (
              <div key={comment.commentId} style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px', marginBottom: '10px', width: '100%', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span onClick={() => setPopupUserId(comment.writer)} style={{ color: '#0d6efd', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.05rem' }}>
                      {comment.writer}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#888' }}>
                      {comment.updatedAt && comment.updatedAt !== comment.createdAt 
                        ? `수정시간: ${formatDate(comment.updatedAt)}` 
                        : `작성시간: ${formatDate(comment.createdAt)}`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {user && user.nickname === comment.writer && editingCommentId !== comment.commentId && (
                      <>
                        <button onClick={() => startEditing(comment)} className="action-btn" style={{ padding: '3px 10px', fontSize: '0.8rem', backgroundColor: '#e9ecef', color: '#495057' }}>
                          수정
                        </button>
                        <button onClick={() => deleteComment(comment.commentId)} className="danger-btn" style={{ padding: '3px 10px', fontSize: '0.8rem' }}>
                          삭제
                        </button>
                      </>
                    )}
                    <button onClick={() => toggleCommentLike(comment)} className={`like-btn ${comment.liked ? 'active' : ''}`} style={{ padding: '3px 10px', fontSize: '0.8rem' }}>
                      {(comment.likeCount || 0) === 0 ? "👍좋아요" : `👍좋아요 ${comment.likeCount}`}
                    </button>
                  </div>
                </div>

                {editingCommentId === comment.commentId ? (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <input type="text" value={editCommentBody} onChange={(e) => setEditCommentBody(e.target.value)} style={{ flex: 1, margin: 0, padding: '10px' }} autoFocus />
                    <button onClick={() => saveEdit(comment.commentId)} className="primary-btn" style={{ width: '60px', padding: '10px 0', fontSize: '0.9rem' }}>저장</button>
                    <button onClick={cancelEditing} className="action-btn" style={{ width: '60px', padding: '10px 0', fontSize: '0.9rem' }}>취소</button>
                  </div>
                ) : (
                  <div style={{ color: '#222' }}>{comment.commentContent}</div>
                )}

              </div>
            ))}
          </div>
        </div>

      </div>
      <UserModal userId={popupUserId} onClose={() => setPopupUserId(null)} />
    </div>
  );
}