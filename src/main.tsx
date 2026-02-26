import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';
import '@/index.css';
import HotToast from '@/common/components/hot-toast';

const kakaoApiKey = String(import.meta.env.VITE_KAKAO_API_KEY || '').trim();
if (window.Kakao && kakaoApiKey && !window.Kakao.isInitialized()) {
  window.Kakao.init(kakaoApiKey);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <HotToast />
  </>,
);
