import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    pwConfirm: '',
    name: '',
    nickname: '',
    gender: 'MAN', 
    phone: '',
    age: ''
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

  // 🌟 완벽하게 정리된 회원가입 로직
  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.pwConfirm) return alert('비밀번호가 일치하지 않습니다.');
    if (!formData.age) return alert('생년월일을 입력해주세요.');

    let uploadedImageUrl = null;

    // [STEP 1] 이미지가 선택되었다면 회원가입 통신 전에 S3에 먼저 업로드하여 URL을 받아옵니다.
    if (selectedFile) {
      const uploadData = new FormData();
      uploadData.append('file', selectedFile);
      try {
        const s3Res = await api.post('/api/s3/image-upload?pathName=PROFILE', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (s3Res.data.success) {
          uploadedImageUrl = s3Res.data.data.imageUrl; // 서버에서 받은 실제 이미지 주소
        }
      } catch (err) {
        console.error("사진 업로드 에러:", err);
        return alert('프로필 사진 업로드에 실패했습니다. 다시 시도해주세요.'); // 사진 업로드 실패 시 가입 중단
      }
    }

    let isSignUpSuccess = false; 

    // [STEP 2] 획득한 사진 URL을 포함하여 완벽한 회원가입 시도
    try {
      const payload = {
        name: formData.name, 
        email: formData.email, 
        password: formData.password,
        nickname: formData.nickname, 
        age: formData.age, 
        gender: formData.gender, 
        phone: formData.phone
      };

      // 사진을 등록했다면 payload에 백엔드 명세 이름(profileImageUrl)으로 추가
      if (uploadedImageUrl) {
        payload.profileImageUrl = uploadedImageUrl;
      }

      const signUpRes = await api.post('/api/users/sign-up', payload);
      
      if (signUpRes.data.success) {
        isSignUpSuccess = true; // DB에 회원 정보 + 사진 주소까지 한 번에 저장 완료!
      }
    } catch (error) {
      console.error("가입 에러:", error);
      const serverMsg = error.response?.data?.message || '이미 가입된 정보가 있거나 입력 양식이 틀렸습니다.';
      return alert(`회원가입 실패: ${serverMsg}`);
    }

    // [STEP 3] 가입이 성공했다면 자동 로그인 진행
    if (isSignUpSuccess) {
      try {
        const loginRes = await api.post('/api/users/login', {
          email: formData.email,
          password: formData.password
        });

        if (loginRes.data.success) {
          localStorage.setItem('accessToken', loginRes.data.data.token);
          alert('회원가입이 완료되었습니다!');
          navigate('/'); 
        }
      } catch (error) {
        console.error("자동 로그인 실패:", error);
        alert('회원가입에 성공했습니다. 로그인 페이지로 이동합니다.');
        navigate('/login'); 
      }
    }
  };

  return (
    <div style={{ display: 'block', width: '100%', padding: '50px 15px' }}>
      <div style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '600px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', border: 'none' }}>회원가입</h2>
        <form onSubmit={handleSignup} style={{ width: '100%' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#f8f9fa', border: '1px solid #ddd', margin: '0 auto 10px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
              {previewPic ? <img src={previewPic} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>사진 등록</span>}
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePicSelect} style={{ display: 'none' }} />
          </div>

          <input type="email" name="email" placeholder="이메일 주소" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
          <input type="password" name="pwConfirm" placeholder="비밀번호 확인" value={formData.pwConfirm} onChange={handleChange} required />
          <input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} required />
          <input type="text" name="nickname" placeholder="닉네임" value={formData.nickname} onChange={handleChange} required />
          <input type="text" name="age" placeholder="생년월일 (YYYY-MM-DD)" value={formData.age} onChange={handleChange} required />

          <select name="gender" value={formData.gender} onChange={handleChange} style={{ marginBottom: '15px', width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}>
            <option value="MAN">남성</option>
            <option value="WOMAN">여성</option>
          </select>

          <input type="tel" name="phone" placeholder="전화번호 (010-0000-0000)" value={formData.phone} onChange={handleChange} required />

          <button type="submit" className="primary-btn" style={{ marginTop: '30px', padding: '15px', fontSize: '1.1rem' }}>회원가입 완료</button>
        </form>
      </div>
    </div>
  );
}