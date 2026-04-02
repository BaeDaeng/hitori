import axios from 'axios';

const api = axios.create({
  // 실제 백엔드 서버 주소로 변경
  baseURL: 'https://gaesipan.shop', 
  timeout: 5000,
});

// 🌟 핵심: 서버에 요청을 보내기 직전에 가로채서 헤더에 토큰을 몰래 넣어주는 역할
api.interceptors.request.use((config) => {
  // 로그인할 때 로컬 스토리지에 저장했던 토큰을 꺼내옵니다.
  const token = localStorage.getItem('accessToken');
  
  // 토큰이 있다면 요청 헤더에 'Bearer 토큰값' 형식으로 붙여서 보냅니다.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;