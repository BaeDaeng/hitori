import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Signup() {
  // 🌟 API 명세의 Request body 구조와 동일하게 상태 설정
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    pwConfirm: '',
    name: '',
    nickname: '',
    gender: 'MAN', // MAN 또는 WOMAN
    phone: '',
    age: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🌟 S3 이미지 업로드 연동
  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file); // 스웨거 명세대로 'file' 이름 사용

    try {
      // 🌟 여기에 필수 파라미터인 ?pathName=PROFILE 을 추가했습니다!
      const res = await api.post('/api/s3/image-upload?pathName=PROFILE', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setProfilePic(res.data.data.imageUrl); // S3 URL 저장
        alert('프로필 이미지가 업로드되었습니다.'); // 성공 알림 (선택사항)
      }
    } catch (error) {
      console.error(error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  const handleCheckEmail = () => {
    if (!formData.email) return alert('이메일을 입력하세요.');
    // 현재 API 명세에 이메일 중복확인 기능이 없으므로 임시 메시지 처리
    alert('중복 확인 기능은 백엔드 API가 추가되면 연동할 수 있습니다.');
  };

  // 🌟 회원가입 API 연동
  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.pwConfirm) return alert('비밀번호가 일치하지 않습니다.');
    if (!formData.age) return alert('생년월일을 입력해주세요.');

    try {
      // 서버로 보낼 페이로드 (명세와 동일하게 구성)
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        age: formData.age,
        gender: formData.gender,
        phone: formData.phone
      };

      // 만약 백엔드 회원가입 DTO에 프로필 사진 필드가 추가된다면 아래처럼 전달됩니다.
      // if (profilePic) {
      //   payload.profilePic = profilePic;
      // }

      const res = await api.post('/api/users/sign-up', payload);

      if (res.data.success) {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      alert('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
    }
  };

  return (
    <div style={{ display: 'block', width: '100%', padding: '50px 15px' }}>
      <div style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '600px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', border: 'none' }}>회원가입</h2>
        <form onSubmit={handleSignup} style={{ width: '100%' }}>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#f8f9fa', border: '1px solid #ddd', margin: '0 auto 10px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
              {profilePic ? <img src={profilePic} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>사진 등록</span>}
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePicUpload} style={{ display: 'none' }} />
          </div>

          {/* 기존 아이디(id) 대신 로그인 명세에 맞는 이메일(email) 필드를 메인으로 사용 */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input type="email" name="email" placeholder="이메일 주소" value={formData.email} onChange={handleChange} required style={{ marginBottom: 0, flex: 1 }} />
            <button type="button" onClick={handleCheckEmail} className="action-btn" style={{ whiteSpace: 'nowrap' }}>중복 확인</button>
          </div>

          <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
          <input type="password" name="pwConfirm" placeholder="비밀번호 확인" value={formData.pwConfirm} onChange={handleChange} required />
          <input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} required />
          <input type="text" name="nickname" placeholder="닉네임" value={formData.nickname} onChange={handleChange} required />

          {/* 생년월일 추가 (date 대신 text 사용) */}
          <input
            type="text"
            name="age"
            placeholder="생년월일 (예: 2000-01-01)"
            value={formData.age}
            onChange={handleChange}
            required
          />

          {/* 성별 선택 (서버 전송 시 MAN, WOMAN으로 전송됨) */}
          <select name="gender" value={formData.gender} onChange={handleChange} style={{ marginBottom: '15px', width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}>
            <option value="MAN">남성</option>
            <option value="WOMAN">여성</option>
          </select>

          <input type="tel" name="phone" placeholder="전화번호 (ex: 010-1234-5678)" value={formData.phone} onChange={handleChange} required />

          <button type="submit" className="primary-btn" style={{ marginTop: '20px' }}>가입하기</button>
        </form>
      </div>
    </div>
  );
}