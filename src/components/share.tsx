import { copy } from '@/lib/copy';
import { URL as SITE_URL } from '@/lib/utils';
import { Link } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/common/components/ui/button';
import {
  BANNERIMAGE,
  BRIDE_NAME,
  GROOM_NAME,
  WEDDING_DATE,
  WEDDING_LOCATION,
  WEDDING_LOCATION_NAME,
  WEDDING_TIME,
} from '../../config';

const DEFAULT_SHARE_URL = 'https://wedding-invitation-two-alpha.vercel.app/';
const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
const KAKAO_SDK_INTEGRITY =
  'sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka';
const SHARE_IMAGE_VERSION = String(
  import.meta.env.VITE_SHARE_IMAGE_VERSION || '20260226-1',
).trim();

function normalizeShareUrl(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

function appendCacheBuster(url: string, version: string): string {
  if (!version) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${encodeURIComponent(version)}`;
}

async function ensureKakaoSdkLoaded(): Promise<void> {
  if (window.Kakao?.Share) return;

  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"]',
  );

  if (existingScript) {
    await new Promise<void>((resolve, reject) => {
      if (window.Kakao?.Share) {
        resolve();
        return;
      }

      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Kakao SDK script failed to load')),
        { once: true },
      );
    });
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = KAKAO_SDK_URL;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.integrity = KAKAO_SDK_INTEGRITY;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Kakao SDK script failed to load'));
    document.head.appendChild(script);
  });
}

export default function Share() {
  const kakaoShareUrl = normalizeShareUrl(
    import.meta.env.VITE_PUBLIC_SITE_URL || DEFAULT_SHARE_URL,
  );

  const onCopy = () => {
    copy(SITE_URL);
  };

  const kakaoSend = async (image: {
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
  }) => {
    const kakaoApiKey = String(import.meta.env.VITE_KAKAO_API_KEY || '').trim();

    if (!kakaoApiKey) {
      toast.error('카카오 API 키가 설정되지 않았습니다.');
      return;
    }

    try {
      await ensureKakaoSdkLoaded();

      if (!window.Kakao || !window.Kakao.Share) {
        throw new Error('Kakao SDK is unavailable');
      }

      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoApiKey);
      }

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          ...image,
          title: `${GROOM_NAME} ❤ ${BRIDE_NAME} 결혼합니다`,
          description: `${WEDDING_DATE} ${WEDDING_TIME}\n${WEDDING_LOCATION} ${WEDDING_LOCATION_NAME}`,
          link: {
            mobileWebUrl: kakaoShareUrl,
            webUrl: kakaoShareUrl,
          },
        },
        buttons: [
          {
            title: '모바일 청첩장 보기',
            link: {
              mobileWebUrl: kakaoShareUrl,
              webUrl: kakaoShareUrl,
            },
          },
        ],
      });
    } catch (error) {
      console.error('[Kakao Share Error]', error);
      toast.error(
        '카카오 공유 실패: SDK 차단(확장프로그램) 또는 Kakao Developers 도메인 등록을 확인해주세요.',
      );
    }
  };

  const kakaoShareFeed = async () => {
    const rawImageUrl = BANNERIMAGE.startsWith('http')
      ? BANNERIMAGE
      : `${kakaoShareUrl.replace(/\/$/, '')}${BANNERIMAGE}`;
    const imageUrl = appendCacheBuster(rawImageUrl, SHARE_IMAGE_VERSION);

    await kakaoSend({
      imageUrl,
      imageWidth: 600,
      imageHeight: 450,
    });
  };

  return (
    <div className='w-full max-w-md px-6'>
      <div className='relative overflow-hidden rounded-2xl border border-sky-200/70 from-white via-sky-50 to-cyan-50 px-5 py-6'>
        <div className='relative z-10'>
          <p className='text-center text-[11px] font-semibold tracking-[0.2em] text-sky-600'>
            SHARE
          </p>
          <h3 className='mt-1 text-center text-lg font-bold text-slate-800'>
            청첩장 공유하기
          </h3>
          <p className='mt-2 text-center text-sm text-slate-600'>
            소중한 분들께 초대장을 전달해 주세요.
          </p>

          <div className='mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2'>
            <Button
              type='button'
              variant='outline'
              className='h-11 rounded-xl border-slate-300 bg-white text-slate-700 transition-all hover:bg-slate-100 active:scale-[0.99]'
              onClick={onCopy}
            >
              <Link className='h-4 w-4' />
              링크 복사하기
            </Button>
            <Button
              type='button'
              variant='outline'
              className='h-11 rounded-xl border-[#f4dd45] bg-[#fee500] text-[#191919] shadow-sm transition-all hover:bg-[#f6de00] hover:text-[#191919] active:scale-[0.99]'
              onClick={kakaoShareFeed}
            >
              <span className='inline-flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='1em'
                  height='1em'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M12 3c5.8 0 10.501 3.664 10.501 8.185c0 4.52-4.701 8.184-10.5 8.184a13.51 13.51 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866c0-4.52 4.7-8.185 10.5-8.185Zm5.908 8.06l1.47-1.424a.472.472 0 0 0-.656-.678l-1.928 1.866V9.282a.472.472 0 0 0-.944 0v2.557a.472.472 0 0 0 0 .222V13.5a.472.472 0 0 0 .944 0v-1.363l.427-.413l1.428 2.033a.472.472 0 1 0 .773-.543l-1.514-2.155Zm-2.958 1.924h-1.46V9.297a.472.472 0 0 0-.943 0v4.159c0 .26.21.472.471.472h1.932a.472.472 0 1 0 0-.944Zm-5.857-1.091l.696-1.708l.638 1.707H9.093Zm2.523.487l.002-.016a.469.469 0 0 0-.127-.32l-1.046-2.8a.69.69 0 0 0-.627-.474a.696.696 0 0 0-.653.447l-1.662 4.075a.472.472 0 0 0 .874.357l.332-.813h2.07l.298.8a.472.472 0 1 0 .884-.33l-.345-.926ZM8.294 9.302a.472.472 0 0 0-.471-.472H4.578a.472.472 0 1 0 0 .944h1.16v3.736a.472.472 0 0 0 .944 0V9.774h1.14a.472.472 0 0 0 .472-.472Z'
                  ></path>
                </svg>
              </span>
              카카오톡으로 초대장 보내기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
