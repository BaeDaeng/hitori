import axios from 'axios';

const api = axios.create({
  // 실제 서버 API 주소로 변경
  baseURL: 'https://gaesipan.shop', 
  timeout: 5000,
  withCredentials: true, // 쿠키나 인증 헤더가 필요한 경우를 대비
});

// 요청 인터셉터: 로컬 스토리지에 토큰이 있다면 헤더에 추가 (필요 시)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;