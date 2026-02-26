import ReactDOM from 'react-dom/client';
import { useEffect } from 'react';
import App from '@/App.tsx';
import '@/index.css';
import HotToast from '@/common/components/hot-toast';

const kakaoApiKey = String(import.meta.env.VITE_KAKAO_API_KEY || '').trim();
if (window.Kakao && kakaoApiKey && !window.Kakao.isInitialized()) {
  window.Kakao.init(kakaoApiKey);
}

function ScrollToTopOnReload() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return null;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <ScrollToTopOnReload />
    <App />
    <HotToast />
  </>,
);
