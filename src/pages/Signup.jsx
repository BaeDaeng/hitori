import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '', password: '', pwConfirm: '', name: '', nickname: '', gender: 'MAN', phone: '', age: ''
  });
  const [previewPic, setPreviewPic] = useState(null); 
  const [selectedFile, setSelectedFile] = useState(null); 
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePicSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file); 
    setPreviewPic(URL.createObjectURL(file)); 
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.pwConfirm) return alert('비밀번호가 일치하지 않습니다.');
    if (!formData.age) return alert('생년월일을 입력해주세요.');

    try {
      const payload = new FormData();
      payload.append('email', formData.email);
      payload.append('password', formData.password);
      payload.append('name', formData.name);
      payload.append('nickname', formData.nickname);
      payload.append('age', formData.age); // type="date"라 YYYY-MM-DD로 정확히 들어감
      payload.append('gender', formData.gender);
      payload.append('phone', formData.phone);
      
      if (selectedFile) {
        payload.append('profileImage', selectedFile);
      }

      const res = await api.post('/api/users/sign-up', payload);

      if (res.data.success) {
        alert('회원가입이 완료되었습니다! 로그인해 주세요.');
        navigate('/login'); 
      }
    } catch (error) {
      console.error("가입 에러:", error);
      const serverMsg = error.response?.data?.message || '입력 정보를 확인해주세요.';
      alert(`가입 실패: ${serverMsg}`);
    }
  };

  return (
    <div className="center-page-wrapper">
       <div className="center-form-box" style={{ maxWidth: '600px', margin: '50px auto', padding: '40px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #dee2e6' }}>
         <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>회원가입</h2>
         <form onSubmit={handleSignup}>
           <div style={{ textAlign: 'center', marginBottom: '25px' }}>
             <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#f8f9fa', border: '1px solid #ddd', margin: '0 auto 10px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
               {previewPic ? <img src={previewPic} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>사진 등록</span>}
             </div>
             <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePicSelect} style={{ display: 'none' }} />
           </div>

           <input type="email" name="email" placeholder="이메일" onChange={handleChange} required style={{ width: '100%', marginBottom: '15px', padding: '10px' }} />
           <input type="password" name="password" placeholder="비밀번호" onChange={handleChange} required style={{ width: '100%', marginBottom: '15px', padding: '10px' }} />
           <input type="password" name="pwConfirm" placeholder="비밀번호 확인" onChange={handleChange} required style={{ width: '100%', marginBottom: '15px', padding: '10px' }} />
           <input type="text" name="name" placeholder="이름" onChange={handleChange} required style={{ width: '100%', marginBottom: '15px', padding: '10px' }} />
           <input type="text" name="nickname" placeholder="닉네임" onChange={handleChange} required style={{ width: '100%', marginBottom: '15px', padding: '10px' }} />
           
           {/* 생년월일 입력을 캘린더 형식(type="date")으로 변경하여 서버 양식 강제 맞춤 */}
           <input type="date" name="age" onChange={handleChange} required style={{ width: '100%', marginBottom: '15px', padding: '10px', fontFamily: 'inherit' }} />
           
           <select name="gender" onChange={handleChange} style={{ width: '100%', marginBottom: '15px', padding: '10px' }}>
             <option value="MAN">남성</option>
             <option value="WOMAN">여성</option>
           </select>
           
           <input type="tel" name="phone" placeholder="전화번호 (010-0000-0000)" onChange={handleChange} required style={{ width: '100%', marginBottom: '25px', padding: '10px' }} />
           
           <button type="submit" className="primary-btn" style={{ width: '100%', padding: '12px', fontSize: '1.1rem' }}>회원가입 완료</button>
         </form>
       </div>
    </div>
  );
}