import Layout from '@/common/components/layout';
import Intersect from '@/common/components/intersect';
import SplashScreen from '@components/splash-screen';
import VideoPlayer from '@/components/video-player';
import WeddingInvitation from '@/components/wedding-invitation';
import Phrase from '@/components/phrase';
import Contact from '@/components/contact';
import WeddingDayTemplate from './common/components/ui/specific/wedding/WeddingDayTemplate';
import Gallery from '@/components/gallery';
import MapNaver from '@/components/map-naver';
import MapInfo from '@/components/map-info';
import BankAccordion from '@/components/bank-accordion';
import CommentFormDialog from '@/components/comment-form-dialog';
import CommentList from '@/components/comment-list';
import Share from '@/components/share';
import BannerImage from '@/components/banner-image';
import BackgroundMusic from '@/components/background-music';
import { useEffect, useState } from 'react';
import { Camera, ExternalLink } from 'lucide-react';
import {
  BRIDE_ACCOUNTS,
  BEST_PHOTO_FORM_DESCRIPTION,
  BEST_PHOTO_FORM_URL,
  BEST_PHOTO_MISSIONS,
  GALLERY_IMAGES,
  GROOM_ACCOUNTS,
  getBestPhotoFormOpenDetails,
  POSTER_URL,
  VIDEO_URL,
  WEDDING_INVITATION_IMAGE,
  isBestPhotoFormOpen,
} from '../config';

function App() {
  const [hasVideoError, setHasVideoError] = useState(false);
  const [, setMessageAdded] = useState(false);
  const [nowTimestamp, setNowTimestamp] = useState(Date.now);
  const isPhotoUploadOpen = isBestPhotoFormOpen(nowTimestamp);
  const hasVideo = Boolean(VIDEO_URL) && !hasVideoError;

  useEffect(() => {
    const { isValidDate, timestamp } = getBestPhotoFormOpenDetails();
    setNowTimestamp(Date.now());

    if (!isValidDate || Date.now() >= timestamp) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setNowTimestamp(Date.now());
    }, timestamp - Date.now());

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <SplashScreen />
      <Layout>
        <BackgroundMusic />
        {/* 비디오 또는 배너 이미지 */}
        <section className='w-full'>
          {hasVideo ? (
            <VideoPlayer
              videoUrl={VIDEO_URL}
              posterUrl={POSTER_URL}
              onVideoError={() => setHasVideoError(true)}
            />
          ) : (
            <Intersect>
              <BannerImage />
            </Intersect>
          )}
        </section>
        {/* 결혼 초대장 */}
        <section className='bg-background mt-10'>
          <Intersect>
            <WeddingInvitation />
            <div className='mt-10'>
              <img
                className='w-full h-full  pointer-events-none'
                src={WEDDING_INVITATION_IMAGE}
                alt='결혼사진'
              />
            </div>
          </Intersect>
        </section>
        {/* 결혼 청접장 문구 & 연락처 */}
        <section className='text-sm mt-20'>
          <Intersect>
            <Phrase />
          </Intersect>
          <Intersect>
            <Contact />
          </Intersect>
        </section>
        {/* 결혼식 날짜 */}
        <section className='my-20'>
          <Intersect>
            <WeddingDayTemplate />
          </Intersect>
        </section>
        {/* 결혼식 갤러리 */}
        <section className='my-20'>
          <Intersect>
            <Gallery images={GALLERY_IMAGES} />
          </Intersect>
        </section>
        {/* 찾아오시는 길*/}
        <section className='my-20'>
          <Intersect>
            <h2 className='text-center pb-10'>오시는 길</h2>
            <MapNaver />
            <MapInfo />
          </Intersect>
        </section>
        {/* 계좌번호 */}
        <section className='my-24'>
          <Intersect>
            <div className='flex flex-col justify-center items-center'>
              <h2 className='text-center text-2xl mb-5'>마음 전하실 곳</h2>
              <div className='text-center text-base leading-8'>
                참석이 어려우신 분들을 위해
                <br />
                계좌번호를 기재하였습니다.
                <br /><br />
                보내주신 따뜻한 마음에 깊이 감사드립니다.
              </div>
            </div>
            <BankAccordion title='신랑측 계좌번호' bankList={GROOM_ACCOUNTS} />
            <BankAccordion title='신부측 계좌번호' bankList={BRIDE_ACCOUNTS} />
          </Intersect>
        </section>
        {/* 방명록 */}
        <section className='mt-20 px-6 pb-10'>
          <Intersect>
            <div className='mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-emerald-200/70 from-white via-emerald-50 to-teal-50 p-6'>
              <p className='text-center text-[11px] font-semibold tracking-[0.2em] text-emerald-600'>
                GUESTBOOK
              </p>
              <h2 className='mt-1 text-center text-2xl font-bold text-slate-800'>
                방명록
              </h2>
              <p className='mt-2 text-center text-sm leading-6 text-slate-600'>
                마음을 담은 한마디를 남겨주세요.
              </p>

              <div className='mt-5 text-center'>
                <CommentFormDialog
                  onSuccess={() => setMessageAdded((prev) => !prev)}
                />
              </div>

              <div className='mt-5'>
                <CommentList
                  onMessageAdded={() => setMessageAdded((prev) => !prev)}
                />
              </div>
            </div>
          </Intersect>
        </section>
        <div className='mx-auto w-full max-w-md px-6'>
          <div className='relative overflow-hidden rounded-[28px] border border-stone-200 bg-[#f8f3ee] px-6 py-8 shadow-[0_12px_30px_rgba(120,104,88,0.08)]'>
            <div className='relative z-10 text-center'>
              <p className='text-center text-[11px] font-semibold tracking-[0.2em] text-rose-600'>
                GUEST SNAP
              </p>
              <h2 className='mt-1 mb-5 text-center text-2xl font-bold text-slate-800'>
                게스트 스냅
              </h2>
              <div className='border-t border-dashed border-stone-300/90 pb-8' />
              <p className='text-[22px] leading-none text-stone-500'>📸 저희의 스냅 작가가 되어주세요! 📸</p>
              <div className='mt-7 space-y-5 text-stone-600'>
                <div className='space-y-2'>
                  <p className='text-[22px] leading-8'>[미션! 이 순간들을 놓치지 마세요!]</p>
                  <ol className='space-y-1 text-[18px] leading-8'>
                    {BEST_PHOTO_MISSIONS.slice(0, 8).map((mission, index) => (
                      <li key={mission}>
                        {index + 1}. {mission}
                      </li>
                    ))}
                  </ol>
                  <p className='text-[18px] leading-8'>(오늘 주인공은 저희뿐만이 아니에요!)</p>
                  <ol
                    className='space-y-1 text-[18px] leading-8'
                    start={9}
                  >
                    {BEST_PHOTO_MISSIONS.slice(8).map((mission, index) => (
                      <li key={mission}>
                        {index + 9}. {mission}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className='space-y-2 text-[15px] leading-8'>
                  <p className='inline-flex items-center justify-center font-bold'>
                    🎁 가장 멋진 사진을 남겨주신 분께 기프티콘을 쏩니다!
                  </p>
                </div>

                <div className='space-y-1 text-[19px] leading-8 text-stone-700'>
                  <p>당일날, 아래 공유 버튼을 통해 올려주세요!</p>
                  <p>많은 참여 부탁드려요! 💖</p>
                </div>
              </div>

              {isPhotoUploadOpen ? (
                <a
                  href={BEST_PHOTO_FORM_URL}
                  target='_blank'
                  rel='noreferrer'
                  className='group mx-auto mt-8 inline-flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-[#efcfb9] px-5 text-[17px] text-white shadow-[0_10px_24px_rgba(208,171,145,0.35)] transition hover:bg-[#e6bea2]'
                >
                  <Camera className='h-4 w-4' />
                  사진 및 영상 업로드
                  <ExternalLink className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
                </a>
              ) : (
                <button
                  type='button'
                  disabled
                  aria-disabled='true'
                  className='mx-auto mt-8 inline-flex h-14 w-full max-w-xs items-center justify-center rounded-2xl bg-[#efcfb9]/75 px-5 text-[17px] text-white/95 shadow-[0_10px_24px_rgba(208,171,145,0.2)] opacity-80'
                >
                  사진 및 영상 업로드 (5월 10일 OPEN)
                </button>
              )}

              <p className='mt-3 text-[13px] leading-6 text-stone-500'>
                {BEST_PHOTO_FORM_DESCRIPTION}
              </p>
            </div>
          </div>
        </div>
        {/* 공유하기 */}
        <footer className='relative mt-20 pb-10'>
          <div className='flex items-center justify-center'>
            <Share />
          </div>
        </footer>
      </Layout>
    </>
  );
}

export default App;
