import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function PostDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [postLikes, setPostLikes] = useState(0);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error(err));
      
    axios.get(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleDeletePost = () => {
    if (window.confirm('게시글을 삭제하시겠습니까?')) {
      axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then(() => {
          alert('삭제 완료!');
          navigate('/');
        })
        .catch((err) => console.error(err));
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!user) return alert('로그인이 필요합니다!');
    
    const commentData = {
      postId: id,
      name: user.name,
      body: newComment,
    };

    setComments([...comments, { ...commentData, id: Date.now() }]);
    setNewComment('');
  };

  if (!post) return <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩 중...</div>;

  return (
    <div className="post-detail">
      <div style={{ borderBottom: '1px solid #eee', marginBottom: '20px' }}>
        <h2 style={{ border: 'none', marginBottom: '10px' }}>{post.title}</h2>
        <p className="post-body">{post.body}</p>
        
        <div className="post-actions" style={{ paddingBottom: '20px' }}>
          <button onClick={() => setPostLikes(postLikes + 1)} className="like-btn">
            👍 좋아요 {postLikes}
          </button>
          
          {user && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
              <Link to={`/edit/${id}`} className="edit-btn">수정</Link>
              <button onClick={handleDeletePost} className="delete-btn">삭제</button>
            </div>
          )}
        </div>
      </div>

      <div className="comment-section">
        <h3>댓글 ({comments.length})</h3>
        
        <form onSubmit={handleAddComment} className="comment-form">
          <input 
            type="text" 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
            placeholder={user ? "댓글을 남겨보세요" : "로그인 후 댓글 작성 가능"} 
            disabled={!user}
            className="comment-input"
          />
          <button type="submit" disabled={!user} className="comment-submit-btn">등록</button>
        </form>

        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="comment-author">{comment.name}</div>
              <p className="comment-body">{comment.body}</p>
              <button onClick={() => alert('댓글 좋아요 구현 연습용 버튼입니다!')} className="comment-like-btn">
                👍 공감
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}